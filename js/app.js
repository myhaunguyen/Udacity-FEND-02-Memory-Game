/*
 * DOM Objects
 */
const deck = document.getElementById('deck');
const restartButton = document.getElementById('restart')
const timer = document.getElementById("timer");
const moves = document.getElementById("moves");
const winningModel = document.getElementById("winningModel")
const playAgain = document.getElementById("playAgain");
const starsDOM = document.getElementById("stars").getElementsByTagName("i");
/*
 * app variables
 */
let shuffledCardList;
let numberOfMoves;
let firstCardClick, secondCardClick;
let isAbleToClick;
// @description game timer
let second = 0, minute = 0; hour = 0;
let interval;
let matchCount;
let currentStars;

/*
 * Create a list that holds all of your cards
 */
const initialCardList = ['fa fa-diamond', 'fa fa-diamond',
    'fa fa-paper-plane-o', 'fa fa-paper-plane-o',
    'fa fa-anchor', 'fa fa-anchor',
    'fa fa-bolt', 'fa fa-bolt',
    'fa fa-cube', 'fa fa-cube',
    'fa fa-leaf', 'fa fa-leaf',
    'fa fa-bicycle', 'fa fa-bicycle',
    'fa fa-bomb', 'fa fa-bomb'];

/*
 * Add event listeners
 */
function initEventListener() {
    restartButton.addEventListener('click', function (event) {
        startGame();
    });

    deck.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            onClickCard(event.target);
        }
    });

    playAgain.addEventListener('click', function (e) {
        winningModel.classList.remove("show");
        startGame();
    });
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCardsOnThePage(cardList) {
    cardList.forEach(card => {
        const cardElement = createCard(card);
        deck.appendChild(cardElement);
    });
}

function onClickCard(cardTag) {
    //check if card is openable
    if (!isAbleToClick || cardTag.classList.contains('match') || cardTag.classList.contains('show')) {
        return;
    }

    if (firstCardClick) {
        numberOfMoves++;
        moves.innerHTML = `${numberOfMoves}`;
        //check if 2 cards have the same value
        if (firstCardClick.firstChild.getAttribute('class') === cardTag.firstChild.getAttribute('class')) {
            firstCardClick.setAttribute('class', 'card match');
            cardTag.setAttribute('class', 'card match');
            firstCardClick = undefined;
            matchCount++;
            if (matchCount === 8) {
                showWinningScreen();
            }
        } else {
            secondCardClick = cardTag;
            cardTag.setAttribute('class', 'card open show');
            isAbleToClick = false;
            setTimeout(function () {
                isAbleToClick = true;
                firstCardClick.setAttribute('class', 'card');
                secondCardClick.setAttribute('class', 'card');
                firstCardClick = undefined;
                secondCardClick = undefined;
            }, 1000);

        }
        updateStars();
    } else {
        cardTag.setAttribute('class', 'card open show');
        firstCardClick = cardTag;
    }



}

// Show winning screen
function showWinningScreen() {
    clearInterval(interval);
    finalTime = timer.innerHTML;

    // show congratulations modal
    winningModel.classList.add("show");

    // declare star rating variable
    var starRating = document.getElementById("stars").innerHTML;

    //showing move, rating, time on modal
    document.getElementById("finalMove").innerHTML = numberOfMoves;
    document.getElementById("starRating").innerHTML = document.getElementById("stars").innerHTML;
    document.getElementById("totalTime").innerHTML = finalTime;
}
/**
 * 
 * @description update number of stars
 */
function updateStars() {
    let mUpdateStars = 0;
    if (numberOfMoves < 15) {
        mUpdateStars = 3;
    } else if (numberOfMoves < 30) {
        mUpdateStars = 2;
    } else {
        mUpdateStars = 1;
    }

    for (let i = 0; i < starsDOM.length; i++) {
        if (i < mUpdateStars) {
            starsDOM[i].setAttribute("class", "fa fa-star");
        } else {
            starsDOM[i].setAttribute("class", "fa fa-star-o");
        }
    }
    currentStars = mUpdateStars;
}

function createCard(card) {
    const liTag = document.createElement('li');
    liTag.setAttribute('class', 'card');

    const iTag = document.createElement('i');
    iTag.setAttribute('class', card);

    liTag.appendChild(iTag);

    return liTag;
}

// reset deck 
function resetDeck() {
    deck.innerHTML = '';
}

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

    const [a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4] = array;

    console.log(a1, a2, a3, a4);
    console.log(b1, b2, b3, b4);
    console.log(c1, c2, c3, c4);
    console.log(d1, d2, d3, a4);

    return array;
}


function startTimer() {
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);

    interval = setInterval(function () {
        timer.innerHTML = `${minute} mins ${second} secs`;
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}


function startGame() {
    second = 0; minute = 0; hour = 0;
    numberOfMoves = 0;
    matchCount = 0;
    currentStars = 0;
    moves.innerHTML = `${numberOfMoves}`;
    isAbleToClick = true;
    // shuffle the initial cards
    shuffledCardList = shuffle(initialCardList);
    updateStars();
    //reset the deck
    resetDeck();

    //display shuffledCards on the deck
    displayCardsOnThePage(shuffledCardList);

    startTimer();
}

initEventListener();
startGame();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
