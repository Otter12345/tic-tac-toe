var X = 'X';
var O = 'O';

function generateModal(id) {
  var modal = document.createElement('div');
	modal.className = 'modal';
  if (id) modal.id = id;
  var content = document.createElement('div');
  content.className = 'modal-content';
  modal.appendChild(content);
  return modal;
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

function init() {
	var modal = generateModal();
  modal.innerHTML = 'Choose a symbol: ';

  var xCallback = function() {
		localStorage.setItem('compToken', X);	
    console.log('player chose x.');
	};
	var xOption = generateButton('optionButton', 'label-x', 'X', xCallback);
	
  var oCallback = function() {
		localStorage.setItem('compToken', O);
    console.log('player chose o.');
	};
	var oOption = generateButton('optionButton', 'label-o', 'O', oCallback);

  modal.appendChild(xOption);
  modal.appendChild(oOption);
}

init();