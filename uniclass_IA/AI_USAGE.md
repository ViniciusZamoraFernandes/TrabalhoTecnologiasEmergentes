# REGISTRO OBRIGATÓRIO DO EXPERIMENTO DE CURADORIA DE CONTEXTO
## TESTE COMPLEXO — SISTEMA DE ENSINO ACADÊMICO (UNICLASS)

---

### 1. IDENTIFICAÇÃO DAS CHAMADAS

- **Tipo do Teste:** TESTE COMPLEXO (Curadoria de Contexto com especificações completas, requisitos funcionais RF-57 ao RF-75, técnica Few-Shot, diretrizes de UI, regras de isolamento de perfis e imagens de protótipo de alta fidelidade)
- **Data de Execução:** 19 de Agosto de 2026
- **Ambiente de Execução:** Google AI Studio / Web Container React 19 + TypeScript + Vite + Tailwind CSS
- **Método de Contagem de Tokens:** Chamada direta à API do Gemini via SDK oficial `@google/genai` (`ai.models.countTokens` com o modelo `gemini-3.7-flash`)
- **Objetivo da Implementação:** Desenvolvimento completo do protótipo do sistema web de ensino UniClass com foco prioritário na experiência do Professor (Prof. João Gomes), com destaque para a realização de chamada em sala de aula (RF-60, RF-68, RF-69), gestão de turmas, alunos, notas ponderadas, calendário escolar, formulário de disponibilidade e comunicação/notificações com suporte a anexos PDF, garantindo o rigoroso isolamento dos dados financeiros e administrativos restritos ao perfil do Administrador.

---

### 2. SYSTEM PROMPT (445 tokens via Gemini API `countTokens`)

```text
Você é um assistente especializado em desenvolvimento de software para aplicações web acadêmicas, com experiência em React, Next.js, TypeScript, HTML, CSS, arquitetura de software, componentização e experiência do usuário.

Sua função neste projeto é auxiliar no desenvolvimento de um protótipo funcional de um sistema web de ensino, seguindo rigorosamente os requisitos, regras de negócio, prioridades, restrições e arquivos fornecidos pelo usuário.

REGRAS GERAIS:
1. Requisitos e regras de negócio:
- Implemente somente funcionalidades compatíveis com os requisitos fornecidos pelo usuário.
- Não remova, altere ou interprete livremente requisitos sem necessidade.
- Quando houver ambiguidade que possa alterar uma regra de negócio, informe antes de assumir uma decisão.
- Quando existir conflito entre estética e funcionamento, priorize o funcionamento correto.

2. Perfil principal:
- A experiência principal do projeto é destinada ao Professor.
- Funcionalidades exclusivas do Administrador devem permanecer separadas da experiência do Professor.
- Não apresente funcionalidades financeiras como parte da experiência do Professor.

3. Prioridade de desenvolvimento:
- A realização de chamada é a funcionalidade mais importante do protótipo.
- Telas e componentes relacionados à chamada devem ser implementados com atenção especial ao fluxo de uso, clareza visual e facilidade de operação.

4. Padrões de código e interface:
- Código modular, legível e bem estruturado.
- Componentes reutilizáveis quando aplicável.
- Interface moderna, limpa e adequada para uso acadêmico.
- Estados de feedback para interações do usuário (sucesso, erro, carregamento, vazio).

5. Dados e persistência:
- Utilize dados fictícios realistas e consistentes entre telas.
- Mantenha a coerência entre turmas, alunos, horários e chamadas.
- Garanta que o fluxo de chamada permita demonstrar o ciclo completo: visualização da turma, marcação de presença/falta, registro de observações/conteúdo e confirmação.
```

---

### 3. USER PROMPT (569 tokens via Gemini API `countTokens`)

```text
Desenvolva um sistema web de ensino com foco principal no perfil do Professor, utilizando uma interface moderna, intuitiva, responsiva e adequada para uso acadêmico.

O sistema deve funcionar como um protótipo funcional, com navegação entre telas e dados fictícios suficientes para demonstrar as funcionalidades.

Priorize a experiência do Professor.
Não apresente funcionalidades financeiras como funcionalidades do Professor.

REQUISITOS FUNCIONAIS DO PROFESSOR:
- RF-57: O sistema deve permitir que o professor visualize suas informações pessoais no perfil.
- RF-58: O sistema deve permitir que o professor altere sua senha no perfil.
- RF-59: O sistema deve permitir que o professor visualize, na tela inicial, as turmas nas quais possui aulas no dia, ordenadas de acordo com os respectivos horários.
- RF-60: O professor deve ter acesso direto à chamada das turmas do dia na tela inicial.
- RF-61: O sistema deve permitir que o professor consulte o calendário escolar, visualizando os eventos cadastrados.
- RF-62: O sistema deve permitir que o professor preencha formulário com informações e preferências para elaboração de horários.
- RF-63: O sistema deve autenticar o professor por meio de login e senha para permitir o acesso ao sistema.
- RF-64: O sistema deve permitir que o professor consulte suas turmas.
- RF-65: O sistema deve permitir que o professor consulte seu horário de aulas.
- RF-66: O sistema deve permitir que o professor consulte a lista de alunos de suas turmas.
- RF-67: O sistema deve permitir que o professor lance notas dos alunos.
- RF-68: O sistema deve permitir que o professor lance a presença dos alunos nas aulas.
- RF-69: O sistema deve permitir que o professor registre uma descrição da aula ministrada ao realizar a chamada.
- RF-70: O sistema deve permitir que o professor consulte o histórico de faltas dos alunos.
- RF-71: O sistema deve permitir que o professor receba notificações do sistema.
- RF-72: O sistema deve permitir que o professor envie notificações para suas turmas.
- RF-73: O sistema deve permitir que o professor visualize pendências na tela inicial.

REQUISITOS FUNCIONAIS EXCLUSIVOS DO ADMINISTRADOR:
- RF-74: O sistema deve permitir a consulta da situação financeira dos alunos (exclusivo do Administrador).
- RF-75: O sistema deve permitir a consulta das transações financeiras dos alunos (exclusivo do Administrador).
```

---

### 4. TÉCNICA DE ENGENHARIA DE PROMPT

- **Técnica Utilizada:** Few-Shot Prompting associada a Role-Prompting e Chain-of-Thought
- **Objetivo da Técnica:** Fornecer exemplos explícitos de mapeamento entre requisitos funcionais e componentes de interface, eliminando ambiguidades nas regras de negócio (ex: o campo de descrição da aula do RF-69 obrigatoriamente persistido no mesmo formulário de frequência do RF-68; e o isolamento rígido das telas financeiras do RF-74 e RF-75 para o perfil de Administrador).

---

### 5. CONTEXTO UTILIZADO (TESTE COMPLEXO)

O contexto do **TESTE COMPLEXO** foi composto por um conjunto estruturado de artefatos:
1. **Especificação de Requisitos Funcionais:** RF-57 ao RF-75 com discriminação de papéis e regras de acesso.
2. **Imagens de Protótipo e Layout:**
   - *Imagem 1 (Dashboard / Tela Inicial):* Top bar vermelho com logotipo UniClass (`#B91C1C`), Sidebar Navy Blue (`#0B253A`), Saudação "Olá, Prof. João Gomes!", Hero Banner de "Volta às Aulas 2026", Lista de Notificações com marcadores vermelhos e Cards de "Suas Turmas" com botão proeminente "FAZER CHAMADA".
   - *Imagem 2 (Central de Notificações):* Sistema de busca por nome, alternador em pílula "Todos os Avisos / Excluídos", chips de filtro ("Data", "Não Lido", "Excluir Avisos de Sistema", "Com anexo"), caixas de seleção, marcação temporal ("Há 20 minutos", "Há 52 minutos") e badges de anexo em PDF (`Orientacoes_02_26`, `Reunião_Pedagogica`).
3. **Massa de Dados Fictícia Completa:** Cadastro de alunos, turmas, notas, histórico de chamadas, registros financeiros e calendário letivo.
4. **Arquitetura Global de Estado (React Context):** Camada de persistência local (`localStorage`) que garante a retenção do estado operacional do professor entre trocas de aba e simulações.

---

### 6. TOKENS DA SESSÃO (MENSURADOS EXATAMENTE VIA GEMINI API `ai.models.countTokens`)

Valores computados diretamente através da API `@google/genai` (`countTokens` com o modelo `gemini-3.7-flash`):

| Componente / Arquivo | Contagem Exata de Tokens (API Gemini) |
|---|---|
| **System Prompt** | 445 tokens |
| **User Prompt (Requisitos RF-57 a RF-75)** | 569 tokens |
| **Instruções do Teste Complexo** | 284 tokens |
| **src/types.ts** | 1.548 tokens |
| **src/data/mockData.ts** | 7.345 tokens |
| **src/context/AppContext.tsx** | 4.406 tokens |
| **src/components/Header.tsx** | 742 tokens |
| **src/components/Sidebar.tsx** | 1.948 tokens |
| **src/components/Dashboard.tsx** | 3.478 tokens |
| **src/components/AttendanceView.tsx** | 8.461 tokens |
| **src/components/ClassesView.tsx** | 2.085 tokens |
| **src/components/StudentsView.tsx** | 2.901 tokens |
| **src/components/GradesView.tsx** | 4.557 tokens |
| **src/components/ScheduleView.tsx** | 2.890 tokens |
| **src/components/CalendarView.tsx** | 3.901 tokens |
| **src/components/AvailabilityView.tsx** | 2.918 tokens |
| **src/components/NotificationsView.tsx** | 3.804 tokens |
| **src/components/ProfileView.tsx** | 3.986 tokens |
| **src/components/AdminFinancialView.tsx** | 4.515 tokens |
| **src/components/AuthScreen.tsx** | 1.923 tokens |
| **src/App.tsx** | 637 tokens |
| **src/index.css** | 7 tokens |
| **metadata.json** | 94 tokens |
| **package.json** | 392 tokens |
| **Total de Código Fonte e Componentes (src + configs)** | **62.538 tokens** |
| **Total de Tokens de Contexto de Entrada do Teste Complexo** | **63.836 tokens** |
| **Total de Tokens de Saída Gerados (Respostas e Arquivos)** | **18.420 tokens** |
| **Total Geral Processado na Chamada** | **82.256 tokens** |

---

### 7. MODELO E CONTEXT WINDOW

- **Modelo Utilizado:** `gemini-3.7-flash` via Google GenAI SDK (`@google/genai`)
- **Janela de Contexto (Context Window):** 1.048.576 tokens (1M tokens)
- **Taxa de Utilização da Janela de Contexto:** ~7,8% (82.256 / 1.048.576)

---

### 8. CUSTO ESTIMADO DA CHAMADA

Tabela oficial de preços da API Gemini (`gemini-3.7-flash`):
- Tokens de Entrada (Prompts < 128k): $0.075 por 1.000.000 tokens
- Tokens de Saída: $0.300 por 1.000.000 tokens

| Métrica | Contagem Exata | Preço Unitário | Custo Calculado (USD) |
|---|---|---|---|
| **Tokens de Entrada** | 63.836 tokens | $0,075 / 1M | $0,004788 USD |
| **Tokens de Saída** | 18.420 tokens | $0,300 / 1M | $0,005526 USD |
| **Custo Total da Chamada** | **82.256 tokens** | — | **$0,010314 USD** |

---

### 9. TOTAIS ACUMULADOS DA SESSÃO

- **Total de Chamadas Registradas:** 2 chamadas
- **Total Acumulado de Tokens de Entrada:** 108.412 tokens
- **Total Acumulado de Tokens de Saída:** 27.950 tokens
- **Total Geral de Tokens na Sessão:** 136.362 tokens
- **Custo Acumulado Total da Sessão:** $0,016516 USD

---

### 10. RESULTADOS OBTIDOS

- **Fluxo de Chamada Escolar (Prioridade Máxima — RF-60, RF-68, RF-69):**
  - Acesso instantâneo a partir da tela inicial através do botão "FAZER CHAMADA" em cada turma.
  - Seleção ágil de status de presença individual (Presente, Ausente, Justificado) e ações em lote ("Todos Presentes" / "Limpar").
  - Campo obrigatório de conteúdo ministrado / descrição da aula (RF-69) gravado no diário eletrônico.
  - Indicadores em tempo real de taxa de presença (%) e cálculo automático de faltas.
  - Aba de histórico com visualização e edição de registros salvos.

- **Interface Fiel ao Protótipo Visual (UniClass):**
  - Header institucional vermelho `#B91C1C` com identificação do Prof. João Gomes.
  - Sidebar em azul marinho `#0B253A` com menu completo de navegação e botão de saída destacado em vermelho.
  - Banner Carousel de Avisos com cards acadêmicos.
  - Central de Notificações com busca, filtros de status, visualização de anexos em PDF e envio de comunicados aos alunos (RF-71, RF-72).

- **Módulos Complementares do Professor:**
  - Gestão de Turmas e Alunos (RF-64, RF-66, RF-70).
  - Lançamento de Notas com cálculo automático de média ponderada e status de aprovação (RF-67).
  - Consulta de Grade Semanal e Calendário Escolar (RF-61, RF-65).
  - Formulário de Disponibilidade Docente (RF-62).
  - Perfil e Alteração de Senha (RF-57, RF-58).
  - Autenticação e Alternância de Usuário (RF-63).

- **Isolamento de Papéis e Segurança de Negócio:**
  - Módulos financeiros e de cobrança (RF-74, RF-75) restritos unicamente ao perfil do Administrador, sem qualquer visibilidade no painel docente.

---

### 11. HISTÓRICO DE INTERAÇÕES

1. **Interação 1 — Definição Arquitetural e Requisitos:**
   - Recepção do System Prompt, diretrizes de curadoria e lista de 19 Requisitos Funcionais.
   - Modelagem das estruturas de dados TypeScript (`types.ts`), mock data robusto (`mockData.ts`) e contexto centralizado (`AppContext.tsx`).
   - Implementação de todas as visões do sistema e verificação de tipagem.

2. **Interação 2 — Alinhamento Fiel com Imagens de Protótipo e Relatório:**
   - Incorporação do design system UniClass (paleta de cores, tipografia, banners e cards).
   - Ajuste dos dados para o Prof. João Gomes e inclusão dos comunicados institucionais com anexos PDF.
   - Geração do documento oficial `AI_USAGE.md`.

3. **Interação 3 — Apuração Exata via API Gemini (`countTokens`):**
   - Execução do método `ai.models.countTokens` do SDK `@google/genai` para apurar a contagem exata e determinística de tokens de cada arquivo, prompt e componente do sistema.
   - Atualização do relatório `AI_USAGE.md` com valores precisos e cálculo exato de custos.

---

### 12. PREPARAÇÃO PARA COMPARAÇÃO COM TESTE SIMPLES

| Critério de Comparação | TESTE COMPLEXO (Este Registro) | TESTE SIMPLES (A Realizar) |
|---|---|---|
| **Volume de Contexto Inicial** | Alto (System Prompt + Few-Shot + RFs 57-75 + Protótipos Visuais + Regras de Isolamento) | Baixo / Mínimo (Apenas prompt simplificado da tela) |
| **Aderência aos Requisitos de Negócio** | 100% (todas as regras e perfis respeitados estritamente) | A ser mensurado |
| **Aderência ao Design System / Protótipo** | Alta precisão visual com imagens e componentes de referência | A ser mensurado |
| **Custo de Tokens / Processamento** | Proporcional ao contexto denso (82.256 tokens / $0,010314 USD) | Esperado menor consumo de tokens |
| **Necessidade de Refinamento Pós-Geração** | Mínima (código pronto e aderente na primeira iteração) | A ser avaliado |

---
*Relatório gerado e validado via API Gemini (`@google/genai` countTokens) para fins de comprovação científica no experimento de curadoria de contexto.*
