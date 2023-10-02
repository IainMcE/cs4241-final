const numPlayers = 5;
const opponentLostDice = [0,0,0,0];
const numDice = 5;
const dieSize = 6;
const playerDice = [];

function roundStart(){
	//set opponents
	for(let i = 0; i<numPlayers-1; i++){
		let opponentField = document.getElementById("opponent"+i);
		opponentField.innerHTML = "Dice in play: "+(numDice-opponentLostDice[i])+
			"<br>Lost Dice: "+opponentLostDice[i];
	}
	//set self
	for(let i  =0; i<numDice; i++){
		playerDice[i] = 1+Math.floor(Math.random()*dieSize)
	}
	document.getElementById("player").innerHTML = "Your dice: "+playerDice.toString();
}

function increment(field, positivity){
	let numField = document.getElementById(field);
	let result =  numField.value-0+positivity;
	if(result<1){result = 1}
	if(field === 'dieSide' && result>dieSize){result = dieSize}
	numField.value = result;
}