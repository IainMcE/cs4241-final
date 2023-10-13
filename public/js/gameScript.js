const numPlayers = 5;
const opponentLostDice = [2,5,3,1];
const numDice = 5;
const dieSize = 6;
const playerDice = [];
const previousCall = [0,1];

function roundStart(){
	/*
	 * How does client get data for all players?
	 * If the player data is stored in the DB, do you need an API to get player data?
	 * For example, getAllData will return a JSON with all players' data (GET)
	 * getPlayerData with the player ID will return one player's data (POST)
	 */
	//set opponents
	for(let i = 0; i<numPlayers-1; i++){
		let opponentField = document.getElementById("opponent"+i);
		let dieString = "./resources/"+(numDice-opponentLostDice[i])+".png";
		opponentField.innerHTML = "Dice in play: <br/><img src='"+dieString+
			"' height='75px'> <br>Lost Dice: "+opponentLostDice[i];
	}
	//set self
	document.getElementById("count").value = previousCall[0]+1;
	document.getElementById("dieSide").value = previousCall[1];
}

function increment(field, positivity){
	let numField = document.getElementById(field);
	let result =  numField.value-0+positivity;
	if(result<1){result = 1}
	//if(field === 'dieSide' && result>dieSize){result = dieSize}
	numField.value = result;
	updateButtons();
}

function updateButtons(){
	let currNum = document.getElementById('count').value;
	let currSide = document.getElementById('dieSide').value;
	//liars dice: raising the call
	//you may increase the number of dice, and keep the die side the same
	//you may increase the die side, and set any number of dice
	//you cannot decrease the die side
	//you cannot decrease the number without increasing the die side.
	//die side: up greys out when maxed
	document.getElementById('dieSideUp').disabled = currSide >= dieSize;
	//down greys out when equal to current call
	document.getElementById('dieSideDown').disabled = currSide <= previousCall[1];
	//count: up never greys out. make as absurd a call as you want
	//down: greys out when both count and side are equal to current call
	document.getElementById('countDown').disabled = (currNum<=previousCall[0]+1 && currSide <= previousCall[1])||currNum==1;
	//work around: raise die side, lower count, lower die side
	//prevention:
	if(currSide <= previousCall[1] && currNum<=previousCall[0]){
		document.getElementById('count').value = previousCall[0]+1;
	}

	/*
	 * After each player action, do you want the server to validate?
	 * That means you need a POST api such as /api/game/playerMove with whatever you need to validate
	 * This may not need to be stored in the DB, it can be stored in the server as long as the server knows when the round starts and ends.
	 */
	//TODO serverside validation: so long as either value is larger than the previous and die side is not smaller than the previous side, it is valid
}

/*
 * Other questions:
 * 1. Will the server api be called after each round?
 * 2. How does the client know whether the player has won or lost a round?
 * 3. How does the client know that a player has lost all dice?
 * 4. Does the server need to assume the number of players as 5 and number of dice as 5?
 */