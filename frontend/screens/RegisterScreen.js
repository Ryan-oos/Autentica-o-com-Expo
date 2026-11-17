import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { register } from '../api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validação no frontend
    if (!name.trim() || name.trim().length < 2) {
      return Alert.alert('Erro', 'Nome deve ter pelo menos 2 caracteres.');
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Alert.alert('Erro', 'Digite um e-mail válido.');
    }
    if (!password || password.length < 6) {
      return Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres.');
    }

    setLoading(true);
    try {
      const data = await register(name.trim(), email.trim().toLowerCase(), password);
      if (data.message) {
        Alert.alert('Sucesso', data.message);
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', data.error || 'Erro desconhecido.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Cadastro</Text>
      <TextInput style={s.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput
        style={s.input}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={s.input}
        placeholder="Senha (mín. 6 caracteres)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? 'Cadastrando...' : 'Cadastrar'} onPress={handleRegister} disabled={loading} />
      <Text style={s.link} onPress={() => navigation.navigate('Login')}>
        Já tem conta? Faça login
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 12,
  },
  link: { marginTop: 16, color: 'blue', textAlign: 'center' },
});
