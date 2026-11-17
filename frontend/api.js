const API_URL = 'http://192.168.1.22:3001';

export async function register(name, email, password) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  } catch (err) {
    return { error: 'Erro de conexão. Verifique se o servidor está rodando.' };
  }
}

export async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  } catch (err) {
    return { error: 'Erro de conexão. Verifique se o servidor está rodando.' };
  }
}
