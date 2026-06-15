# Grimorio RPG - Gerenciador de Personagens

## Ideia do Projeto

O Grimorio RPG e uma aplicacao fullstack para criacao, organizacao e consulta de fichas de personagens de RPG no estilo D&D.

O sistema permite cadastrar personagens, editar fichas, remover registros, visualizar detalhes em modal, filtrar a biblioteca de herois e vincular personagens a campanhas.

O projeto segue a arquitetura em camadas ensinada em aula:

| Camada | Organizacao |
| --- | --- |
| Backend | Express.js + TypeScript, seguindo `Route -> Controller -> Service -> Model -> SQLite` |
| Frontend | HTML5 + Bootstrap + JavaScript puro, seguindo `Config -> API -> Services -> State -> UI -> Main` |

## Funcionalidades Principais

- CRUD completo de personagens: criar, listar, editar, remover e detalhar.
- Cadastro e listagem de campanhas.
- Vinculo de personagens com campanhas.
- Filtros por nome, classe, raca e origem.
- Ordenacao por nome, nivel e data de criacao.
- Calculo automatico dos modificadores de atributos.
- Persistencia dos dados em SQLite apos reiniciar a API.

## Classes do Dominio

### 1. Personagem

Representa uma ficha de personagem de RPG.

| Atributo | Tipo | Descricao |
| --- | --- | --- |
| `id` | number | Identificador unico auto-incrementado |
| `nome` | string | Nome do personagem |
| `classe` | string | Classe ou vocacao do personagem |
| `raca` | string | Raca do personagem |
| `origem` | string | Origem narrativa do personagem |
| `descricao` | string | Historia ou descricao fisica |
| `nivel` | number | Nivel entre 1 e 20 |
| `atributos` | object | Valores de forca, destreza, constituicao, inteligencia, sabedoria e carisma |
| `campanhaId` | number/null | FK para a campanha vinculada |
| `criadoEm` | string | Timestamp de criacao |

### 2. Campanha

Representa uma aventura ou grupo de jogo.

| Atributo | Tipo | Descricao |
| --- | --- | --- |
| `id` | number | Identificador unico auto-incrementado |
| `nome` | string | Nome da campanha |
| `descricao` | string/null | Breve descricao da campanha |
| `criadaEm` | string | Timestamp de criacao |

### 3. Atributos

Representa os seis atributos principais de uma ficha.

| Atributo | Tipo | Descricao |
| --- | --- | --- |
| `forca` | number | Poder fisico |
| `destreza` | number | Agilidade e reflexos |
| `constituicao` | number | Resistencia e vitalidade |
| `inteligencia` | number | Raciocinio e conhecimento |
| `sabedoria` | number | Percepcao e intuicao |
| `carisma` | number | Presenca e persuasao |

O modificador e calculado com:

```js
Math.floor((atributo - 10) / 2)
```

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Backend | Node.js + Express.js + TypeScript |
| Banco de dados | SQLite + better-sqlite3 |
| Frontend | HTML5 + Bootstrap 5 + JavaScript puro |
| Estilo | Bootstrap 5 + CSS customizado |
| Build | tsc |
| Testes | node:test + tsx |

## Persistencia com SQLite

O schema e criado em `grimorio-api/src/db.ts`.

| Tabela | Finalidade |
| --- | --- |
| `campanhas` | Armazena campanhas cadastradas |
| `personagens` | Armazena fichas de personagens |

A tabela `personagens` possui FK para `campanhas` por meio de `campanhaId`.

Arquivos de banco (`*.db`) sao dados locais de execucao e nao devem ser versionados.

## Como Rodar

### Backend

```bash
cd grimorio-api
npm install
npm run dev
```

A API fica em `http://localhost:3000`.

### Frontend

```bash
cd grimorio-frontend
npm run dev
```

O frontend fica em `http://localhost:5500`.

## Scripts da API

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia a API em desenvolvimento |
| `npm run build` | Compila o TypeScript |
| `npm start` | Executa a versao compilada |
| `npm test` | Executa os testes automatizados |
