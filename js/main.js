var X = 'X';
var O = 'O';

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
  if (modal) modal.classList.remove('show-modal');
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
  if (text) {
    div.innerHTML = text;
  }
  if(callback)  div.onclick = callback;
  
  return div;
}

function init() {
  var body = document.getElementById('body-container');

  var modal = generateModal();
  var label = generateDiv('label', 'symbol-option', 'Choose a symbol: ');
  modal.appendChild(label);

  var xCallback = function() {
		localStorage.setItem('compToken', X);	
    console.log('player chose x.');
	};
	var xOption = generateButton('optionButton', 'option-x', 'X', xCallback);
	
  var oCallback = function() {
		localStorage.setItem('compToken', O);
    console.log('player chose o.');
	};
	var oOption = generateButton('optionButton', 'option-o', 'O', oCallback);

  modal.appendChild(xOption);
  modal.appendChild(oOption);

  //generate board in the background
  var container = generateDiv('container', 'main-container');
  body.appendChild(container);
  showModal();  
}

init();