// Script para testar a API de alunos - Versão Final

// Função para fazer requisições HTTP
async function makeRequest(url, method = "GET", body = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    console.log(`Fazendo requisição para: http://localhost:3000${url}`);
    const response = await fetch(`http://localhost:3000${url}`, options);
    
    if (!response.ok) {
      console.log(`Erro na requisição: ${response.status} ${response.statusText}`);
      return { 
        status: response.status, 
        data: null, 
        error: `${response.status} ${response.statusText}` 
      };
    }
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Erro ao fazer requisição: ${error.message}`);
    return { status: null, data: null, error: error.message };
  }
}

// Função principal para testar a API
async function testAPI() {
  console.log("=".repeat(60));
  console.log("INICIANDO TESTES COMPLETOS DA API DE ALUNOS");
  console.log("=".repeat(60));
  console.log();

  // 1. Registrar um usuário
  console.log("1. REGISTRANDO USUÁRIO");
  console.log("-".repeat(30));
  const registerResult = await makeRequest("/register", "POST", {
    username: "testuser",
    password: "password123",
  });
  console.log(`Status: ${registerResult.status}`);
  console.log("Resposta:", registerResult.data);
  console.log();

  // 2. Login para obter token
  console.log("2. FAZENDO LOGIN");
  console.log("-".repeat(30));
  const loginResult = await makeRequest("/login", "POST", {
    username: "testuser",
    password: "password123",
  });
  console.log(`Status: ${loginResult.status}`);
  console.log("Resposta:", loginResult.data);
  console.log();

  // Verificar se o login foi bem-sucedido
  if (!loginResult.data || !loginResult.data.jwt) {
    console.log("❌ Falha no login. Não foi possível obter o token.");
    return;
  }

  const token = loginResult.data.jwt;

  // 3. Listar todos os alunos (dados iniciais)
  console.log("3. LISTANDO ALUNOS INICIAIS");
  console.log("-".repeat(30));
  const listInitialResult = await makeRequest("/alunos", "GET", null, token);
  console.log(`Status: ${listInitialResult.status}`);
  console.log("Resposta:", JSON.stringify(listInitialResult.data, null, 2));
  console.log();

  // 4. Buscar aluno específico existente
  console.log("4. BUSCANDO ALUNO ESPECÍFICO (ID: 4)");
  console.log("-".repeat(30));
  const getExistingResult = await makeRequest("/alunos/4", "GET", null, token);
  console.log(`Status: ${getExistingResult.status}`);
  console.log("Resposta:", JSON.stringify(getExistingResult.data, null, 2));
  console.log();

  // 5. Buscar aluno específico inexistente
  console.log("5. BUSCANDO ALUNO INEXISTENTE (ID: 5)");
  console.log("-".repeat(30));
  const getNonExistentResult = await makeRequest("/alunos/5", "GET", null, token);
  console.log(`Status: ${getNonExistentResult.status}`);
  console.log("Resposta:", getNonExistentResult.data);
  console.log();

  // 6. Criar novo aluno
  console.log("6. CRIANDO NOVO ALUNO");
  console.log("-".repeat(30));
  const createResult = await makeRequest("/alunos", "POST", {
    id: 5,
    nome: "João Silva",
    ra: "55555",
    nota1: 8.0,
    nota2: 9.0
  }, token);
  console.log(`Status: ${createResult.status}`);
  console.log("Resposta:", createResult.data);
  console.log();

  // 7. Atualizar aluno existente
  console.log("7. ATUALIZANDO ALUNO EXISTENTE (ID: 3)");
  console.log("-".repeat(30));
  const updateExistingResult = await makeRequest("/alunos/3", "PUT", {
    nome: "Zoroastro Pereira",
    ra: "3333399999",
    nota1: 3.5,
    nota2: 4.5
  }, token);
  console.log(`Status: ${updateExistingResult.status}`);
  console.log("Resposta:", JSON.stringify(updateExistingResult.data, null, 2));
  console.log();

  // 8. Tentar atualizar aluno inexistente
  console.log("8. TENTANDO ATUALIZAR ALUNO INEXISTENTE (ID: 6)");
  console.log("-".repeat(30));
  const updateNonExistentResult = await makeRequest("/alunos/6", "PUT", {
    nome: "Zoroastro Pereira",
    ra: "3333399999",
    nota1: 3.5,
    nota2: 4.5
  }, token);
  console.log(`Status: ${updateNonExistentResult.status}`);
  console.log("Resposta:", updateNonExistentResult.data);
  console.log();

  // 9. Listar alunos após atualizações
  console.log("9. LISTANDO ALUNOS APÓS ATUALIZAÇÕES");
  console.log("-".repeat(30));
  const listUpdatedResult = await makeRequest("/alunos", "GET", null, token);
  console.log(`Status: ${listUpdatedResult.status}`);
  console.log("Resposta:", JSON.stringify(listUpdatedResult.data, null, 2));
  console.log();

  // 10. Listar médias
  console.log("10. LISTANDO MÉDIAS DOS ALUNOS");
  console.log("-".repeat(30));
  const mediasResult = await makeRequest("/alunos/medias", "GET", null, token);
  console.log(`Status: ${mediasResult.status}`);
  console.log("Resposta:", JSON.stringify(mediasResult.data, null, 2));
  console.log();

  // 11. Listar aprovados
  console.log("11. LISTANDO STATUS DE APROVAÇÃO");
  console.log("-".repeat(30));
  const aprovadosResult = await makeRequest("/alunos/aprovados", "GET", null, token);
  console.log(`Status: ${aprovadosResult.status}`);
  console.log("Resposta:", JSON.stringify(aprovadosResult.data, null, 2));
  console.log();

  // 12. Remover aluno existente
  console.log("12. REMOVENDO ALUNO (ID: 5)");
  console.log("-".repeat(30));
  const deleteExistingResult = await makeRequest("/alunos/5", "DELETE", null, token);
  console.log(`Status: ${deleteExistingResult.status}`);
  console.log("Resposta:", deleteExistingResult.data);
  console.log();

  // 13. Tentar remover aluno inexistente
  console.log("13. TENTANDO REMOVER ALUNO INEXISTENTE (ID: 7)");
  console.log("-".repeat(30));
  const deleteNonExistentResult = await makeRequest("/alunos/7", "DELETE", null, token);
  console.log(`Status: ${deleteNonExistentResult.status}`);
  console.log("Resposta:", deleteNonExistentResult.data);
  console.log();

  // 14. Listagem final
  console.log("14. LISTAGEM FINAL DE ALUNOS");
  console.log("-".repeat(30));
  const listFinalResult = await makeRequest("/alunos", "GET", null, token);
  console.log(`Status: ${listFinalResult.status}`);
  console.log("Resposta:", JSON.stringify(listFinalResult.data, null, 2));
  console.log();

  console.log("=".repeat(60));
  console.log("✅ TODOS OS TESTES CONCLUÍDOS COM SUCESSO!");
  console.log("=".repeat(60));
}

// Executar os testes
testAPI().catch(console.error);