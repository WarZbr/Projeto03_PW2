# API de Gerenciamento de Alunos

## URL da API
https://projeto03-pw2.onrender.com

## Endpoints Disponíveis

### Autenticação
- `POST /register` - Registrar usuário
- `POST /login` - Fazer login e obter token JWT

### Alunos (requer token)
- `GET /alunos` - Listar todos os alunos
- `GET /alunos/:id` - Buscar aluno específico
- `GET /alunos/medias` - Listar médias dos alunos
- `GET /alunos/aprovados` - Listar status de aprovação
- `POST /alunos` - Criar novo aluno
- `PUT /alunos/:id` - Atualizar aluno
- `DELETE /alunos/:id` - Remover aluno

## Como usar
1. Registre um usuário com POST /register
2. Faça login com POST /login para obter o token
3. Use o token no header Authorization: Bearer {token}
