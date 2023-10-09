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

  useEffect(() => {
    roundStart();
  }, []);

  const roundStart = () => {
    // Your existing roundStart logic here

    // For example, setting playerDice using React state
    const dice = Array.from(
      { length: numDice },
      () => 1 + Math.floor(Math.random() * dieSize)
    );
    setPlayerDice(dice);
  };

  const increment = (field, value) => {
    // Your existing increment logic here

    // For example, incrementing count using React state
    if (field === "count") {
      setPreviousCall([previousCall[0] + 1, previousCall[1]]);
    }
  };

  return (
    <div>
      <div id="opponents">
        {Array.from({ length: numPlayers - 1 }, (_, i) => (
          <div key={i} className="opponent" id={`opponent${i}`}>
            {/* Your opponent information goes here */}
          </div>
        ))}
      </div>
      <br />
      <div id="controls">
        Place your Call:
        <br />
        <div id="call">
          {/* Your call input and buttons go here */}
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
      <div id="player">Your dice: {playerDice.toString()}</div>
    </div>
  );
};

export default Game;
