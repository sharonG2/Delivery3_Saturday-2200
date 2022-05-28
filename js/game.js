'use strict'

var gTotalSeconds = 0;
var gIsFirstClick = true
var gLives = 3

var gBoard;
const MINE = '💣'
const FLAG = '🎏'
var gNumberOfMines = 2;
var gIsWin = false
var gLevelDifficulties = 4
var gInterval

function initGame(){
    gBoard = buildBoard(gLevelDifficulties)
    renderBoard(gBoard)
    hideModal()
    hideLives()
    hideCounter()
    clearInterval(gInterval)
    hideSmiley()
    gTotalSeconds = 0
    gIsWin = false
    gIsFirstClick = true
    gLives = 3
}

function buildBoard(level) {
    var board = [];
    for (var i = 0; i < level; i++) {
        board[i] = []
        for (var j = 0; j < level; j++) {
            board[i][j] = {
                isShown: false,
                isMine: false,
                isEmptyStr: false,
                isMarked: false
            }
        }
    }
    return board;
}


function cellClicked(elCell, i, j){
    var curCell = gBoard[i][j]
    curCell.isShown = true
    if(gIsFirstClick){
        randomizeMinhesLocation(gBoard, i, j)
        setMinesNegsCount(gBoard)
        startTimer()
        if(gLevelDifficulties === 4){
            gLives = 2
        }
        showLives()
        addSmiley()
        gIsFirstClick = false
    }
    cellMarked()
    if(curCell.isMine){
        decreaseLives()            
    }
    expandCells(gBoard, elCell, i, j)
    checkGameOver()
}

function addSmiley(){
    var elSmiley = document.querySelector('.smiley')
    elSmiley.style.display = 'block'
    elSmiley.innerHTML = '🙂'
}

function hideSmiley(){
    var elSmiley = document.querySelector('.smiley')
    elSmiley.style.display = 'none'
}

function decreaseLives(){
    if(gLives > 0){
        gLives--
    }
    var elLivesDiv = document.querySelector('.lives')
    elLivesDiv.innerHTML = `${gLives} Lives Left`
    if(gLives === 0){
        gameOver()
    }
}

function expandCells(board, elCell, i, j) {
    if(board[i][j].isMarked) return
    showNeighbors(i, j, elCell, board)
    renderBoard(gBoard)    
 }


 function showNeighbors(cellI, cellJ, elCell, mat) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (!mat[i][j].isMine && !mat[i][j].isMarked) mat[i][j].isShown = true
            if(mat[i][j].minesAroundCount === 0) mat[i][j].isEmptyStr = true
        }
    }
}

function randomizeMinhesLocation(board, i, j){
    var bomsSet = 0;
    while (bomsSet < gNumberOfMines) {
        var iidx = getRandomIntInclusive(0, gBoard.length - 1)
        var jidx = getRandomIntInclusive(0, gBoard.length - 1)
        if (i != iidx && j != jidx) {
            board[iidx][jidx].isMine = true 
            bomsSet ++
        }
        
    }     
}

function cellMarked(){
    var elTd = document.querySelectorAll('td') 
        elTd.forEach((div) => {
            div.addEventListener("contextmenu", e => {
                e.preventDefault()
                var splittedClassName = div.className.split('-');
                var i = splittedClassName[1]
                var j = splittedClassName[2]
                gBoard[parseInt(i)][parseInt(j)].isMarked = !gBoard[parseInt(i)][parseInt(j)].isMarked;
                if (gBoard[parseInt(i)][parseInt(j)].isMarked){
                     div.innerHTML = FLAG
                } else {
                    div.innerHTML = ''
                }
              
                checkGameOver()
            });
        });
}

function gameOver(){
    for(var i = 0; i < gBoard.length; i++){
        for(var j = 0; j < gBoard[0].length; j++){
            var curCell = gBoard[i][j]
            curCell.isShown = true
        }
    }
    var elSmiley = document.querySelector('.smiley')    
    elSmiley.innerHTML = '🤯'
    openModal(gIsWin)
    clearInterval(gInterval)
    renderBoard(gBoard)
}

function checkGameOver(){
    var markedMines = 0 ;
    var shownTiles = 0;
    var markedCell = 0
    var showMines = 0
    var numTiles = gBoard.length * gBoard.length - gNumberOfMines
    for (var i = 0; i < gBoard.length; i++){
        for(var j = 0; j < gBoard.length; j++){
            if(gBoard[i][j].isMarked && gBoard[i][j].isMine){
                // if(markedMines <= gNumberOfMines) 
                markedMines++
            }
            if(gBoard[i][j].isShown) {
                // if(shownTiles <= numTiles) 
                shownTiles++;
            }
            if(gBoard[i][j].isMarked) {
                markedCell++
            }
        }
    }

    if(gLives > 0 && markedMines + shownTiles === gBoard.length * gBoard.length){
        victory()
    }
}

function victory(){
    gIsWin = true
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerHTML = '😁' 
    openModal(gIsWin)
    clearInterval(gInterval)
}

function openModal(gIsWin) {
    var elModal = document.querySelector('.modal')
    var elBtnRestart = document.querySelector('.restart')
    elModal.style.display = 'block';
    elBtnRestart.style.display = 'block'
    elModal.innerText = gIsWin ? 'You Win!!' : 'Game Over';
}

function hideModal(){
    var elModal = document.querySelector('.modal')
    var elBtnRestart = document.querySelector('.restart')
    elModal.style.display = 'none';
    elBtnRestart.style.display = 'none'
}

function chooseLevel(level){
    gLevelDifficulties = level
    if(gLevelDifficulties === 4){
        gNumberOfMines = 2
    }
    if(gLevelDifficulties === 8){
        gNumberOfMines = 12
    }
    if(gLevelDifficulties === 12){
        gNumberOfMines = 30
    }
    initGame()
}

function restartBun(){
    var timer = document.querySelector('.countUpTimer')
    timer.style.display = 'none'
    gIsFirstClick = true
    hideModal()
    initGame()
}

function showLives(){
    var elLivesDiv = document.querySelector('.lives')
    elLivesDiv.innerHTML = `${gLives} Lives Left`
    elLivesDiv.style.display = 'block'
}

function hideLives(){
    var elLivesDiv = document.querySelector('.lives')
    elLivesDiv.style.display = 'none'
}
