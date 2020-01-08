var X = 'X';
var O = 'O';
var MAX = 10; //computer win
var MIN = -10; //player win
var DRAW = 0; 
var depth = 0;
var rowNum = 3;
var colNum = 3;
var lastClicked;
var playerToken;
var compToken;
let game;

class Board {
    constructor(board) {
        this.empty = 0;
        this.board_size = 9;
        this.board = board ? board : Array(this.board_size).fill(this.empty);
    }

    getBoard() {
        return this.board.slice(0);
    }

    getAvailablePos() {
        return this.board.map(el => el === this.empty);
    }

    clone() {
        return new Board(this.getBoard());
    }

    checkFinish() {
        //check rows
        for (var i = 0; i < 9; i += 3) {
            if (this.board[i] && this.board[i] === this.board[i + 1] && this.board[i + 1] === this.board[i + 2]) {
                return this.board[i];
            }
        }

        //check cols
        for (var i = 0; i < 3; i++) {
            if (this.board[i] && this.board[i] === this.board[i + 3] && this.board[i] === this.board[i + 6]) {
                return this.board[i];
            }
        }

        //check diagonals
        if (this.board[0] && this.board[0] === this.board[4] && this.board[0] === this.board[8]) return this.board[0];
        if (this.board[2] && this.board[2] === this.board[4] && this.board[2] === this.board[6]) return this.board[2];

        return 0;
    }

    makeMove(i, token) {
        if (this.board[i] !== this.empty) return false;

        this.board[i] = token;
        return true;
    }

    areMovesAvailable() {
        return this.getAvailablePos().reduce((pos, el) => pos || el, false);
    }
}

class Game {
    constructor(isCompPlay, endCallback) {
        this.playerToken = playerToken;
        this.compToken = compToken;
        this.board = new Board();
        if (isCompPlay) this.board.board[getRandomInt(9)] = this.compToken;
        this.endCallback = endCallback;
    }

    minMax(tempBoard, depth, isCompPlay) {
        if (depth === 0 || !tempBoard.areMovesAvailable()) return DRAW;

        var isFinished = tempBoard.checkFinish();
        if (isFinished) return isFinished === this.playerToken ? MIN : MAX;

        var player = isCompPlay ? compToken : playerToken;

        var scores = tempBoard.getAvailablePos().map((isAvailable, index) => {
            if (isAvailable) {
                var clonedBoard = tempBoard.clone();
                clonedBoard.makeMove(index, player);
                return this.minMax(clonedBoard, depth - 1, !isCompPlay);
            }

            return null;
        });

        if (isCompPlay) {
            return tempBoard.getAvailablePos().reduce((pre, isAvailable, index) =>
                (isAvailable ? (scores[index] > pre ? scores[index] : pre) : pre),
                MIN);
        }

        return tempBoard.getAvailablePos().reduce((pre, isAvailable, index) =>
            (isAvailable ? (scores[index] < pre ? scores[index] : pre) : pre),
            MAX);
    }

    makeMove(index) {
        if (!this.board.makeMove(index, this.playerToken)) return;
        //game.printBoard();

        //check if more moves are avaiable
        if (!this.board.areMovesAvailable()) {
            this.endCallback('It\'s a Draw!');
        }

        //find comp move
        var bestPos = -1;
        var bestVal = MIN;

        this.board.getAvailablePos().forEach((isAvailable, index) => {
            if (isAvailable) {
                //make a move at this index
                var clonedBoard = this.board.clone();
                clonedBoard.makeMove(index, this.compToken);
                var val = this.minMax(clonedBoard, 100, false);

                if (bestVal < val) {
                    bestVal = val;
                    bestPos = index;
                }
            }
        });

        if (bestPos === -1) {
            this.endCallback('You have won!');
        }
        else {
            this.board.makeMove(bestPos, this.compToken);
        }

        var isFinished = this.board.checkFinish();
        if (isFinished) {
            var winner = isFinished === this.playerToken ? 'You' : 'Computer';
            this.endCallback(`${winner} has won`);
        }

        game.printBoard();
    }

    printBoard() {
        renderBoard(this.board.getBoard());
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function generateModal(id) {
  var container = document.getElementById('body-container');  
  var modal = generateDiv('modal', id);
  var content = generateDiv('modal-content');
  modal.appendChild(content);
  container.appendChild(modal);
  return content;
}

function showModal() {
  var modal = document.getElementsByClassName('modal');
  if (modal) modal[0].classList.add('show-modal');
}

function dismissModal() {
  var modal = document.getElementsByClassName('modal');
  if (modal) modal[0].classList.remove('show-modal');
}

function generateButton(className, id, text, callback) {
  var button = document.createElement('button');
  button.className = 'button';
  if (className) button.classList.add(className);
  if (id) button.id = id;
  if (text) {
    button.innerHTML = text;
  }
  else{
    button.innerHTML = 'click';
  }

  button.onclick = callback;
  return button;
}

function generateDiv(className, id, text, callback) {
  var div = document.createElement('div');
  div.className = 'div';
  if (className) div.classList.add(className);
  if (id) div.id = id;
  if (text) div.innerHTML = text;
  if(callback)  div.onclick = callback;
  
  return div;
}

function generateGrid(callback) {
  var i = 0;
  var grid = document.createElement('div');
  grid.className = 'grid';
  for (var row = 0; row < rowNum; row++) {
    var tr = grid.appendChild(document.createElement('tr'));
    tr.className = ''
    for (var col = 0; col < colNum; col++) {
      var cell = tr.appendChild(document.createElement('td'));
      cell.className = 'cell';
      var val = row * 3 + col;
      cell.id = 'cell'+val;
      cell.value = val;
      cell.addEventListener('click',(function(el,row,col, val){
        return function(){ callback(el,row,col, val); }
      })(cell,row,col, val),false);
    }
  }

  return grid;
}

function renderBoard(board) {
    if (!board) return;
    board.forEach((token, index) => {
        var cell = document.getElementById('cell' + index);
        if (token === 1) {
            cell.innerHTML = X;
            cell.classList.add('label-x');
            cell.classList.remove('label-o');
        }
        else if (token === 2) {
            cell.innerHTML = O;
            cell.classList.remove('label-x');
            cell.classList.add('label-o');
        }
    });
}

/*
  Define:
   0 => empty
   1 => x
   2 => o
*/

function init() {
  var body = document.getElementById('body-container');

  var modal = generateModal();
  var label = generateDiv('label', 'symbol-option', 'Choose a symbol: ');
  modal.appendChild(label);

  var xCallback = function() {
    console.log('player chose x.');
    dismissModal();
    playerToken = 1;
    compToken = 2;
    startGame('X');
    };

  var xOption = generateButton('optionButton', 'option-x', 'X', xCallback);
	
  var oCallback = function() {
    console.log('player chose o.');
    playerToken = 2;
    compToken = 1;
    dismissModal();
    startGame('O');
	};
  var oOption = generateButton('optionButton', 'option-o', 'O', oCallback);

  modal.appendChild(xOption);
  modal.appendChild(oOption);
  showModal();  
}

function startGame(option) {
  //generate board in the background
  var body = document.getElementById('body-container');  
  var container = generateDiv('container', 'main-container');
  body.appendChild(container);

  var choice = generateDiv('label', 'choice', 'Your Choice: ' + option);
  container.appendChild(choice);

  var gridContainer = generateDiv('', 'gridContainer');
  var grid = generateGrid(playerMove);

  gridContainer.appendChild(grid);
  container.appendChild(gridContainer);
  var restartButton = generateButton('optionButton', 'restartBtn', 'Restart', function() {document.location.reload()});
    container.appendChild(restartButton);

   // start new game
    var isCompPlay = option === X ? false : true;

    game = new Game(isCompPlay, msg => 
        generatePrompt(msg));

    game.printBoard();
}

function playerMove(el,row,col,i) {
  console.log("You clicked on element:",el);
  console.log("You clicked on row:",row);
  console.log("You clicked on col:",col);
  console.log("You clicked on item #:",i);

  el.className='clicked';

    if (el.innerHTML === '') {
        game.makeMove(i);
    }

  if (lastClicked) lastClicked.className='';
  lastClicked = el;
}

function generatePrompt(message) {
    window.alert(message, init);
}

init();