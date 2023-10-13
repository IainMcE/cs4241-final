const TOTAL_PLAYERS = 5;
const MAX_DICE = 5
var players = [-1, -1, -1, -1, -1];
var summary = [];
var activePlayers = 0;
var currentBid = [-1, -1, -1]
var dice = []

export function init(req, res) {
    let numPlayers = parseInt(req.body.numPlayers)
    let numDice = parseInt(req.body.numDice);

    for (let i = 0; i < numPlayers; i++) {
        players[i] = numDice + 0
    }
    res.send({ message: "Game initialized successfully!" });
    var Element = {}
    Element.action = 'Start Game'
    Element.players = numPlayers
    Element.numDice = numDice
    summary.push(Element)
    return;
}

export function join(req, res) {

    var playerID = -1;
    if (activePlayers < TOTAL_PLAYERS) {
        players[activePlayers] = MAX_DICE
        playerID = activePlayers
        activePlayers++
    }
    console.log(activePlayers);
    console.log(players);
    console.log(playerID)

    const json = { playerID:playerID};
    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    const jsonContent = JSON.stringify(json);
    res.end(jsonContent);

    var Element = {}
    Element.action = 'A new Player try to join'
    Element.playerID = playerID
    Element.activePlayers = activePlayers
    summary.push(Element)
    return;
}

export function placeBid(req, res) {
    let playerID = req.body.playerID
    let bidValues  = req.body.Bid
    let bid = parseInt(bidValues[0])
    let bidFace = parseInt(bidValues[1])

    currentBid[0] = parseInt(playerID)
    currentBid[1] = parseInt(bidValues[0])
    currentBid[2] = parseInt(bidValues[1])
    console.log(currentBid)

    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    res.end()
    var Element = {}
    Element.action = 'PlaceBid'
    Element.playerID = playerID
    Element.currentBid = currentBid
    summary.push(Element)
    return;
}

export function diceRoll(req, res) {
    let playerID = req.body.playerID
    let diceValues  = req.body.Dice

    var newDice = {}
    newDice.playerID = playerID
    newDice.diceValues = diceValues
    
    if (playerID >= 0 && playerID <= 5) {
        for (let i = 0; i < dice.length; i++) {
            if (dice[i].playerID === playerID) {
                dice.splice(i,1)
            }
        }

        dice.push(newDice)
    }
    console.log(dice)

    var Element = {}
    Element.action = 'diceRoll'
    Element.playerId = playerID
    Element.diceValues = diceValues
    summary.push(Element)
    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    res.end()
    return;
}

export function forfeit(req, res) {
    let playerID = req.body.playerID

    if (playerID >= 0 && playerID <= 5) {
        players[playerID] = 0
    }
    console.log(players)

    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    res.end()
    var Element = {}
    Element.action = 'forfeit'
    Element.playerId = playerID
    summary.push(Element)
    return;
}

export function roundWinner(req, res) {
    //Get the bid from t currentBid
    let bidder = currentBid[0]
    let bid   = currentBid[1]
    let bidFace = currentBid[2]

    // Get the diceValues from the dice[]
    var val = []
    var faceCount = 0
    console.log(dice)
    console.log(currentBid)
    for (let i = 0; i < activePlayers; i++) {
        val = dice[i].diceValues
        console.log(val)
        for (let j = 0; j < val.length; j++) {
            if (parseInt(val[j]) == bidFace) {
                faceCount ++
            }
        }
    }
    let winner = -1;
    let loser = -1;

    console.log(faceCount)
    if (bid <= faceCount) {
        winner = bidder
        loser = "board"
    } else {
        players[bidder]--;
        loser = bidder
    }

    if (winner != -1) {
        for (let i = 0; i < activePlayers; i++) {
            if (winner != i) {
                if (players[i] > 0) {
                    players[i]--;
                }      
            }
        }
    } else {
        winner = "board"
    }
    const jsonContent = JSON.stringify({"winner":winner})
    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    res.end(jsonContent)
    var Element = {}
    Element.action = 'End of Round'
    Element.winner = winner
    Element.loser = loser
    summary.push(Element)
    return;
}

export function roundChallenge (req, res) {
    let challenger = req.body.challengerId
    let winner = -1
    let loser = -1

    let bidder = currentBid[0]
    let bid   = currentBid[1]
    let bidFace = currentBid[2]

    let faceCount = 0
    var val = []

    for (let i = 0; i < activePlayers; i++) {
        val = dice[i].diceValues
        console.log(val)
        for (let j = 0; j < val.length; j++) {
            if (parseInt(val[j]) == bidFace) {
                faceCount ++
            }
        }
    }

    if (bid <= faceCount) {
        winner = bidder
        loser = challenger
    } else {
        winner = challenger
        loser = bidder
    }

    players[loser]--;
    
    const jsonContent = JSON.stringify({"winner":winner})
    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    res.end(jsonContent)
    var Element = {}
    Element.action = 'End of Challenge Round'
    Element.bidder = bidder
    Element.challenger = challenger
    Element.winner = winner
    Element.loser = loser
    summary.push(Element)
    return;
}

export function status(req, res) {

    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    const jsonContent = JSON.stringify(players);
    res.end(jsonContent)
    return;
}

export function gameSummary (req, res) {

    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    const jsonContent = JSON.stringify(summary);
    res.end(jsonContent)
    return;
}