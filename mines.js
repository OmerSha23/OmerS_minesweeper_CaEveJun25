'use strict'


var gBoard = [];
var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    lives: 3,
    startTime: null
};
var gLevels = {
    BEGINNER: { SIZE: 4, MINES: 2 },
    MEDIUM: { SIZE: 8, MINES: 10 },
    EXPERT: { SIZE: 12, MINES: 30 }
};
var gLevel = gLevels.BEGINNER; 
var gTimerInterval = null;

function onInit(level = 'BEGINNER') {
    gLevel = gLevels[level];
    gBoard = [];
    buildBoard();
    renderBoard(gBoard);
    gGame.isOn = false;
    gGame.revealedCount = 0;
    gGame.markedCount = 0;
    gGame.lives = 3;
    gGame.startTime = null;
    clearInterval(gTimerInterval);
    updateLivesDisplay();
    updateTimerDisplay(0);
    renderLevelSelector();
}


function setMinesNegsCount(board, safeI, safeJ) {
    const positions = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (i === safeI && j === safeJ) continue;
            positions.push({ i, j });
        }
    }
    for (var idx = positions.length - 1; idx > 0; idx--) {
        const randIdx = Math.floor(Math.random() * (idx + 1));
        [positions[idx], positions[randIdx]] = [positions[randIdx], positions[idx]];
    }
    for (var k = 0; k < gLevel.MINES; k++) {
        const { i, j } = positions[k];
        board[i][j].isMine = true;
    }

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var minesCount = 0;
            for (var x = i - 1; x <= i + 1; x++) {
                for (var y = j - 1; y <= j + 1; y++) {
                    if (x < 0 || x >= board.length || y < 0 || y >= board[0].length) continue;
                    if (x === i && y === j) continue;
                    if (board[x][y].isMine) minesCount++;
                }
            }
            board[i][j].minesAroundCount = minesCount;
        }
    }
    return board;
}


function renderLevelSelector() {
    const elSelector = document.querySelector('#level-selector');
    if (elSelector) {
        elSelector.innerHTML = `
            <select onchange="onInit(this.value)">
                <option value="BEGINNER" ${gLevel.SIZE === 4 ? 'selected' : ''}>Beginner (4x4)</option>
                <option value="MEDIUM" ${gLevel.SIZE === 8 ? 'selected' : ''}>Medium (8x8)</option>
                <option value="EXPERT" ${gLevel.SIZE === 12 ? 'selected' : ''}>Expert (12x12)</option>
            </select>
        `;
    }
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn && gGame.revealedCount === 0 && gGame.markedCount === 0) {
        setMinesNegsCount(gBoard, i, j);
        gGame.isOn = true;
        gGame.startTime = Date.now();
        startTimer();
    }
    if (!gGame.isOn || gBoard[i][j].isRevealed || gBoard[i][j].isMarked) return;

    gBoard[i][j].isRevealed = true;
    elCell.style.backgroundColor = 'lightgrey';

    if (gBoard[i][j].isMine) {
        elCell.innerText = '💣';
        gGame.lives--;
        updateLivesDisplay();
        if (gGame.lives === 0) {
            console.log('Game Over');
            revealAllMines();
            gGame.isOn = false;
            stopTimer();
        } else {
            console.log('Lost a life! Remaining:', gGame.lives);
        }
        return;
    }

    gGame.revealedCount++;
    elCell.innerText = gBoard[i][j].minesAroundCount > 0 ? gBoard[i][j].minesAroundCount : '';
    if (gBoard[i][j].minesAroundCount === 0) {
        expandReveal(gBoard, i, j);
    }

    checkGameOver();
}

function onCellMarked(elCell, i, j, event) {
    event.preventDefault();
    if (!gGame.isOn || gBoard[i][j].isRevealed) return;

    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        elCell.innerText = '';
        gGame.markedCount--;
    } else {
        gBoard[i][j].isMarked = true;
        elCell.innerText = '🚩';
        gGame.markedCount++;
    }
    checkGameOver();
}

function checkGameOver() {
    const totalSafeCells = gLevel.SIZE * gLevel.SIZE - gLevel.MINES;
    if (gGame.revealedCount === totalSafeCells) {
        alert('You Win!');
        revealAllMines()
        gGame.isOn = false;
        stopTimer();
        return true;
    }
    return false;
}

function expandReveal(board, i, j) {
    for (var x = i - 1; x <= i + 1; x++) {
        for (var y = j - 1; y <= j + 1; y++) {
            if (x < 0 || x >= board.length || y < 0 || y >= board[0].length) continue;
            if (x === i && y === j) continue;

            const currCell = board[x][y];
            if (currCell.isRevealed || currCell.isMine || currCell.isMarked) continue;
            currCell.isRevealed = true;
            gGame.revealedCount++;
            const cellClass = `.cell-${x}-${y}`;
            const elNeighborCell = document.querySelector(cellClass);
            elNeighborCell.style.backgroundColor = 'lightgrey';
            elNeighborCell.innerText = currCell.minesAroundCount > 0 ? currCell.minesAroundCount : '';
            if (currCell.minesAroundCount === 0) {
                expandReveal(board, x, y);
            }
        }
    }
}

function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                const cellClass = `.cell-${i}-${j}`;
                const elCell = document.querySelector(cellClass);
                elCell.innerText = '💣';
                elCell.style.backgroundColor = 'red';
            }
        }
    }
}

function startTimer() {
    gTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gGame.startTime) / 1000);
        updateTimerDisplay(elapsed);
    }, 1000);
}

function stopTimer() {
    clearInterval(gTimerInterval);
}

function updateTimerDisplay(seconds) {
    const elTimer = document.querySelector('#timer');
    if (elTimer) elTimer.innerText = `Time: ${seconds}`;
    if (seconds === 30) {
        document.getElementById('timer').style.color = 'red';
    } else {
        document.getElementById('timer').style.color = 'black';

    }

}

function updateLivesDisplay() {
    const elLives = document.querySelector('#lives');
    if (elLives) elLives.innerText = `Lives: ${gGame.lives}`;
}
