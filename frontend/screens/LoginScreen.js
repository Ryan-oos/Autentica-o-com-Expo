import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { login } from '../api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validação no frontend
    if (!email.trim()) {
      return Alert.alert('Erro', 'Digite seu e-mail.');
    }
    if (!password) {
      return Alert.alert('Erro', 'Digite sua senha.');
    }

    setLoading(true);
    try {
      const data = await login(email.trim().toLowerCase(), password);
      if (data.token) {
        await SecureStore.setItemAsync('token', data.token);
        await SecureStore.setItemAsync('user', JSON.stringify(data.user));
        navigation.replace('Home');
      } else {
        Alert.alert('Erro', data.error || 'Erro desconhecido.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Login</Text>
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
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
      <Text style={s.link} onPress={() => navigation.navigate('Register')}>
        Criar conta
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
