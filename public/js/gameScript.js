let numPlayers;
let opponentDice;
let numDice;
const dieSize = 6;
const playerDice = [];
const previousCall = [0, 1];
let playerID;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function init(){
	playerID = parseInt(sessionStorage.getItem("Id"));
	//get numPlayers, and lostDice
	getData().then(r => {
		roundStart();
	});
	//hide everything (controls, buttons)
	if(playerID===0){
		//show start game button
		let startButton = document.createElement('button');
		startButton.onclick = gameStateRoll;
		startButton.innerText = "Start the Game";
		document.getElementById("prevCall").append(startButton);
	}else{
		//busyWaitForRoll().then(r => {});
	}
}

async function getData(){
	const response = await fetch("/api/game/status", {method:'GET'});
	opponentDice = [];
	const playerDice = await response.json();
	for(let i = 0; i<playerDice.length; i++){
		if(i===playerID){
			numDice = playerDice[i];
		}else{
			if(playerDice[i]>-1) {
				opponentDice.push(playerDice[i]);
			}
		}
	}
	numPlayers = opponentDice.length+1;
}

function gameStateRoll(){
	getData().then(async r => {
		if (numPlayers > 1) {
			document.getElementById("prevCall").innerHTML = '';
			const body = "roll"
			console.log(body);
			await fetch('/api/game/setGameState', {method:'POST', body});
			//await busyWaitForRoll();
			setRolling();
		} else {
			alert("Please wait for another player");
		}
	});
}

async function busyWaitForRoll() {
	let state = "start";
	while (state !== "roll") {
		const response = await fetch('/api/game/getGameState', {method:'GET'});
		const intermediary = response.json();
		state = intermediary.State;
		await sleep(1000);
		console.log(state)
	}
	setRolling();
}

function setRolling(){
	document.getElementById("player").style.visibility = "visible";
}

function roundStart(){
	//set opponents
	for(let i = 0; i<numPlayers-1; i++){
		let opponentField = document.getElementById("opponent"+i);
		let dieString = "./resources/"+(opponentDice[i])+".png";
		opponentField.innerHTML = "Dice in play: <br/><img src='"+dieString+
			"' height='75px'> <br>Lost Dice: "+(numDice-opponentDice[i]);
	}
}

function startCall(){
	if(previousCall[0]!==0){
		let plural = '';
		if(previousCall[0]>0) plural = 's';
		document.getElementById("prevCall").innerHTML = "Previous call: "+previousCall[0]+" "+toWord(previousCall[1])+plural;
		document.getElementById("challenge").visibility = 'visible';
	}
	//set self
	document.getElementById("count").value = previousCall[0]+1;
	document.getElementById("dieSide").value = previousCall[1];
}

function toWord(i){
	switch (i){
		case 1:
			return "One";
		case 2:
			return "Two";
		case 3:
			return "Three";
		case 4:
			return "Four";
		case 5:
			return "Five";
		case 6:
			return "Six";
		default:
			return i;
	}
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
}