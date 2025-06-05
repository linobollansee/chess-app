import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import io from 'socket.io-client';

const socket = io();

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [roomId, setRoomId] = useState('room1');

  useEffect(() => {
    socket.emit('joinGame', roomId);

    socket.on('gameState', (fen) => {
      const newGame = new Chess();
      newGame.load(fen);
      setGame(newGame);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const makeMove = (move) => {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    if (result) {
      setGame(gameCopy);
      socket.emit('makeMove', move);
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Multiplayer Chess</h2>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </div>
  );
}
