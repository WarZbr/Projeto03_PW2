const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

// Middleware para processar JSON
app.use(express.json());

// Configurações - O Render sempre define PORT automaticamente
const JWT_SECRET = 'minha_chave_secreta_super_forte_para_jwt_123456789';
const PORT = process.env.PORT || 3000; // Render precisa desta linha

// Armazenamento em memória para usuários
const users = [];

// Armazenamento em memória para alunos - dados iniciais
const alunos = [
  {
    id: 1,
    nome: "Asdrubal",
    ra: "11111",
    nota1: 8.5,
    nota2: 9.5
  },
  {
    id: 2,
    nome: "Lupita",
    ra: "22222",
    nota1: 7.5,
    nota2: 7
  },
  {
    id: 3,
    nome: "Zoroastro",
    ra: "33333",
    nota1: 3,
    nota2: 4
  },
  {
    id: 4,
    nome: "Demóstenes",
    ra: "44444",
    nota1: 6,
    nota2: 7
  }
];

// Todo o resto do código permanece igual...
// (middleware, rotas, etc.)

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log('📚 API de gerenciamento de alunos iniciada!');
});

module.exports = app;