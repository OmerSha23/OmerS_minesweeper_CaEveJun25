'use strict'



function createMat(rows, cols) {
    const mat = []
    for (var i = 0; i < rows; i++) {
        const rows = []
        for (var j = 0; j < cols; j++) {
            rows.push('')
        }
        mat.push(rows)

    }
    return mat

}
function buildBoard() {
   var board = createMat(4, 4)
    
    return board
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j];
            var cellClass = {i:i, j:j}
            // Determine cell content (e.g., mine, number, or empty)
            const cellContent = null
            strHTML += `\t<td class="${cellClass}">${cellContent}</td>\n`;
        }
        strHTML += '</tr>\n';
    }
    console.log();
    

    const elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// function renderBoard() {
//     var strHTML = ''
//     for (var i = 0; i < board.length; i++) {
//         strHTML += '<tr>'
//         for (var j = 0; j < board[0].length; j++) {
//             strHTML += '\t</td>\n'
//         }
//         strHTML += '</tr>\n'
//     }

//     const elBoard = document.querySelector('.board')
//     elBoard.innerHTML = strHTML
// }



// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
