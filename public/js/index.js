async function attemptToJoin() {
	//query the db, is there an open spot (return -1 to 4/5)
	/*
	 * Question 1: How does the server know how many players?
	 * question 2: How many dice go to each player?
	 * Question 3: Will the client call a server api (and have the server get it from mongodb)? 
	 * 			What the input? what is the expected output?
	 * 			If there is no input, it will be a GET api such as /api/game/checkOpenSlot
	 * 			If there is an input, then it will be post such as /api/game/checkOPenSlot
	 */
	const join = await fetch('/api/game/join', {method:'GET', });
	const intermediary = await join.json();
	const playerID = intermediary.playerID;
	if (playerID === -1) {
		//if -1 display error (already full)
		document.getElementById("joinResults").innerHTML = "The game is already full."
	} else {
		//if 1-5 or 0-4, assign player id in local storage
		sessionStorage.setItem("Id", playerID + '');
		//go to game
		window.location.replace("/game.html");
	}
}