//const db = require("../models");
//const Character = db.character;

var players = [];
var summary = [];


exports.init = (req, res) => {
    let numPlayers = parseInt(req.body.numPlayers)
    let numDice = parseInt(req.body.numDice);

    for (let i = 0; i < numPlayers; i++) {
        players[i] = numDice + 0
    }
    res.send({ message: "Game initialized successfully!" });
    Element = {}
    Element.action = 'Start Game'
    Element.players = numPlayers
    Element.numDice = numDice
    summary.push(Element)
    return;
}

exports.roundWinner = (req, res) => {
    let diceValues = req.body.diceValues
    let bid   = parseInt(req.body.bid)
    let bidder = parseInt(req.body.bidderId)
    let bidFace = parseInt(req.body.bidFace)

    let winner = -1;
    let loser = -1;

    let faceCount = 0
    if (bidFace >= 1 && bidFace <= 6) {
        for (let i = 0; i < diceValues.length; i++) {
            if (parseInt(diceValues[i]) == bidFace) {
                faceCount ++
            }
        }
        if (bid <= faceCount) {
            winner = bidder
            loser = "board"
        } else {
            players[bidder]--;
            loser = bidder
        }
    }

    if (winner != -1) {
        for (let i = 0; i < players.length; i++) {
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
    Element = {}
    Element.action = 'End of Round'
    Element.winner = winner
    Element.loser = loser
    summary.push(Element)
    return;
}

exports.roundChallenge = (req, res) => {
    let diceValues = req.body.diceValues
    let bid   = parseInt(req.body.bid)
    let bidFace = req.body.bidFace
    let bidder = req.body.bidderId
    let challenger = req.body.challengerId
    let winner = -1
    let loser = -1

    let faceCount = 0
    if (bidFace >= 1 && bidFace <= 6) {
        for (let i = 0; i < diceValues.length; i++) {
            if (diceValues[i] == bidFace) {
                faceCount ++
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
        Element = {}
        Element.action = 'End of Challenge Round'
        Element.bidder = bidder
        Element.challenger = challenger
        Element.winner = winner
        Element.loser = loser
        summary.push(Element)
        return;
    }
}

exports.status = (req, res) => {

    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    const jsonContent = JSON.stringify(players);
    res.end(jsonContent)
    return;
}

exports.summary = (req, res) => {

    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    const jsonContent = JSON.stringify(summary);
    res.end(jsonContent)
    return;
}