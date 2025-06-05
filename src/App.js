import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const game = new Chess();

function App() {
  const [fen, setFen] = useState(game.fen());
  const [status, setStatus] = useState("");

  const onDrop = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;

    setFen(game.fen());
    updateStatus();
    return true;
  };

  const updateStatus = () => {
    if (game.inCheckmate()) {
      setStatus("Checkmate!");
    } else if (game.inDraw()) {
      setStatus("Draw!");
    } else if (game.inCheck()) {
      setStatus("Check!");
    } else {
      setStatus(`${game.turn() === "w" ? "White" : "Black"} to move`);
    }
  };

  useEffect(() => {
    updateStatus();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>React Chess</h1>
      <p>{status}</p>
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardWidth={400}
        transitionDuration={200}
      />
    </div>
  );
}

export default App;
