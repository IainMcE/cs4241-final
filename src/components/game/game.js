import React, { useEffect, useState, useRef } from "react";
import { makeDie } from "./dice";
import * as THREE from "https://cdn.skypack.dev/three@0.136";
import * as CANNON from "https://cdn.skypack.dev/cannon-es";

const Game = () => {
  const numPlayers = 5;
  const [opponentLostDice, setOpponentLostDice] = useState([0, 0, 0, 0]);
  const numDice = 5;
  const dieSize = 6;

  const [playerDice, setPlayerDice] = useState([]);
  const [previousCall, setPreviousCall] = useState([1, 1]);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const threeContainerRef = useRef(null);
  const [scene, setScene] = useState(new THREE.Scene());
  const [camera, setCamera] = useState(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );
  const [renderer, setRenderer] = useState(new THREE.WebGLRenderer());

  const physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -50, 0),
    allowSleep: true,
  });
  physicsWorld.defaultContactMaterial.restitution = 0.3;

  useEffect(() => {
    const initializeThree = () => {
      // Set up camera
      camera.position.z = 5;

      // Set up renderer
      renderer.setSize(window.innerWidth, window.innerHeight);
      threeContainerRef.current.appendChild(renderer.domElement);

      // Create and add dice to the scene
      for (let i = 0; i < numDice; i++) {
        const { mesh, body } = makeDie(i);
        scene.add(mesh);
        physicsWorld.addBody(body);
      }

      // Render the initial scene
      render();
    };

    initializeThree();

    // Cleanup function
    return () => {
      // Clean up Three.js resources
      scene.children.forEach((object) => {
        if (object instanceof THREE.Mesh) {
          scene.remove(object);
        }
      });
      renderer.dispose();
    };
  }, []); // Empty dependency array to run once when the component mounts

  useEffect(() => {
    if (numPlayers > 1 && !isGameStarted) {
      setIsGameStarted(true);
      roundStart();
    }
  }, [numPlayers, isGameStarted]);

  const roundStart = () => {
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

  const render = () => {
    // Your rendering logic here
    renderer.render(scene, camera);
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

      {/* Container for Three.js scene */}
      <div ref={threeContainerRef} id="three-container" />
    </div>
  );
};

export default Game;
