const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const games = new Map();

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

io.on('connection', (socket) => {
  let currentRoom = null;
  let game = null;

  socket.on('joinGame', (roomId) => {
    socket.join(roomId);
    currentRoom = roomId;

    if (!games.has(roomId)) {
      games.set(roomId, new Chess());
    }

    game = games.get(roomId);
    io.to(currentRoom).emit('gameState', game.fen());
  });

  socket.on('makeMove', (move) => {
    if (!game) return;
    const result = game.move(move);
    if (result) {
      io.to(currentRoom).emit('gameState', game.fen());
    }
  });

  socket.on('disconnect', () => {
    if (currentRoom && games.get(currentRoom)?.game_over()) {
      games.delete(currentRoom);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
