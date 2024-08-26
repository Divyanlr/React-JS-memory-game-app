import { useRef, useState } from "react";
import "./App.css";
import { useEffect } from "react";
import { useMemo } from "react";
import Confetti from "react-confetti";

const gameIcons = ["🎉", "🐱‍🚀", "🤞", "👩‍🦰", "🎭", "👑", "🎄", "🍕"];

function App() {
  const [pieces, SetPieces] = useState([]);
  let timeout = useRef();

  const isGameCompleted = useMemo(() => {
    if (pieces.length > 0 && pieces.every((pieces) => pieces.solved)) {
      return true;
    }
  }, [pieces]);
  // console.log(gameIcons);

  const startGame = () => {
    const duplicateGameIcons = [...gameIcons, ...gameIcons];
    // console.log(duplicateGameIcons);
    const newGameIcons = [];

    while (newGameIcons.length < gameIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length);

      newGameIcons.push({
        emoji: duplicateGameIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGameIcons.length,
      });

      duplicateGameIcons.splice(randomIndex, 1);
    }

    SetPieces(newGameIcons);
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleActive = (data) => {
    const howManyFlipped = pieces.filter(
      (data) => data.flipped && !data.solved
    );
    if (howManyFlipped.length === 2) return;

    const newPieces = pieces.map((piece) => {
      if (piece.position === data.position) {
        piece.flipped = !piece.flipped;
      }
      return piece;
    });
    SetPieces(newPieces);
  };
  console.log(pieces);

  const gameLogicFlipped = (data) => {
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);

    if (flippedData.length === 2) {
      timeout.current = setTimeout(() => {
        SetPieces(
          pieces.map((piece) => {
            if (
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
            ) {
              if (flippedData[0].emoji === flippedData[1].emoji) {
                piece.solved = true;
              } else {
                piece.flipped = false;
              }
            }
            return piece;
          })
        );
      }, 800);
    }
  };

  useEffect(() => {
    gameLogicFlipped();

    return () => {
      clearTimeout(timeout.current);
    };
  }, [pieces]);

  return (
    <>
      <h1>Memory Game in React JS</h1>
      <div className="container">
        {pieces.map((data, index) => (
          <div
            className={`flip-card ${
              data.flipped || data.solved ? "active" : ""
            }`}
            key={index}
            onClick={() => handleActive(data)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front" />
              <div className="flip-card-back">{data.emoji}</div>
            </div>
          </div>
        ))}
      </div>
      {isGameCompleted && (
        <div className="game-completed">
          <h1>Congratulations you win!! 🎉</h1>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}
    </>
  );
}

export default App;
