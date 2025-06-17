const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

// Middleware para processar JSON
app.use(express.json());

// Configurações fixas (sem variáveis de ambiente)
const JWT_SECRET = 'minha_chave_secreta_super_forte_para_jwt_123456789';
const PORT = 3000;

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

// Middleware para verificar autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
    req.user = user;
    next();
  });
};

// Rota básica para testar o servidor
app.get('/', (req, res) => {
  res.json({ message: 'API de gerenciamento de alunos funcionando!' });
});

// Rota para registro de usuário
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    // Verificar se o usuário já existe
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword
    };

    users.push(newUser);

    res.status(201).json({ message: 'Usuário criado!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

// Rota para login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    // Verificar se o usuário existe
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Login Incorreto!' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Login Incorreto!' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      message: `Login efetuado pelo usuário ${username}`,
      jwt: token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// IMPORTANTE: Rotas específicas antes das rotas com parâmetros
// Rota para listar médias
app.get('/alunos/medias', authenticateToken, (req, res) => {
  const medias = alunos.map(aluno => {
    const media = (aluno.nota1 + aluno.nota2) / 2;
    return {
      nome: aluno.nome,
      media: media
    };
  });

  res.json(medias);
});

// Rota para listar aprovados
app.get('/alunos/aprovados', authenticateToken, (req, res) => {
  const aprovados = alunos.map(aluno => {
    const media = (aluno.nota1 + aluno.nota2) / 2;
    const status = media >= 6 ? 'aprovado' : 'reprovado';

    return {
      nome: aluno.nome,
      status: status
    };
  });

  res.json(aprovados);
});

// Rota para listar todos os alunos
app.get('/alunos', authenticateToken, (req, res) => {
  res.json(alunos);
});

// Rota para buscar um aluno específico
app.get('/alunos/:id', authenticateToken, (req, res) => {
  const id = Number.parseInt(req.params.id);
  const aluno = alunos.find(aluno => aluno.id === id);

  if (!aluno) {
    return res.status(404).json({ message: 'Aluno não encontrado!' });
  }

  res.json(aluno);
});

// Rota para criar um aluno
app.post('/alunos', authenticateToken, (req, res) => {
  const { id, nome, ra, nota1, nota2 } = req.body;

  // Validar dados
  if (!id || !nome || !ra || nota1 === undefined || nota2 === undefined) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  // Verificar se o ID já existe
  const alunoExistente = alunos.find(aluno => aluno.id === id);
  if (alunoExistente) {
    return res.status(400).json({ message: 'Aluno com este ID já existe' });
  }

  // Criar novo aluno
  const novoAluno = { id, nome, ra, nota1, nota2 };
  alunos.push(novoAluno);

  res.status(201).json({ message: 'Aluno criado com sucesso!' });
});

// Rota para atualizar um aluno
app.put('/alunos/:id', authenticateToken, (req, res) => {
  const id = Number.parseInt(req.params.id);
  const { nome, ra, nota1, nota2 } = req.body;

  // Encontrar o índice do aluno
  const index = alunos.findIndex(aluno => aluno.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Aluno não encontrado!' });
  }

  // Atualizar aluno
  alunos[index] = {
    ...alunos[index],
    nome: nome || alunos[index].nome,
    ra: ra || alunos[index].ra,
    nota1: nota1 !== undefined ? nota1 : alunos[index].nota1,
    nota2: nota2 !== undefined ? nota2 : alunos[index].nota2
  };

  res.json(alunos[index]);
});

// Rota para remover um aluno
app.delete('/alunos/:id', authenticateToken, (req, res) => {
  const id = Number.parseInt(req.params.id);

  // Encontrar o índice do aluno
  const index = alunos.findIndex(aluno => aluno.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Aluno não encontrado!' });
  }

  // Remover aluno
  const alunoRemovido = alunos[index];
  alunos.splice(index, 1);

  res.json({ message: 'Aluno removido!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('API de gerenciamento de alunos iniciada com sucesso!');
});

module.exports = app;