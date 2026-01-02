import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleSquareClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleSquareClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleSquareClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleSquareClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleSquareClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleSquareClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleSquareClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleSquareClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleSquareClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleSquareClick(8)} />
      </div>
    </>
  );
}

function getHistoryChange(oldHistory, currentHistory) {
  for (let i = 0; i < 9; i++) {
    if (oldHistory[i] != currentHistory[i]) {
      return [i % 3, Math.floor(i / 3), currentHistory[i]];
    }
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export function TicTacToe() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpInHistory(historyIdx) {
    setCurrentMove(historyIdx);
  }

  const historyStates = history.map((_, idx) => {
    let description;
    if (idx <= 0) {
      description = "#0 Game Start";
    } else {
      const [fieldX, fieldY, player] = getHistoryChange(
        history[idx - 1],
        history[idx]
      );
      description = `#${idx} (${fieldX}|${fieldY}) ${player}`;

      const winner = calculateWinner(history[idx]);
      if (winner) {
        description += " win";
      } else if (idx == 9) {
        description += " draw";
      }
    }
    return (
      <div key={idx}>
        <button onClick={() => jumpInHistory(idx)}>{description}</button>
      </div>
    );
  });

  return (
    <div className="game">
      <div style={{ marginTop: "auto", marginBottom: "auto" }}>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div
        style={{
          marginLeft: "0.5rem",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {historyStates}
      </div>
    </div>
  );
}
