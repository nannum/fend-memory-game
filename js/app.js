/**
 * @namespace document
 *
 * Click Event
 * @event document#click
 * @type {object}
 * @property {element} target
 */

let clickCount = 0;
let starLevel = 0;
const deck = document.body.querySelector('.deck');
const MAX_NUMBER_OF_CLICKS = 2;
const selectedCards = [];
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
deck.addEventListener('click', clickHandler);

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

/**
 * @description Adds cards to the DOM
 * @param {element} deck - The DOM element to which the cards are added
 * @param {string[]} cards - A list of cards
 */
function setGameBoard(deck, cards) {
  let fragment = document.createDocumentFragment();

  cards.forEach(card => {
    let parentElement = document.createElement('li');
    let childElement = document.createElement('i');

    parentElement.setAttribute('class', 'card');
    childElement.setAttribute('class', `fa fa-${card}`);
    parentElement.appendChild(childElement);
    fragment.appendChild(parentElement);
  });

  deck.appendChild(fragment);
}

/**
 * @description Tests if a click event is valid
 * @param {document#event:click} event
 * @param {number} maxNumberOfClicks
 * @param {number} numberOfClicks
 */
function isValidClick(event, maxNumberOfClicks, numberOfClicks) {
  return (
    event.target.classList.contains('card') &&
    !event.target.classList.contains('match') &&
    !event.target.classList.contains('open') &&
    numberOfClicks < maxNumberOfClicks
  );
}

/**
 * @description Tests if 2 cards are a match
 * @param {element[]} cards - An array of 2 card elements
 */
function isAMatch(cards) {
  return (
    cards[0].firstChild.className === cards[1].firstChild.className
  );
}

/**
 * @description Flips 1 card by toggling one or more classes on the card element
 * @param {element} card - The DOM element to which the classes are added
 * @param {string[]} classList- A list of one or more classes
 */
function flipCard(card, ...classList) {
  classList.forEach(className => {
    card.classList.toggle(`${className}`);
  });
}

/**
 * @description Flips 2 card by toggling one or more classes on the card element
 * @param {element[]} cards - The DOM elements to which the classes are added
 * @param {string[]} classList- A list of one or more classes
 */
function flipCards(cards, ...classList) {
  cards.forEach(card => {
    flipCard(card, ...classList);
  });
}

/**
 * @description Tests if the selected cards match
 * @param {string[]} cards
 */
function animateCards(cards, matchStatus, ...animationList) {
  let classList = [matchStatus, ...animationList];
  flipCards(cards, ...classList);
  setTimeout(() => {
    flipCards(cards, ...animationList);
  }, 650);

  setTimeout(() => {
    if (matchStatus == 'no-match') {
      flipCards(cards, 'no-match', 'open', 'show');
    }
    cards.length = 0;
  }, 750);
}

/**
 * @description Click event handler
 * @param {document#event:click} event
 * @listens document#click
 */
function clickHandler(event) {
  if (isValidClick(event, MAX_NUMBER_OF_CLICKS, selectedCards.length)) {
    selectedCards.push(event.target);
    flipCard(event.target, 'open', 'show');

    if (selectedCards.length == MAX_NUMBER_OF_CLICKS) {
      if (isAMatch(selectedCards)) {
        animateCards(selectedCards, 'match', 'rubberBand', 'animated');
      } else {
        animateCards(selectedCards, 'no-match', 'wobble', 'animated');
      }
    }
  }
}

//shuffle(cards);
setGameBoard(deck, cards);