const   canvas = document.getElementById("pongCanvas");
const   ctx = canvas.getContext("2d");
let     theme = 1;
let     start = false;
let     onePlayer = false, twoPlayers = false, tournament = false;
let     level;
let     playLocal = false;
let     playOnline = false;
let     ballLaunched = false;
let     leftPlayerScore = 0, rightPlayerScore = 0;
let     ballSpeedX, ballSpeedY;

// Initialisation des raquettes
let     paddleWidth = 9, paddleHeight = 100;
let     leftPaddleY = (canvas.height - paddleHeight) / 2;
let     rightPaddleY = (canvas.height - paddleHeight) / 2;
let     leftPaddleHand = false;
let     rightPaddleHand = false;
let     leftPlayerName = "";
let     rightPlayerName = "";
let     leftPlayerNamePrint, rightPlayerNamePrint;

// Initialisation de la balle
const   ballSize = 8;
let     ballX;
let     ballY;
// Sounds init
const paddleFX = new Audio('./sounds/ballSound1.wav');
const pointFX = new Audio('./sounds/pointSound.wav');
const applauseFX = new Audio('./sounds/applauseSound.wav');

//******************************** Key Events ***********************
// left player 1
let q_keyPressed = false;
let a_keyPressed = false;
// right player 2
let p_keyPressed = false;
let l_keyPressed = false;

let spaceBarPressed = false;

// let pKey = false;

window.addEventListener("keydown", (event) => {

    switch(event.key) {

        case "q":
            q_keyPressed = true;
            break;
        case "a":
            a_keyPressed = true;
            break;
        case "p":
            p_keyPressed = true;
            break;
        case "l":
            l_keyPressed = true;
            break;
    }
   
});

window.addEventListener("keyup", (event) => {

    switch(event.key) {

        case "q":
            q_keyPressed = false;
            break;
        case "a":
            a_keyPressed = false;
            break;
        case "p":
            p_keyPressed = false;
            break;
        case "l":
            l_keyPressed = false;
            break;
    }
});

// Space bar
window.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        
        spaceBarPressed = true;
    }
});


// Theme changing 1, 2, 3
window.addEventListener("keydown", (event) => {
    switch(event.key) {
        case "1":
            theme = 0;
            break;
        case "2":
            theme = 1;
            break;
        case "3":
            theme = 2;
            break;
    }
});


//*************** Themes Colors *****************
const themeColor = [
    // theme 0
    { field:        "#33CCFF",
      paddle:       "#fff",
      score:        "#737373",
      playersName:  "#fff",
      ball:         "#fff",
      winPrint:     "#11D300",
      midLine:      "#fff" },
    // theme 1
    { field:        "#fff",
      paddle:       "#33CCFF",
      score:        "#33CCFF",
      playersName:  "#33CCFF",
      ball:         "#33CCFF",
      winPrint:     "#11D300",
      midLine:      "#33CCFF" },
    // theme 2
    { field:        "#000000",
      paddle:       "#00EEFF",
      score:        "#00EEFF",
      playersName:  "#00EEFF",
      ball:         "#00EAFF",
      winPrint:     "#11D300",
      midLine:      "#00EEFF" },
];