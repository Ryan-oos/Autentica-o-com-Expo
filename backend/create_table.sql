-- Execute este SQL no Neon SQL Editor (https://console.neon.tech)
-- para criar a tabela de usuarios

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
