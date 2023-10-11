// src/components/Game/Game.js
import React, { useEffect, useState } from "react";
import "./game.css";

const Game = () => {
  const numPlayers = 5;
  const opponentLostDice = [0, 0, 0, 0];
  const numDice = 5;
  const dieSize = 6;

  const [playerDice, setPlayerDice] = useState([]);
  const [previousCall, setPreviousCall] = useState([1, 1]);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    if (numPlayers > 1) {
      setIsGameStarted(true);
      roundStart();
    }
  }, []);

  const roundStart = () => {
    // Your existing roundStart logic here
    const dice = Array.from(
      { length: numDice },
      () => 1 + Math.floor(Math.random() * dieSize)
    );
    setPlayerDice(dice);
  };

  const increment = (field, value) => {
    // Your existing increment logic here
    if (field === "count") {
      setPreviousCall([previousCall[0] + 1, previousCall[1]]);
    }
  };

  return (
    <div>
      {numPlayers === 1 && !isGameStarted && (
        <button onClick={() => setIsGameStarted(true)}>Start Game</button>
      )}
      <div id="opponents">
        {Array.from({ length: numPlayers - 1 }, (_, i) => (
          <div key={i} className="opponent" id={`opponent${i}`}>
            {/* Placeholder image for opponent's dice */}
            <img
              src={opponentLostDice[i] < numDice ? "/dice.png" : "/blank.png"}
              alt={`Opponent ${i + 1}'s Dice`}
            />
            <div>
              Dice in play: {numDice - opponentLostDice[i]}
              <br />
              Lost Dice: {opponentLostDice[i]}
            </div>
          </div>
        ))}
      </div>
      <br />
      <div id="controls">
        Place your Call:
        <br />
        <div id="call">
          <button onClick={() => increment("count", 1)}>/\</button>
          <button onClick={() => increment("dieSide", 1)}>/\</button>
          <br />
          <input id="count" value={previousCall[0] + 1} disabled />
          <input id="dieSide" value={previousCall[1]} disabled />
          <button id="setCall">Place Call</button>
          <br />
          <button onClick={() => increment("count", -1)} disabled>
            \/
          </button>
          <button onClick={() => increment("dieSide", -1)} disabled>
            \/
          </button>
        </div>
        <br />
        <button id="forfeit">Forfeit</button>
      </div>
      <br />
      <div id="player">Your dice: {playerDice.join(", ")}</div>
    </div>
  );
};

export default Game;
