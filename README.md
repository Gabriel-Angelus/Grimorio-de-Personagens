# Grimório RPG

Projeto fullstack simples para criação, visualização e armazenamento de fichas de personagens de RPG no estilo D&D.

A aplicação permite cadastrar personagens, organizar fichas em campanhas, filtrar a biblioteca de heróis e visualizar os atributos principais com seus modificadores.

## Tecnologias

- HTML5
- CSS3
- Bootstrap
- JavaScript puro com módulos ES
- Node.js
- Express.js
- API REST
- Armazenamento em memória no backend

## Funcionalidades

- Listar personagens cadastrados.
- Criar novo personagem.
- Editar ficha existente.
- Remover personagem.
- Visualizar ficha completa em modal.
- Filtrar por nome, classe, raça e origem.
- Ordenar personagens por nome, nível ou data.
- Cadastrar campanhas.
- Vincular personagem a uma campanha.
- Calcular modificadores dos atributos.

## Classes principais

### Personagem

Representa uma ficha de RPG.

Campos principais:

- `id`
- `nome`
- `classe`
- `raca`
- `origem`
- `nivel`
- `atributos`
- `campanhaId`

Responsável por guardar os dados centrais da ficha e permitir a exibição dos modificadores de atributos.

### Atributos

Representa os seis atributos básicos do personagem:

- `forca`
- `destreza`
- `constituicao`
- `inteligencia`
- `sabedoria`
- `carisma`

O modificador é calculado com a regra:

```js
Math.floor((atributo - 10) / 2)
```

### Campanha

Representa uma aventura ou grupo de jogo.

Campos principais:

- `id`
- `nome`
- `descricao`
- `criadaEm`

Uma campanha pode agrupar vários personagens.

## Funções e camadas importantes

### Backend

Fluxo:

```txt
Route -> Controller -> Service -> Model
```

Principais responsabilidades:

- `routes`: definem os endpoints da API.
- `controllers`: recebem as requisições e enviam respostas.
- `services`: concentram regras de negócio e validações.
- `models`: armazenam os dados em memória.
- `middleware`: registra logs e trata erros.

Endpoints principais:

```txt
GET    /personagens
GET    /personagens/:id
POST   /personagens
PUT    /personagens/:id
DELETE /personagens/:id

GET    /campanhas
GET    /campanhas/:id
POST   /campanhas
PUT    /campanhas/:id
DELETE /campanhas/:id
```

### Frontend

Fluxo:

```txt
Evento da tela -> main.js -> service -> api.js -> backend
```

Principais responsabilidades:

- `api.js`: centraliza as chamadas `fetch`.
- `services`: acessam a API por entidade.
- `state`: mantém filtros, tela atual e dados carregados.
- `ui`: renderiza cards, filtros, formulário e modal.
- `main.js`: conecta eventos da interface com os serviços.

## Estrutura

```txt
grimorio-api/
+-- src/
|   +-- app.ts
|   +-- server.ts
|   +-- routes/
|   +-- controllers/
|   +-- services/
|   +-- models/
|   +-- middleware/
+-- package.json

grimorio-frontend/
+-- index.html
+-- css/
|   +-- style.css
+-- js/
|   +-- config.js
|   +-- api.js
|   +-- main.js
|   +-- services/
|   +-- ui/
|   +-- state/
+-- frontend-server.js
+-- package.json
```

## Como rodar

### Backend

```bash
cd grimorio-api
npm install
npm run dev
```

A API fica disponível em:

```txt
http://localhost:3000
```

### Frontend

```bash
cd grimorio-frontend
npm run dev
```

O frontend fica disponível em:

```txt
http://localhost:5500
```

## Observação

O backend usa armazenamento em memória. Ao reiniciar a API, os dados cadastrados são apagados.
