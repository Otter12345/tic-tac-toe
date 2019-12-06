export class Game{
	constructor(board, player, depth) {
		this.board = board;
		this.player = player;
		this.depth = depth;

		this.choosenState = null;
		this.winner = -1;
	}

	getScore() {
		var computerToken = getCompToken();

		this.winner = this.checkFinish();

		if (winner > -1) {
			if (winner === 0) return 0;
			if (winner === computerToken) return 10;

			return -10;
		}

		//reach max depth
		if (this.depth >= 1000) {
			return this.board;
		}

		var availablePos = this.getAvailablePos();

		if (this.player === computerToken){
			let maxScore = 1000;
			let maxIndex = 0;

			for (var i = 0; i < availablePos.length; i++) {
				var pos = availablePos[i];
				var newBoard = this.gene
			}
		}
	}

	checkFinish() {
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
		if (board.length === 9) return 0;

		return -1;
	}


	getAvailablePos() {
		var res = [];
		board.forEach((ele, index => {
			if (!ele) res.push(index);
		}));

		return res;
	}

	generateNewBoard(pos, player) {
		var newBoard = _.clone(this.board);
		newBoard[pos] = player;
		return newBoard;
	}

	nextMove() {
		this.board = _.clone(this.choosenState.board);
	}
}

function changeTurn(player) {
	return player === X ? O : X;
}