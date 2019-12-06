(function() {
	var rowNum = 3;
	var colNum = 3;

	function createGrid(board, callback) {
		var i = 0;
		var grid = document.createElement('table');
		grid.className = 'grid';
		for (var row = 0; row < rows; r++) {
			var tr = grid.appendChild(document.createElement('tr'));
			tr.className = ''
			for (var col = 0; col < cols; col++) {
				var cell = tr.appendChild(document.createElement('td'));
				cell.className = 'cell';
				var val = row * 3 + col;
				cell.id = val;
				cell.value = val;
				cell.addEventListener('click',(function(el,row,col, val){
			        return function(){ callback(el,row,col, val); }
			    })(cell,row,col, val),false);
			}
		}

		return grid;
	}

	function getCompToken() {
		return localStorage.getItem('compToken');
	}
});