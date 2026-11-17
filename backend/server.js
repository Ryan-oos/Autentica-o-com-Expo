require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// ── SEGURANÇA: Limitar origens do CORS (não aceitar qualquer origem) ──
app.use(cors({
  origin: '*', // Em produção, trocar pelo IP/domínio do app
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── SEGURANÇA: Limitar tamanho do body para evitar ataques de payload grande ──
app.use(express.json({ limit: '1mb' }));

// ── SEGURANÇA: Headers de segurança ──
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ── SEGURANÇA: Rate limiting simples para evitar brute force ──
const loginAttempts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return true;
  // Limpar tentativas antigas
  if (now - record.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.delete(ip);
    return true;
  }
  return record.count < MAX_ATTEMPTS;
}

function recordAttempt(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now - record.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    record.count++;
  }
}

// ── SEGURANÇA: Validação de entrada ──
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 255); // Limitar tamanho máximo
}

// ---------- CADASTRO ----------
app.post('/register', async (req, res) => {
  const name = sanitizeInput(req.body.name);
  const email = sanitizeInput(req.body.email).toLowerCase();
  const password = req.body.password;

  // Validações
  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Nome deve ter pelo menos 2 caracteres.' });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hash]
    );
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }
    console.error('Erro no cadastro:', err.message);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// ---------- LOGIN ----------
app.post('/login', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;

  // Rate limiting
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Muitas tentativas. Tente novamente em 15 minutos.' });
  }

  const email = sanitizeInput(req.body.email).toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      recordAttempt(ip);
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      recordAttempt(ip);
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// ── SEGURANÇA: Rota 404 para paths desconhecidos ──
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.listen(process.env.PORT, () =>
  console.log(`API rodando na porta ${process.env.PORT}`)
);
