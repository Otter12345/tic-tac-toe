var X = 'X';
var O = 'O';
var MAX = 100; //computer win
var MIN = -100; //player win
var DRAW = 0; 
var compBestMove = -1;
var depth = 0;
var isCompPlay = false;
var rowNum = 3;
var colNum = 3;
var lastClicked;
var playerToken;
var compToken;
var optimalMoves = [];

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

/*
  Define:
   0 => empty
   1 => x
   2 => o
*/
function init() {
  //TODO: allow refresh
  //if (isOngoing) return;
  var body = document.getElementById('body-container');

  var modal = generateModal();
  var label = generateDiv('label', 'symbol-option', 'Choose a symbol: ');
  modal.appendChild(label);

  var xCallback = function() {
		//localStorage.setItem('compToken', X);	
    console.log('player chose x.');
    dismissModal();
    playerToken = 1;
    compToken = 2;
    startGame('X');
	};
	var xOption = generateButton('optionButton', 'option-x', 'X', xCallback);
	
  var oCallback = function() {
    //localStorage.setItem('compToken', O);
    console.log('player chose o.');
    playerToken = 2;
    compToken = 1;
    isCompPlay = true;
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
  var restartButton = generateButton('button', 'restartBtn', 'Restart', function() {document.location.reload()});
  container.appendChild(choice);
  container.appendChild(restartButton);

  var gridContainer = generateDiv('', 'gridContainer');
  
  var grid = generateGrid(playerMove);
  gridContainer.appendChild(grid);
  container.appendChild(gridContainer);

  if (option === 'O') {
    compTurn();
  }
}

function compTurn() {
  var board = getCurrentBoard();
  findCmpMove(board, 0, true);
  var bestMove = findBestMove();
  displayMove(bestMove, compToken);
}

function playerMove(el,row,col,i) {
  var finish = checkFinish();

  if(checkFinish() !== -1) window.location.reload();

  console.log("You clicked on element:",el);
  console.log("You clicked on row:",row);
  console.log("You clicked on col:",col);
  console.log("You clicked on item #:",i);

  el.className='clicked';

  if (el.innerHTML === '') {
    el.innerHTML = playerToken === 1 ? X : O;
    if (playerToken === 1) {
      el.classList.add('label-x');
      el.classList.remove('label-o');
    }
    else {
      el.classList.remove('label-x');
      el.classList.add('label-o');
    }

    setTimeout(compTurn, 1000);
  }

  if (lastClicked) lastClicked.className='';
  lastClicked = el;
}

function getWinner(token) {
  if (token === -1) return;
  if (token === 0) generatePrompt('It\'s a draw. Please restart the game.');
  else if (token === playerToken) generatePrompt('You have won!');
  else if (token === compToken) generatePrompt('You have lost..');
}

function checkFinish() {
  var board = getCurrentBoard();
  //check rows
  for (var i = 0; i < 9; i += 3) {
    if (board[i] && board[i] === board[i+1] && board[i+1] === board[i+2]) {
      return board[i];
    }
  }

  //check cols
  for (var i = 0; i < 3; i++) {
    if (board[i] && board[i] === board[i+3] && board[i] === board[i+6]) {
      return board[i];
    }
  }

  //check diagonals
  if (board[0] && board[0]===board[4] && board[0] === board[8]) return board[0];
  if (board[2] && board[2]===board[4] && board[2] === board[6]) return board[2];

  //check if there is more empty spot to play
  if (board.length === 9) {
    return 0;
  }

  return -1;
}

function generatePrompt(message) {
  window.prompt(message, init);
}

function generateNewBoard(pos, player) {
  
  var newBoard = _.clone(this.board);
  newBoard[pos] = player;
  return newBoard;
}

function getAvailablePos(grid) {
  var res = [];
  for (var i = 0; i < 9; i++) {
    if (grid[i] !== 1 && grid[i] !== 2) res.push(i);
  }

  return res;
}

function calculate(grid,item) {
	var count = 0;
	var	blank_arr = [];

	//填满当前棋局
	for (var i = 0;i < 9;i++) {
		if (!grid[i]) {
			blank_arr.push(i);//记录当前棋局空格的位置
			grid[i] = item;
		}
	}

	if (isALine(grid[0],grid[1],grid[2]) && grid[0] == item) {
		count++;
	}
	if (isALine(grid[0],grid[4],grid[8]) && grid[0] == item) {
		count++;
	}
	if (isALine(grid[0],grid[3],grid[6]) && grid[0] == item) {
		count++;
	}
	if (isALine(grid[2],grid[4],grid[6]) && grid[2] == item) {
		count++;
	}
	if (isALine(grid[2],grid[5],grid[8]) && grid[2] == item) {
		count++;
	}
	if (isALine(grid[3],grid[4],grid[5]) && grid[4] == item) {
		count++;
	}
	if (isALine(grid[1],grid[4],grid[7]) && grid[4] == item) {
		count++;
	}
	if (isALine(grid[6],grid[7],grid[8]) && grid[6] == item) {
		count++;
	}

	//恢复棋局
	for (var i = 0;i < blank_arr.length;i++) {
		grid[blank_arr[i]] = '';
	}
	return count;
}
function findCmpMove(board, depth, isCompPlay) {
  if (depth >= 1000) {
     getWinner(checkFinish());
     return board;
  }

  if (depth === 0) optimalMoves = [];

  var bestValue;
  var bestIndex = -1;    
  var availablePos = getAvailablePos(board);
  
  var board = getCurrentBoard();

  if (isCompPlay) {
      bestValue = -1000;
      availablePos.forEach(element => {
          var newBoard = makeMove(element, board, compToken);
          var value = findCmpMove(newBoard, depth + 1, !isCompPlay);
          if (value > bestValue) {
              var move = {
                  index: element,
                  value: value
              };
              optimalMoves.push(move);
              bestValue = value;
          }
      });

      return bestValue;
  }

  bestValue = 1000;
  bestIndex = -1;

  availablePos.forEach(element => {
      var value = makeMove(element, board, playerToken);
      if (value < bestValue) {
          var move = {
              index: element,
              value: value
          };
          optimalMoves.push(move);
          bestValue = value;
      }
  });

  return bestValue;
}

function makeMove(pos, board, player) {
  board[pos] = player;
  return board;
}

function displayMove(index, player) {
  if (index < 0) console.log('sthm is wrong');
  var cell = document.getElementById('cell'+index);
  if (compToken === 1) {
    cell.innerHTML = X;
    cell.classList.add('label-x');
    cell.classList.remove('label-o');
  }
  else {
    cell.innerHTML = O;    
    cell.classList.remove('label-x');
    cell.classList.add('label-o');
  }

  var isFinished = checkFinish();
  if (isFinished !== -1) {
      getWinner(isFinished);
  }
}

function findBestMove() {
  var value = -1;
  var bestIndex = -1;
  optimalMoves.forEach(element => {
      if (element.value > value) bestIndex = element.index;
  });

  return bestIndex;
}

function changeTurn() {
  isCompPlay = !isCompPlay;
}

function getCurrentBoard() {
  var board = [];
  for (var i = 0; i < 9; i++) {
    var cell = document.getElementById('cell' + i).innerHTML;
    if (cell !== '') board[i] = cell === X ? 1 : 2;
  }

  return board;
}
  
init();