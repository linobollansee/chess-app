import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';

const game = new Chess();

function App() {
  const [fen, setFen] = useState(game.fen());
  const [status, setStatus] = useState('');

  const onDrop = ({ sourceSquare, targetSquare }) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    });

    if (move === null) return;

    setFen(game.fen());
    updateStatus();
  };

  const updateStatus = () => {
    if (game.in_checkmate()) {
      setStatus('Checkmate!');
    } else if (game.in_draw()) {
      setStatus('Draw!');
    } else if (game.in_check()) {
      setStatus('Check!');
    } else {
      setStatus(`${game.turn() === 'w' ? 'White' : 'Black'} to move`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React Chess</h1>
      <p>{status}</p>
      <Chessboard
        width={400}
        position={fen}
        onDrop={onDrop}
        transitionDuration={200}
        boardStyle={{ borderRadius: '5px', boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)` }}
      />
    </div>
  );
}

export default App;
