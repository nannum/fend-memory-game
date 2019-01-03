// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const cards = [
  'diamond',
  'diamond',
  'paper-plane-o',
  'paper-plane-o',
  'anchor',
  'anchor',
  'bolt',
  'bolt',
  'cube',
  'cube',
  'leaf',
  'leaf',
  'bicycle',
  'bicycle',
  'bomb',
  'bomb'
];
const gameBoard = document.body.querySelector('.deck');

/**
* @description Adds list item elements to the DOM
* @param {element} element
* @param {string[]} array
*/
function addItems(element, array) {
  let fragment = document.createDocumentFragment();

  array.forEach(item => {
    let parentElement = document.createElement('li');
    let childElement = document.createElement('i');
    parentElement.setAttribute('class', 'card');
    childElement.setAttribute('class', `fa fa-${item}`);
    parentElement.appendChild(childElement);
    fragment.appendChild(parentElement);
  });

  element.appendChild(fragment);
}

shuffle(cards);
addItems(gameBoard, cards);