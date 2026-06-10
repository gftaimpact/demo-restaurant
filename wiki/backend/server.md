# Documentação Técnica  
**Arquivo:** `server.js`  
**Linguagem:** JavaScript  

## Visão Geral  
Este código implementa um servidor RESTful utilizando o framework **Express**. Ele oferece múltiplos endpoints relacionados a operações de restaurante, como manipulação de pedidos, autenticação de usuários e relatórios.  
A aplicação apresenta funções, controle de fluxo e manipulação de dados, e também contém vulnerabilidades relacionadas à segurança.

---

## Estruturas de Dados  

| Nome | Tipo | Descrição |
|------|------|------------|
| `menu` | JSON | Estrutura importada de `data/menu.json`, com categorias e itens do cardápio. |
| `orders` | Array | Armazena os pedidos criados em memória. |
| `users` | Array | Contém dados de usuários, incluindo o administrador. |
| `orderIdCounter` | Number | Contador para atribuir IDs únicos aos pedidos. |

---

## Principais Funções  

| Função | Descrição | Observações |
|--------|------------|-------------|
| `generateOrderToken()` | Gera um token de pedido usando `Math.random()` e conversão para base 36. | Não seguro criptograficamente. |
| `hashPassword(password)` | Retorna um hash MD5 do valor informado. | Algoritmo de hash inseguro. |

---

## Endpoints  

| Método | Rota | Descrição |
|--------|------|------------|
| `GET` | `/api/menu` | Retorna o cardápio completo em formato JSON. |
| `POST` | `/api/login` | Autenticação do administrador com credenciais fixas. |
| `GET` | `/api/orders/search` | Busca pedidos com base no nome do cliente (via regex). |
| `GET` | `/api/report` | Lê arquivo informado via parâmetro e retorna seu conteúdo. |
| `POST` | `/api/notify` | Executa comando de sistema, notificando novos pedidos. |
| `POST` | `/api/orders` | Cria novo pedido a partir dos itens enviados. |
| `GET` | `/api/orders` | Retorna todos os pedidos armazenados. |

---

## Fluxo de Processos  
```mermaid
graph TD
  A[Início da Aplicação] --> B[Configuração de Express e CORS]
  B --> C[Habilita parsing JSON]
  C --> D{Requisição recebida}
  
  D --> |GET /api/menu| E[Retorna menu JSON]
  D --> |POST /api/login| F[Valida credenciais contra ADMINUSERNAME e ADMINPASSWORD]
  F --> |credenciais válidas| G[Calcula desconto via eval(discount)]
  G --> H[Retorna token e desconto aplicados]
  F --> |credenciais inválidas| I[Erro 401 - Invalid credentials]
  
  D --> |GET /api/orders/search?name| J[Cria expressão regular a partir de name]
  J --> K[Filtra pedidos por regex]
  K --> L[Retorna resultados]
  
  D --> |GET /api/report?file| M[Lê arquivo usando path.join]
  M --> N[Retorna conteúdo do arquivo ou erro 404]
  
  D --> |POST /api/notify| O[Executa comando shell com orderId]
  O --> P[Retorna stdout ou erro 500]
  
  D --> |POST /api/orders| Q[Valida itens do pedido]
  Q --> R[Calcula subtotal e total]
  R --> S[Gera objeto order e token]
  S --> T[Armazena em orders e retorna 201]
  
  D --> |GET /api/orders| U[Retorna lista de orders]
  U --> V[Fim]
```

---

## Vulnerabilidades Identificadas  

| ID | Tipo | Descrição |
|----|------|------------|
| VULN001 | CORS | Aceita requisições de qualquer origem. |
| VULN002 | Credenciais | Nome de usuário e senha hardcoded. |
| VULN003 | Token inseguro | Uso de `Math.random()` para geração de token. |
| VULN004 | Hash fraco | MD5 não é seguro para senhas. |
| VULN005 | Auth | Comparação direta com credenciais fixas e uso de `eval()` inseguro. |
| VULN006 | ReDoS | Expressão regular criada diretamente de entrada do usuário. |
| VULN007 | Path Traversal | Caminho de arquivo não sanitizado. |
| VULN008 | Command Injection | Execução direta de comando com entrada do usuário. |
| VULN009 | Exposição de dados | Log de informações sensíveis de pedidos. |

---

## Insights  

- A arquitetura é fortemente acoplada a dados locais e não persistentes (in-memory).  
- Uso frequente de práticas inseguras em contexto de autenticação e manipulação de dados.  
- Recomenda-se substituição por:
  - **JWT seguro e dinâmico**, com tokens criptograficamente fortes.  
  - **Funções criptográficas modernas**, como SHA-256 ou bcrypt para senhas.  
  - **Validação e sanitização** rigorosa de entradas do cliente.  
  - **Remoção de eval e exec** de parâmetros controlados pelo usuário.  
  - Implementação de **CORS restrito** e logs sem dados sensíveis.  

---
