# Amazon Brasil — Testes Automatizados E2E

Projeto de automação de testes E2E para a plataforma [Amazon Brasil](https://www.amazon.com.br), desenvolvido como parte de uma avaliação técnica para vaga de QA Sênior.

---

## 🧪 Tecnologias utilizadas

| Ferramenta | Versão | Finalidade |
|---|---|---|
| [Cypress](https://www.cypress.io/) | 15.3.0 | Framework de automação E2E |
| [Cucumber (BDD)](https://github.com/badeball/cypress-cucumber-preprocessor) | ^24.0.1 | Escrita de cenários em Gherkin |
| [TypeScript](https://www.typescriptlang.org/) | ^6.0.0 | Tipagem estática |
| [Allure Report](https://allurereport.org/) | ^3.5.0 | Relatório visual de execução |
| [cypress-real-events](https://github.com/dmtrKovalenko/cypress-real-events) | ^1.15.0 | Eventos reais de mouse/teclado |
| [esbuild](https://esbuild.github.io/) | via preprocessor | Transpilação rápida do TypeScript |

---

## 📁 Estrutura do projeto

```
amazon/
├── cypress/
│   ├── e2e/
│   │   ├── features/
│   │   │   ├── search-products.feature   # Cenários BDD de busca e carrinho
│   │   │   └── responsiveness.feature    # Cenários BDD de responsividade
│   │   └── steps/
│   │       ├── search-products.steps.ts  # Steps da feature de busca/carrinho
│   │       ├── responsiveness.steps.ts   # Steps da feature de responsividade
│   │       └── shared.steps.ts           # Steps e hooks globais
│   ├── support/
│   │   ├── commands.ts                   # Custom commands do Cypress
│   │   ├── e2e.ts                        # Entry point do support
│   │   ├── pages/
│   │   │   ├── home/                     # Page Object da página inicial
│   │   │   ├── cart/                     # Page Object do carrinho
│   │   │   └── index.ts                  # Barrel export das pages
│   │   ├── helpers/
│   │   │   ├── parse-blr-price.ts        # Parser de preço BRL → number
│   │   │   ├── is-descending-order.ts    # Validação de ordenação
│   │   │   └── index.ts                  # Barrel export dos helpers
│   │   └── types/
│   │       └── index.d.ts                # Tipagem dos custom commands
│   ├── fixtures/
│   │   └── search.json                   # Dados de entrada dos testes
│   └── reports/
│       └── json/                         # Relatórios gerados pelo Cucumber
├── config.ts                             # Configuração de ambientes
├── env.json                              # URLs por ambiente (prod/homolog/local)
├── cypress.config.ts                     # Configuração principal do Cypress
├── tsconfig.json                         # Configuração TypeScript
└── .nvmrc                                # Versão do Node recomendada
```

---

## 🚀 Pré-requisitos

- **Node.js** `v24.14.1` (recomendado via [nvm](https://github.com/nvm-sh/nvm))
- **npm** `v10+`
- **Java** `11+` — necessário para gerar o relatório Allure
- **Allure CLI** — instalado automaticamente via `allure-commandline` no `npm install`

Para usar a versão correta do Node via nvm:

```bash
nvm use
```

---

## ⚙️ Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd amazon

# Instale as dependências
npm install
```

---

## ▶️ Executando os testes

### Modo interativo (Cypress App)

```bash
npm run cy:open:prod
```

Abre a interface gráfica do Cypress. Ideal para desenvolvimento e debug.

### Modo headless (CI/linha de comando)

```bash
npm run cy:run:prod
```

Executa todos os testes em background via Chrome. Gera os resultados do Allure em `allure-results/`.

### Modo headed (headless com browser visível)

```bash
npm run cy:run:headed:prod
```

### Executar uma tag específica

```bash
npx cypress run --env env=prod --config "specPattern=**/*.feature" --env TAGS="@ct-001"
```

Tags disponíveis:

| Tag | Escopo |
|---|---|
| `@search` | Todos os cenários de busca de produtos |
| `@e2e` | Suite completa de busca + carrinho |
| `@autocomplete` | Cenário de sugestões do autocomplete |
| `@ct-001` | Busca com termo válido + autocomplete |
| `@ct-002` | Ordenação por preço |
| `@ct-003` | Adição ao carrinho |
| `@ct-004` | Alteração de quantidade |
| `@ct-005` | Remoção do carrinho |
| `@responsiveness` | Todos os cenários de responsividade |
| `@home` | Responsividade dos elementos da home |
| `@smoke` | Smoke test de responsividade da home |

---

## 📊 Relatório Allure

Após a execução dos testes, gere e visualize o relatório completo:

```bash
# 1. Gera o relatório HTML a partir dos resultados
npm run allure:generate

# 2. Abre o relatório no navegador
npm run allure:open
```

Ou, para gerar e abrir em um único passo (via servidor local):

```bash
npm run allure:serve
```

O relatório exibe: cenários executados, status (passed/failed/skipped), duração, steps detalhados e screenshots em caso de falha.

---

## 🗂️ Cenários cobertos

### Busca de Produtos e Gerenciamento do Carrinho

| Tag | Cenário | Descrição |
|---|---|---|
| `@ct-001` | Busca com termo válido | Valida resultados, URL e campo de busca preenchido |
| `@ct-001` `@autocomplete` | Autocomplete | Verifica sugestões ao digitar sem confirmar |
| `@ct-002` | Ordenação por preço | Valida ordem decrescente e persistência via reload |
| `@ct-003` | Adição ao carrinho | Valida incremento do contador e presença do item |
| `@ct-004` | Alteração de quantidade | Valida recálculo do subtotal via stepper |
| `@ct-005` | Remoção do carrinho | Valida remoção do item e zeragem do contador |

### Responsividade

| Tag | Cenário | Descrição |
|---|---|---|
| `@home` `@smoke` | Elementos críticos da home | Valida logo, barra de busca e ícone do carrinho nos viewports desktop, tablet e mobile |
| `@search` | Elementos críticos da listagem | Valida listagem, seletor de ordenação e cards de produto nos viewports desktop, tablet e mobile |

---

## 🌍 Ambientes disponíveis

Configurados em `env.json` e selecionáveis via flag `--env env=<ambiente>`:

| Ambiente | URL |
|---|---|
| `prod` | https://amazon.com.br |
| `homolog` | https://amazon.dev |
| `local` | http://localhost:3000 |

Exemplo:
```bash
npx cypress run --env env=homolog
```

---

## 🏗️ Decisões técnicas

**Page Object Model com separação de elementos** — cada page possui um arquivo `.elements.ts` com os seletores e um `.page.ts` com os métodos de interação. Isso isola mudanças de seletores sem afetar a lógica dos testes.

**BDD com Gherkin em português** — cenários escritos em `pt-BR` para facilitar a leitura por stakeholders não técnicos, mantendo rastreabilidade direta com os casos de teste manuais.

**`testIsolation: false`** — desabilitado intencionalmente para permitir que cenários de carrinho compartilhem estado de sessão dentro da mesma feature.

**`cy.intercept` no `searchFor`** — o intercept do endpoint de autocomplete é registrado antes do `type` para garantir que a requisição seja capturada corretamente, validando também a camada de rede além da UI.

**`cypress-on-fix`** — utilizado para corrigir o comportamento padrão do Cypress que impede múltiplos plugins de registrarem handlers no mesmo evento `on`, necessário para compatibilidade entre Cucumber e Allure.

**Allure com `environmentInfo`** — o relatório captura automaticamente OS, versão do Node e plataforma de execução para rastreabilidade do ambiente de teste.

---

## 📝 Observações

- Os testes interagem com o ambiente de produção da Amazon Brasil. Comportamentos como CAPTCHA, banners de login ou alterações no layout podem causar falhas pontuais fora do controle da automação.
- Exceções não capturadas geradas pelos scripts internos da Amazon (`rd-script-*.js`) são ignoradas via `Cypress.on('uncaught:exception', () => false)` para evitar falhas espúrias.
- O projeto utiliza `cypress-real-events` para simular interações reais de mouse, necessárias para acionar elementos que não respondem a eventos sintéticos do Cypress.
