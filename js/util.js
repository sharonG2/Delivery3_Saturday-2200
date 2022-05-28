'use strict'

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = 'cell cell-' + i + '-' + j;
            strHTML += `<td onclick="cellClicked(this, ${i} ,${j})" class=" ${className} ">`
            if(!cell.isShown && !cell.isMarked){
                strHTML += `<div class=" ${className} divCell" style="display:none;">`
            }else if(cell.isEmptyStr && !cell.isMarked){
                strHTML += `<div class=" ${className} divCell" style="display:block; background-color:#806a8f">`
            }
            else{ 
                strHTML += `<div class=" ${className} divCell" style="display:block;">`
            }
            
            if (cell.isMine && !cell.isMarked) {
                strHTML += MINE
            }

            if (cell.isMarked) {
                strHTML += FLAG
            }

            if (cell.minesAroundCount && !cell.isMarked) {
                strHTML += `${cell.minesAroundCount}`
            }

            strHTML += '</div></td>';
        }
        strHTML += '</tr>'
    }
    var elTable = document.querySelector('table');
    elTable.innerHTML = strHTML;
    cellMarked()
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            if (!cell.isMine) {
                var numNeighbors = countNeighbors(i, j, board)
                cell.minesAroundCount = numNeighbors
                if (numNeighbors === 0) {
                    cell.isEmptyStr = true;
                }
            }
        }
    }
}


function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;

            if (mat[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startTimer(){
    var timer = document.querySelector('.countUpTimer')
        timer.style.display = 'block'
        timer.innerText = '00:00:00'
        gInterval = setInterval(countUpTimer, 1000);
}

function countUpTimer() {
  ++gTotalSeconds;
  var hour = Math.floor(gTotalSeconds / 3600);
  var minute = Math.floor((gTotalSeconds - hour * 3600) / 60);
  var seconds = gTotalSeconds - (hour * 3600 + minute * 60);
  document.querySelector('.countUpTimer').innerHTML = hour + ":" + minute + ":" + seconds;
}

function hideCounter(){
    var timer = document.querySelector('.countUpTimer')
    timer.style.display = 'none'
}