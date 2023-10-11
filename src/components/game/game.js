// src/components/Game/Game.js

import React, { useEffect, useState } from "react";
import "./game.css";
import { createDice } from "./dice";

const Game = () => {
  const numPlayers = 5;
  const [opponentLostDice, setOpponentLostDice] = useState([0, 0, 0, 0]);
  const numDice = 5;
  const dieSize = 6;

  const [playerDice, setPlayerDice] = useState([]);
  const [previousCall, setPreviousCall] = useState([1, 1]);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Destructuring the createDice function
  const { initializeDice, waitGetRoll, checkRolls, render } = createDice(
    numDice,
    dieSize
  );

  useEffect(() => {
    if (numPlayers > 1 && !isGameStarted) {
      setIsGameStarted(true);
      roundStart();
    }
  }, [numPlayers, isGameStarted]);

  useEffect(() => {
    // Initialize dice when the component mounts
    initializeDice(setPlayerDice);
  }, []); // Empty dependency array to run once when component mounts

  const roundStart = () => {
    // Your existing roundStart logic here

    // If you need to perform additional logic specific to your game, do it here
    // ...

    // Initialize the player's dice using the dice script
    initializeDice(setPlayerDice);

    // Reset previous call and update buttons
    setPreviousCall([1, 1]);
    updateButtons();
  };

  const increment = (field, positivity) => {
    let updatedPreviousCall = [...previousCall];

    if (field === "count") {
      updatedPreviousCall[0] += positivity;
    } else if (field === "dieSide") {
      updatedPreviousCall[1] += positivity;
    }

    if (updatedPreviousCall[0] < 1) {
      updatedPreviousCall[0] = 1;
    }

    setPreviousCall(updatedPreviousCall);
    updateButtons();
  };

  const updateButtons = () => {
    // Your existing button update logic here
    // ...
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
          <button onClick={() => increment("count", 1)} id="countUp">
            /\ Count Up
          </button>
          <button onClick={() => increment("dieSide", 1)} id="dieSideUp">
            /\ Die Side Up
          </button>
          <br />
          <input id="count" value={previousCall[0]} disabled />
          <input id="dieSide" value={previousCall[1]} disabled />
          <button id="setCall" onClick={roundStart}>
            Place Call
          </button>
          <br />
          <button onClick={() => increment("count", -1)} id="countDown">
            \/ Count Down
          </button>
          <button onClick={() => increment("dieSide", -1)} id="dieSideDown">
            \/ Die Side Down
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
