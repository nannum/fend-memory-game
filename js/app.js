/**
 * @namespace document
 *
 * Click Event
 * @event document#click
 * @type {object}
 * @property {element} target
 */

function memoryGame() {
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
  const cardMatchClasses = ['match', 'rubberBand', 'animated'];
  const cardMisMatchClasses = ['no-match', 'wobble', 'animated'];
  const cardFlipClasses = ['open', 'show'];
  const starAnimateClasses = ['rotateOut', 'animated'];
  let stars = document.body.querySelector('.stars');
  let moves = document.body.querySelector('.moves');
  let minutes = document.body.querySelector('.minutes');
  let seconds = document.body.querySelector('.seconds');
  let restart = document.body.querySelector('.restart');
  let deck = document.body.querySelector('.deck');
  let modal = document.querySelector('.modal');
  let modalOverlay = document.querySelector('.modal-overlay');
  let modalStars = document.querySelector('.modal-stats-stars');
  let modalMoves = document.querySelector('.modal-moves');
  let modalMinutes = document.querySelector('.modal-minutes');
  let modalSeconds = document.querySelector('.modal-seconds');
  let close = document.querySelector('.modal-close');
  let numberOfMoves = 0;
  let starRating = 0;
  let timer = null;

  const MAX_NUMBER_OF_STARS = stars.children.length;
  const MAX_NUMBER_OF_CLICKS = 2;
  const selectedCards = [];

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
   * @description Starts the game timer
   * @returns {boolean}
   */
  function starTimer() {
    let seconds = 0;
    timer = setInterval(() => {
      seconds ++;
      insertTime(seconds);
    }, 1000);
  }

  /**
   * @description Stops the game timer
   * @returns {boolean}
   */
  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  /**
   * @description Adds the time to the DOM
   * @param {number} elapsedSeconds - The current number of seconds that have elapsed
   */
  function insertTime(elapsedSeconds) {
    seconds.innerHTML = elapsedSeconds % 60 < 10 ? `0${elapsedSeconds % 60}`: elapsedSeconds % 60;
    if (elapsedSeconds % 60 == 0) {
      minutes.innerHTML = parseInt(elapsedSeconds / 60);
    }
  }

  /**
   * @description Sets the game board by adding all the card elements to the DOM
   * @param {string[]} cards - A list of cards
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

    deck.appendChild(fragment);
  }

  /**
   * @description Removes all an element's children from the DOM
   * @param {element} element - The DOM element from which the elemengts are removed
   */
  function clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
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
   * @returns {boolean}
   */
  function isValidNumberOfClicks() {
    return selectedCards.length < MAX_NUMBER_OF_CLICKS;
  }

  /**
   * @description Tests if 2 cards are a match
   * @returns {boolean}
   */
  function isMatch() {
    return selectedCards[0].firstElementChild.className === selectedCards[1].firstElementChild.className;
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
    toggleElements(cards, ...cardMatchClasses);

    setTimeout(() => {
      toggleElements(cards, ...cardMatchClasses.slice(1));
    }, 550);
  }

  /**
   * @description Animates a set of cards that don't match
   * @param {element[]} cards - A list of cards
   */
  function animateMisMatch(cards) {
    toggleElements(cards, ...cardMisMatchClasses);

    setTimeout(() => {
      toggleElements(cards, ...cardMisMatchClasses);
    }, 550);

    setTimeout(() => {
      toggleElements(cards, ...cardFlipClasses);
    }, 600);
  }

  /**
   * @description Returns the current star rating
   * @returns {number} The current star rating
   */
  function getStarRating() {
    return (numberOfMoves <= 12) ? 3
      : (numberOfMoves > 12 && numberOfMoves <= 18) ? 2
      : (numberOfMoves > 18 && numberOfMoves <= 24) ? 1
      : 0;
  }

  /**
   * @description Removes stars from view
   */
  function removeStar() {
    if (!stars.children[starRating].classList.contains(starAnimateClasses.slice(1))) {
      stars.children[starRating].classList.add(...starAnimateClasses);
    }
  }

  /**
   * @description Resets the star rating
   * @param {element} stars - The star DOM element
   */
  function resetStars() {
    for (const star of stars.children) {
      star.classList.remove(...starAnimateClasses);
    }
  }

  /**
   * @description Loads stars in the modal
   */
  function loadModalStars() {
    let fragment = document.createDocumentFragment();

    for (let i = 0; i < starRating; i++) {
      let listElement = document.createElement('li');
      let symbolElement = document.createElement('i');

      symbolElement.setAttribute('class', 'fa fa-star');
      listElement.appendChild(symbolElement);
      fragment.appendChild(listElement);
    }
    modalStars.appendChild(fragment);
  }

  /**
   * @description Tests to see if the game is over
   * @returns {boolean}
   */
  function isGameOver() {
    let matches = document.querySelectorAll('.match');
    return matches.length === cards.length;
  }

  /**
   * @description Resets the game
   */
  function restartGame() {
    stopTimer();
    resetStars();
    starRating = 0;
    numberOfMoves = 0;
    selectedCards.length = 0;
    moves.innerHTML = 0;
    minutes.innerHTML = '00';
    seconds.innerHTML = '00';
    modalMoves.innerHTML = 0;
    modalMinutes.innerHTML = '00';
    modalSeconds.innerHTML = '00';
    clearElement(deck);
    clearElement(modalStars);
    shuffle(cards);
    setGameBoard(cards);
  }

  /**
   * @description Opens the end game modal
   */
  function openModal () {
    modal.classList.add('modal-show');
    modalOverlay.classList.add('modal-show');
  }

  /**
   * @description Closes the end game modal
   */
  function closeModal () {
    modal.classList.remove('modal-show');
    restartGame();
  }

  /**
   * @description Runs once the game is won
   */
  function gameOver() {
    stopTimer();
    modalMoves.innerHTML = moves.innerHTML;
    modalMinutes.innerHTML = minutes.innerHTML;
    modalSeconds.innerHTML = seconds.innerHTML;
    loadModalStars();
    openModal();
  }

  /**
   * @description Click event handler
   * @param {document#event:click} event
   * @listens document#click
   */
  function cardClickHandler(event) {
    if (isValidTarget(event.target) && isValidNumberOfClicks()) {
      if (!timer) {
        starTimer();
      }

      selectedCards.push(event.target);
      toggleClasses(event.target, ...cardFlipClasses);

      if (selectedCards.length == MAX_NUMBER_OF_CLICKS) {
        moves.innerHTML = ++numberOfMoves;
        starRating = getStarRating();

        if (starRating < MAX_NUMBER_OF_STARS) {
          removeStar(stars, starRating);
        }

        if (isMatch(selectedCards)) {
          animateMatch(selectedCards);

          if (isGameOver()) {
            gameOver();
          }

        } else {
          animateMisMatch(selectedCards);
        }

        setTimeout(() => {
          selectedCards.length = 0;
        }, 650);
      }
    }
  }

  shuffle(cards);
  setGameBoard(cards);
  deck.addEventListener('click', cardClickHandler);
  restart.addEventListener('click', restartGame);
  close.addEventListener('click', closeModal);
}
memoryGame();