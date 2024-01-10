// PLAY - RESET -BUTTONS- ******************************************************
const playButton = document.getElementById("playButton");
const resetButton = document.getElementById("resetButton");

playButton.addEventListener("click", function() {
    playButton.classList.add("disabled");
    resetButton.classList.remove("disabled");
    create_Dificulty_menu();
});
resetButton.addEventListener("click", function() {
    resetButton.classList.add("disabled");
    playButton.classList.remove("disabled");
    reset();
});

function reset() {

    removeContent();
    onePlayer = false;
    twoPlayer = false;
    tournament = false;

    leftPlayerScore = 0;
    rightPlayerScore = 0;

    leftPlayerName = "";
    rightPlayerName = "";

    start = false;
    level = 0;
    leftPaddleY = (canvas.height - paddleHeight) / 2;
    rightPaddleY = (canvas.height - paddleHeight) / 2;
    
    ballX = 0;
    ballY = 0;
    printConsoleInfos();
    printGame();

}
