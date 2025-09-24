'use strict'

function onInit() {
    buildBoard()
}


function buildBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        const row = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cellObject = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false,
            }
            row.push(cellObject)
        }
        gBoard.push(row)
    }
    renderBoard(gBoard);
    console.table(gBoard);

}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var minesCount = 0;
            var currCell = board[i][j];
            for (var x = i - 1; x <= i + 1; x++) {
                for (var y = j - 1; y <= j + 1; y++) {
                    if (x < 0 || x >= board.length || y < 0 || y >= board[0].length) continue;
                    if (x === i && y === j) continue;
                    const currCell = board[x][y];
                    if (currCell.isMine === true) minesCount++;
                }
            }
            board[i][j].isMine = (Math.random() < gLevel.MINES / (gLevel.SIZE * gLevel.SIZE));
            board[i][j].minesAroundCount = minesCount;
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = '<tbody class="board-body">\n';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var cellClass = `cell-${i}-${j}`;
            const cellContent = ''
            strHTML += `\t<td class=${cellClass} onclick="onCellClicked(this, ${i}, ${j})"} oncontextmenu="onCellMarked(this, ${i}, ${j}, event)">${cellContent}</td>\n`;
        }
        strHTML += '</tr>\n';
    }
    const elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function onCellClicked(elCell, i, j) {
    const isFirstClick = (gGame.revealedCount === 0 && gGame.markedCount === 0);
    if (isFirstClick) {
        setMinesNegsCount(gBoard);
        gGame.isOn = true;
    }
    gBoard[i][j].isRevealed = true;
    elCell.style.backgroundColor = 'lightgrey';
    if (gBoard[i][j].isMine) {
        elCell.innerText = '💣';
        alert('Game Over');
        gGame.isOn = false;
        return;
    } else if (gBoard[i][j].minesAroundCount === 0) {
        expandReveal(gBoard, elCell, i, j);
    }

    checkGameOver();
    console.log('clicked', i, j);
    console.table(gBoard);
}

function onCellMarked(elCell, i, j, event) {
    event.preventDefault();
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
    const totalCells = gLevel.SIZE * gLevel.SIZE;
    const totalMines = gLevel.MINES;
    const revealedCells = gGame.revealedCount;
    const markedCells = gGame.markedCount;

    console.log('revealedCells', revealedCells, 'markedCells', markedCells, 'totalCells', totalCells, 'totalmines', totalMines);


    if (revealedCells + markedCells === totalCells) {
        let correctlyMarkedMines = 0;
        for (let i = 0; i < gBoard.length; i++) {
            for (let j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
                    correctlyMarkedMines++;
                }
            }
        }

        if (correctlyMarkedMines === totalMines) {
            alert('You Win!');
            return true;
        }
    }

    return false;
}


function expandReveal(board, elCell, i, j) {
    for (let x = i - 1; x <= i + 1; x++) {
        for (let y = j - 1; y <= j + 1; y++) {
            if (x < 0 || x >= board.length || y < 0 || y >= board[0].length) continue;
            if (x === i && y === j) continue;

            const currCell = board[x][y];
            if (currCell.isRevealed || currCell.isMine) continue;
            currCell.isRevealed = true;
            gGame.revealedCount++;
            const cellClass = `.cell-${x}-${y}`;
            const elNeighborCell = document.querySelector(cellClass);
            elNeighborCell.style.backgroundColor = 'lightgrey';
            elNeighborCell.innerText = currCell.minesAroundCount > 0 ? currCell.minesAroundCount : '';
            if (currCell.minesAroundCount === 0) {
                expandReveal(board, elNeighborCell, x, y);
            }
        }
    }

    checkGameOver();
}
