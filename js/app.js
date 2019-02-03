/**
 * @namespace document
 *
 * Click Event
 * @event document#click
 * @type {object}
 * @property {element} target
 */

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
const stars = document.body.querySelector('.stars');
const moves = document.body.querySelector('.moves');
const minutes = document.body.querySelector('.minutes');
const seconds = document.body.querySelector('.seconds');
const deck = document.body.querySelector('.deck');
const MAX_NUMBER_OF_STARS = stars.children.length;
const MAX_NUMBER_OF_MATCHES = cards.length;
const MAX_NUMBER_OF_CLICKS = 2;
const selectedCards = [];
let moveCount = 0;
let numberOfMoves = 0;
let starRating = 0;

// Shuffle function from http://stackoverflow.com/a/2450976
/**
 * @description Shuffles an array
 * @param {array[]} array
 * @returns {array[]}
 */
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
 * @description The game timer
 * @param {element} secondsElement - The seconds DOM element
 * @param {element} minutesElement - The minutes DOM element
 */
function gameTimer(secondsElement, minutesElement) {
  let seconds = 0;
  timer = setInterval(() => {
    seconds ++;
    secondsElement.innerHTML = seconds % 60 < 10 ? `0${seconds % 60}`: seconds % 60;
    if (seconds % 60 == 0) {
      minutesElement.innerHTML = parseInt(seconds / 60);
    }
  }, 1000);
}

/**
 * @description Stops the timer
 */
function stopTimer() {
  window.clearInterval(timer);
}

/**
 * @description Sets the game board by adding card elements to a DOM fragment
 * @param {string[]} cards - A list of cards
 * @returns {DocumentFragment}
 */
function setGameBoard(cards) {
  let fragment = document.createDocumentFragment();

  cards.forEach(card => {
    let cardElement = document.createElement('li');
    let symbolElement = document.createElement('i');

    cardElement.setAttribute('class', 'card');
    symbolElement.setAttribute('class', `fa fa-${card}`);
    cardElement.appendChild(symbolElement);
    fragment.appendChild(cardElement);
  });

  return fragment;
}

/**
 * @description Tests if a click event target is valid
 * @param {document#event:click} target - The click event target
 * @returns {boolean}
 */
function isValidTarget(target) {
  return (
    target.classList.contains('card') &&
    !target.classList.contains('match') &&
    !target.classList.contains('open')
  );
}

/**
 * @description Tests if the number stored click events is valid
 * @param {number} numberOfClicks - The current number of click events recorded
 * @param {number} maxNumberOfClicks - The maximum number of click events allowed
 * @returns {boolean}
 */
function isValidNumberOfClicks(numberOfClicks, maxNumberOfClicks) {
  return numberOfClicks < maxNumberOfClicks;
}

/**
 * @description Tests if 2 cards are a match
 * @param {element[]} cards - An array of 2 card elements
 * @returns {boolean}
 */
function isMatch(cards) {
  return cards[0].firstElementChild.className === cards[1].firstElementChild.className;
}

/**
 * @description Tests to see if the game is over
 * @returns {boolean}
 */
function isGameOver() {
  let matches = document.querySelectorAll('.match');
  let cards = document.querySelectorAll('.card');
  return matches.length === cards.length;
}

/**
 * @description Toggles one or more classes on one element
 * @param {element} element - The DOM element to which the classes are added
 * @param {string[]} classList- A list of one or more classes
 */
function toggleClasses(element, ...classList) {
  classList.forEach(className => {
    element.classList.toggle(`${className}`);
  });
}

/**
 * @description Toggles one or more classes on multiple elements
 * @param {element[]} elements - The DOM elements to which the classes are added
 * @param {string[]} classList- A list of one or more classes
 */
function toggleElements(elements, ...classList) {
  elements.forEach(element => {
    toggleClasses(element, ...classList);
  });
}

/**
 * @description Animates a set of matching cards
 * @param {element[]} cards - A list of cards
 */
function animateMatch(cards) {
  toggleElements(cards, 'match', 'rubberBand', 'animated');

  setTimeout(() => {
    toggleElements(cards, 'rubberBand', 'animated');
  }, 550);
}

/**
 * @description Animates a set of cards that don't match
 * @param {element[]} cards - A list of cards
 */
function animateMisMatch(cards) {
  toggleElements(cards, 'no-match', 'wobble', 'animated');

  setTimeout(() => {
    toggleElements(cards, 'no-match', 'wobble', 'animated');
  }, 550);

  setTimeout(() => {
    toggleElements(cards, 'show', 'open');
    // toggleElements(cards, 'open', 'show');
  }, 600);
}

/**
 * @description Returns the current star rating
 * @param {number} numberOfMoves - The current number of moves the user has made
 * @returns {number} The current star rating
 */
function getStarRating(numberOfMoves) {
  return (numberOfMoves <= 11) ? 3
    : (numberOfMoves > 11 && numberOfMoves <= 16) ? 2
    : (numberOfMoves > 16 && numberOfMoves <= 20) ? 1
    : 0;
}

/**
 * @description Removes stars from view
 * @param {element} stars - The star DOM element
 */
function removeStar(stars, rating) {
  if (!stars.children[rating].classList.contains('rotateOut')) {
    toggleClasses(stars.children[rating], 'rotateOut', 'animated');
  }
}

/**
 * @description Click event handler
 * @param {document#event:click} event
 * @listens document#click
 */
function cardClickHandler(event) {
  if (isValidTarget(event.target) && isValidNumberOfClicks(selectedCards.length, MAX_NUMBER_OF_CLICKS)) {
    selectedCards.push(event.target);
    toggleClasses(event.target, 'open', 'show');

    if (selectedCards.length == MAX_NUMBER_OF_CLICKS) {
      numberOfMoves++;
      moves.innerHTML = numberOfMoves;
      starRating = getStarRating(numberOfMoves);

      if (starRating < MAX_NUMBER_OF_STARS) {
        removeStar(stars, starRating);
      }

      (isMatch(selectedCards)) ?
        animateMatch(selectedCards) :
        animateMisMatch(selectedCards);

      setTimeout(() => {
        selectedCards.length = 0;
      }, 650);
    }
  }
}

//shuffle(cards);
deck.appendChild(setGameBoard(cards));
deck.addEventListener('click', cardClickHandler);

gameTimer(seconds, minutes);