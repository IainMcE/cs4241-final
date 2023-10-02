# cs4241-a4

call/bet are interchangeable here
data storage: current call, current player, each player's dice info (rolls, and lost dice)
    stretch goal: accounts, unique names and keep track of wins/losses?
    derived info: current call is set by previous player
UI:
    start: animation of dice shaking in cup, player clicks to roll.
        3d simulation of dice can be a stretch goal
    Gameplay: player needs to see the results of their own dice, and how many dice the other players have lost, and the current call
        active player: have controls to change or challenge the call. Additionally, there should be a their call that updates in live time (this can be clientside only, no need to send info to the server and back), and a button to set the new call.
    end round: need something to direct all players to the loser, so they see them lose a die
    end game: have a win screen?

functionality:
    set call: current player loses the active ui, updates the current call to the new one, and increments the current player (to a player with dice left), new current player gets the active ui
    challenge call: all the dice are summed up by the result (i.e. all the ones, the twos, etc). The current call is then checked (are there at least the call amount of dice that rolled the call result(?)). A loser is determined (if the call was valid, current player, otherwise current player-1) and the loser has a die removed from play. If two players have at least one die left, a new round is called, otherwise the only player with dice left is the winner.
    potential forfeit button: remove all dice from play
