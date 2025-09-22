'use stict'



// The model
var gBoard = {
    minesAroundCount: 4,
    isRevealed: false,
    isMine: false,
    isMarked: false
}

// This is an object by which the board size is set 
// (in this case: 4x4 board and how many mines to place)
var gLevel = {
    SIZE: 4,
    MINES: 2
}

// Holds the current game state:
// isOn: true when game is on revealedCount:
//  How many cells are revealed
// markedCount: How many cells are marked (with a flag)
// secsPassed: How many seconds passed
var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)

}