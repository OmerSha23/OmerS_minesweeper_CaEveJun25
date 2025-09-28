'use strict'

function buildBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        const row = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cellObject = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false,
            };
            row.push(cellObject);
        }
        gBoard.push(row);
    }
}
function renderBoard(board) {
    var strHTML = '<tbody class="board-body">\n';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var cellClass = `cell-${i}-${j}`;
            const cellContent = '';
            strHTML += `\t<td class="${cellClass}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j}, event)">${cellContent}</td>\n`;
        }
        strHTML += '</tr>\n';
    }
    const elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}
