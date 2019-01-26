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
const deck = document.body.querySelector('.deck');
const stars = document.body.querySelector('.stars');
const moves = document.body.querySelector('.moves');
const MAX_NUMBER_OF_CLICKS = 2;
const MAX_NUMBER_OF_MATCHES = cards.length;
const MAX_NUMBER_OF_STARS = stars.children.length;
const selectedCards = [];
let moveCount = 0;
let starRating = MAX_NUMBER_OF_STARS;

deck.addEventListener('click', cardClickHandler);

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
    // cards[0].firstChild.className === cards[1].firstChild.className
    cards[0].firstElementChild.className === cards[1].firstElementChild.className
  );
}

/**
 * @description Tests to see if the game is over
 * @param {number} maxNumberOfClicks
 */
function isGameOver(maxNumberOfMatches) {
  let matches = document.querySelectorAll('.match');
  return (
    matches.length === maxNumberOfMatches
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
  }, 550);

  setTimeout(() => {
    if (matchStatus == 'no-match') {
      flipCards(cards, 'no-match', 'open', 'show');
    }
    cards.length = 0;
  }, 650);
}

/**
 * @description Tests if the selected cards match
 * @param {string[]} cards
 */
function removeStar(star, rating) {
  if (star.parentNode.children.length > rating) {
    flipCard(star, 'rotateOut', 'animated');
    setTimeout(() => {
        star.parentNode.removeChild(star);
    }, 600);
  }
}

/**
 * @description Click event handler
 * @param {document#event:click} event
 * @listens document#click
 */
function cardClickHandler(event) {
  if (isValidClick(event, MAX_NUMBER_OF_CLICKS, selectedCards.length)) {
    selectedCards.push(event.target);
    flipCard(event.target, 'open', 'show');

    if (selectedCards.length == MAX_NUMBER_OF_CLICKS) {
      moveCount++;
      moves.innerHTML = moveCount;
      if (moveCount > 11 && moveCount <= 16) {
        starRating = 2;
        removeStar(stars.lastElementChild, starRating);
      }

      if (moveCount > 16 && moveCount <= 20) {
        starRating = 1;
        removeStar(stars.lastElementChild, starRating);
      }

      if (moveCount > 20 && starRating > 0) {
        starRating = 0;
        removeStar(stars.lastElementChild, starRating);
      }

      if (isAMatch(selectedCards)) {
        animateCards(selectedCards, 'match', 'rubberBand', 'animated');
        if (isGameOver(MAX_NUMBER_OF_MATCHES)) {
          gameOver();
        }
      } else {
        animateCards(selectedCards, 'no-match', 'wobble', 'animated');
      }
    }
  }
}

//shuffle(cards);
setGameBoard(deck, cards);