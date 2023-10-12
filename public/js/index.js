function attemptToJoin(){
	//query the db, is there an open spot (return -1 to 4/5)
	let playerID = -1;
	if(playerID === -1){
		//if -1 display error (already full)
		document.getElementById("joinResults").innerHTML = "The game is already full."
	}else {
		//if 1-5 or 0-4, assign player id in local storage
		sessionStorage.setItem("Id", playerID+'');
		//go to game
		window.location.replace("/game.html");
	}
}