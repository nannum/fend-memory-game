/**
 * @namespace document
 * 
 * Click Event
 * @event document#click
 * @type {object}
 * @property {element} target
 */

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
gameBoard.addEventListener('click', clickHandler);

/**
* @description Adds one or more list item elements to the DOM
* @param {element} element - The DOM element to which the list items are added
* @param {string[]} array - A list of one or more list items
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

/**
* @description Click event handler 
* @param {document#event:click} event
* @listens document#click
*/
function clickHandler(event) {
  if (event.target.nodeName === 'LI' ) {
    toggleClass(event.target, 'open', 'show');
  }
  if (event.target.nodeName === 'I' ) {
    toggleClass(event.target.parentNode, 'open', 'show');
  }
}

/**
* @description Toggles a list of classes on a DOM element
* @param {element} element - The DOM element to which the classes are added
* @param {string[]} array - A list of one or more classes
*/
function toggleClass(element, ...array) {
  array.forEach(item => {
    element.classList.toggle(`${item}`);
  });
}

shuffle(cards);
addItems(gameBoard, cards);