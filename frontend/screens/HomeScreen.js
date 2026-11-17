import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    SecureStore.getItemAsync('user').then((raw) => {
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch {
          // JSON corrompido — fazer logout de segurança
          handleLogout();
        }
      } else {
        // Sem dados de usuário — voltar pro login
        navigation.replace('Login');
      }
    });
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    navigation.replace('Login');
  };

  const confirmLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: handleLogout },
    ]);
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Bem-vindo, {user?.name}!</Text>
      <Button title="Sair" onPress={confirmLogout} color="red" />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 24 },
});
