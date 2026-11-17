# Expo + Neon Auth — Cadastro, Login e Logout

App mobile com Expo (React Native em JavaScript puro) que faz **cadastro**, **login** e **logout** usando banco de dados PostgreSQL na nuvem (**Neon**).

---

## 📁 Estrutura do Projeto

```
expo-neon-auth/
├── backend/
│   ├── .env              # Variáveis de ambiente (DATABASE_URL, JWT_SECRET, PORT)
│   ├── server.js          # API Express (cadastro + login)
│   ├── create_table.sql   # SQL para criar tabela no Neon
│   ├── package.json
│   └── node_modules/
└── frontend/
    ├── App.js             # Navegação principal
    ├── api.js             # Funções de chamada à API
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   └── HomeScreen.js
    ├── package.json
    └── node_modules/
```

---

## 🚀 Como rodar

### 1. Configurar o banco Neon

1. Acesse [neon.tech](https://neon.tech) e crie uma conta gratuita
2. Crie um projeto (qualquer nome)
3. No **SQL Editor**, rode o conteúdo de `backend/create_table.sql`
4. Copie a **connection string** (`postgres://user:pass@host/neondb?sslmode=require`)

### 2. Configurar o backend

```bash
cd backend
```

Edite o arquivo `.env` com sua connection string do Neon:

```
DATABASE_URL=postgres://SEU_USUARIO:SUA_SENHA@SEU_HOST/neondb?sslmode=require
JWT_SECRET=segredo_super_secreto
PORT=3001
```

Inicie o servidor:

```bash
node server.js
```

### 3. Configurar o frontend

Descubra o IP da sua máquina:

```bash
ipconfig
```

Edite `frontend/api.js` e troque `SEU_IP_LOCAL` pelo seu IP (ex: `192.168.0.10`):

```js
const API_URL = 'http://192.168.0.10:3001';
```

Inicie o app:

```bash
cd frontend
npx expo start
```

Escaneie o QR code com o **Expo Go** no celular.

---

## 📱 Resultado esperado

| Tela      | Ação                                                 |
|-----------|------------------------------------------------------|
| Cadastro  | Preenche nome, e-mail e senha → salva no Neon        |
| Login     | Autentica e guarda o token com SecureStore            |
| Home      | Exibe o nome do usuário e botão "Sair"               |
| Logout    | Remove token e volta para o Login                    |

---

## 🛠 Tecnologias

- **Frontend:** React Native + Expo (JavaScript puro)
- **Backend:** Node.js + Express
- **Banco de dados:** PostgreSQL (Neon - nuvem)
- **Autenticação:** bcryptjs + jsonwebtoken (JWT)
- **Armazenamento seguro:** expo-secure-store
- **Navegação:** React Navigation
