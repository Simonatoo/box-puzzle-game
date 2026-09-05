# box-puzzle-game server

WebSocket API que recebe scores do jogo e salva no MongoDB.

## Rodar local

```
cd server
npm install
cp .env.example .env   # preencher com a connection string do Atlas
npm start
```

## Deploy no Render

1. Criar um novo **Web Service** no Render, apontando pro repositório.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Adicionar variável de ambiente `MONGODB_URI` com a connection string do Atlas (também setar `NODE_ENV=production`).
6. Após o deploy, o Render expõe uma URL tipo `https://box-puzzle-game-server.onrender.com` — a conexão do jogo deve usar `wss://box-puzzle-game-server.onrender.com`.

## Protocolo de mensagens

Enviar (cliente -> servidor):
```json
{ "action": "saveScore", "name": "Ana", "score": 120 }
{ "action": "getLeaderboard" }
```

Receber (servidor -> cliente):
```json
{ "action": "saveScore", "status": "ok" }
{ "action": "leaderboard", "data": [{ "name": "Ana", "score": 120 }] }
```
