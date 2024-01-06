const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
let theme = 1;
let start = false;
let onePlayer = false, twoPlayer = false, tournament = false;
let level = 5;
let ballLaunched = false;
let spaceBarPressed = false;
let playerLeftScore = 0, playerRightScore = 0;
let ballSpeedX, ballSpeedY;

// Initialisation des raquettes
let   paddleWidth = 9, paddleHeight = 70;
let     leftPaddleY = (canvas.height - paddleHeight) / 2;
let     rightPaddleY = (canvas.height - paddleHeight) / 2;
let     leftPaddleHand = false;
let     rightPaddleHand = false;
let   leftPlayerName = "Chris";
let   rightPlayerName = "Axel";
let     leftPlayerPrint, rightPlayerPrint;

// Initialisation de la balle
const   ballSize = 8;
let     ballX;
let     ballY;


//******************************** Key Events ***********************
// left player 1
let wKeyPressed = false;
let sKeyPressed = false;
// right player 2
let arrowUpPressed = false;
let arrowDownPressed = false;

window.addEventListener("keydown", (event) => {

    switch(event.key) {

        case "ArrowUp":
            arrowUpPressed = true;
            break;
        case "ArrowDown":
            arrowDownPressed = true;
            break;
        case "w":
            wKeyPressed = true;
            break;
        case "s":
            sKeyPressed = true;
            break;
    }
   
});

window.addEventListener("keyup", (event) => {

    switch(event.key) {

        case "ArrowUp":
            arrowUpPressed = false;
            break;
        case "ArrowDown":
            arrowDownPressed = false;
            break;
        case "w":
            wKeyPressed = false;
            break;
        case "s":
            sKeyPressed = false;
            break;
    }
});

// Space bar
window.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        
        spaceBarPressed = true;
    }
});

// Theme changing 1, 2, 3, 4, 5, 6 
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
        case "4":
            theme = 3;
            break;
        case "5":
            theme = 4;
            break;
        case "6":
            theme = 5;
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
      midLine:      "#fff" },
    // theme 1
    { field:        "#fff",
      paddle:       "#33CCFF",
      score:        "#33CCFF",
      playersName:  "#33CCFF",
      ball:         "#33CCFF",
      midLine:      "#33CCFF" },
    // theme 2
    { field:        "#000000",
      paddle:       "#00EEFF",
      score:        "#00EEFF",
      playersName:  "#00EEFF",
      ball:         "#00EAFF",
      midLine:      "#00EEFF" },
    // theme 3
    { field:        "#05FF00",
      paddle:       "#004AFF",
      score:        "#0042FF",
      playersName:  "#0042FF",
      ball:         "#004AFF",
      midLine:      "#fff" },
    // theme 4
    { field:        "#B7B7B7",
      paddle:       "#004AFF",
      score:        "#004AFF",
      playersName:  "#fff",
      ball:         "#004AFF",
      midLine:      "#fff" },
    // theme 4
    { field:        "#FF00F3",
      paddle:       "#004AFF",
      score:        "#004AFF",
      playersName:  "#004AFF",
      ball:         "#004AFF",
      midLine:      "#fff" },
];