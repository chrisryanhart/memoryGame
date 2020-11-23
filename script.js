const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
const cardCount = {red: 0, blue: 0, purple: 0, green: 0, orange: 0};

//once cards are matched, they can't return to the default white color.
const matchedCards = {red: '', blue: '', purple: '', green: '', orange: ''};

//prevents multi-card select
let stopper = [0];

//used to enter match sequence
let totalCardsPicked;

//counts matches to know when game is over.  Then high score can be recorded.
const matchCount = [0];

//keeps score through game
const clickCount = [0];

const record = JSON.parse(localStorage.getItem('record score'));
const spanRecord = document.querySelector('.record span');

let noHighScore = localStorage.getItem('record text') || 'No record score yet';

//loads record score when loading/refreshing page
if(noHighScore ==='No record score yet'){
  spanRecord.innerText = noHighScore;
}else{
  spanRecord.innerText = `${record}`;
}


function handleCardClick(event) {
  // you can use event.target to see which element was clicked

  let divColor = event.target.className;
  // let target  = event.target;

  if(stopper[0] <= 1){

      scoreKeeper();

      if(event.target.style.backgroundColor === ''){

        if(divColor === "red"){
          event.target.style.backgroundColor = 'red';     
          cardCount.red++;

        }else if(divColor === "green"){
          event.target.style.backgroundColor = 'green';
          cardCount.green++;

        }else if(divColor === "orange"){
          event.target.style.backgroundColor = 'orange';
          cardCount.orange++;

        }else if(divColor === "blue"){
          event.target.style.backgroundColor = 'blue';
          cardCount.blue++;

        } else{
          event.target.style.backgroundColor = 'purple';
          cardCount.purple++;
        }
        stopper[0]++;
      }

      totalCardsPicked = cardCount.red + cardCount.blue + cardCount.purple + cardCount.green + cardCount.orange;


    //Enter match evaluation sequence
    if(totalCardsPicked >= 2){
      for(card in cardCount){

        if(cardCount[card] === 2){
          matchedCards[card] = "matched";
          
          matchCount[0]++;
          cardCount[card] = 0;
        }
      }
      setTimeout(function() {
        //selects all cards (divs)
        const allCards = document.querySelector('div').querySelectorAll('div');

        //match = color in this case 
        for(div of allCards){
          for(match in matchedCards){
            if(div.className === match && matchedCards[match] !== "matched"){
              div.style.backgroundColor = '';
            }
          }
        }
          cardCount.red = 0;
          cardCount.blue = 0;
          cardCount.purple = 0;
          cardCount.green = 0;
          cardCount.orange = 0;
      }, 1000);
    }

    //update totalCardsPicked to zero
    totalCardsPicked = cardCount.red + cardCount.blue + cardCount.purple + cardCount.green + cardCount.orange;

    if(matchCount[0] === 5){
      if(clickCount[0] < record || noHighScore === "No record score yet"){
        storeScore();
        let newHighScore = localStorage.getItem('record score');
        spanRecord.innerText = `${newHighScore}`;
      }
    }

    if(stopper[0] === 2){
      setTimeout(function() {
        stopper[0] = 0;
    }, 1000);

    }

  }  //end if statement
}  //end handleclick function

//prevents multiple games from starting at the same time
const startPressed = [0];

//starts game during initial page load
const startButton = document.querySelector('.start');
startButton.addEventListener('click', function(){
  if(startPressed[0] === 0){
    createDivsForColors(shuffledColors);

    startPressed[0]++;
  }
})


//restarts game once game is complete
const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', function(){
  const newshuffle = document.querySelector('div').querySelectorAll('div');
  if(matchCount[0] === 5){
    console.log('entered restart if statement');
    for(div of newshuffle){
      let parentRestart = div.parentElement;
      parentRestart.removeChild(div);
    }
    matchedCards.red = ''; 
    matchedCards.blue = ''; 
    matchedCards.purple = ''; 
    matchedCards.green = ''; 
    matchedCards.orange = ''; 

    clickCount[0] = 0;

    const scoreReset = document.querySelector('span');
    scoreReset.innerText = `${clickCount[0]}`;

    matchCount[0] = 0;

    createDivsForColors(shuffle(COLORS));
  }
});

function scoreKeeper(){
  clickCount[0]++;

  const score = document.querySelector('span');
  score.innerText = `${clickCount[0]}`;
}

function storeScore(){
  localStorage.setItem("record score", `${clickCount[0]}`);
  localStorage.setItem('record text', 'we have scores');
}

