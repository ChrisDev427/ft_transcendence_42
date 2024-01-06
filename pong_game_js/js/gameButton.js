// PLAY - RESET -BUTTONS- ******************************************************
const playButton = document.getElementById("playButton");
const resetButton = document.getElementById("resetButton");

playButton.addEventListener("click", function() {
    playButton.classList.add("disabled");
    resetButton.classList.remove("disabled");
    createPlayMenu();
});
resetButton.addEventListener("click", function() {
    resetButton.classList.add("disabled");
    playButton.classList.remove("disabled");
});
// *****************************************************************************


// ONE-PLAYER, TWO-PLAYERS, TOURNAMENT -BUTTONS- *******************************
const onePlayerButton = document.getElementById("onePlayerButton");
const twoPlayersButton = document.getElementById("twoPlayersButton");
const tournamentButton = document.getElementById("tournamentButton");
const validGameButton = document.getElementById("validGameButton");

onePlayerButton.addEventListener("click", function() {
    onePlayerButton.classList.add("active");
    twoPlayersButton.classList.remove("active");
    tournamentButton.classList.remove("active");
    validGameButton.classList.remove("disabled", "btn-outline-info");
    validGameButton.classList.add("btn-info")
    level = 3;
    paddleHeight = 110 - (level * 8);
});

twoPlayersButton.addEventListener("click", function() {
    onePlayerButton.classList.remove("active");
    twoPlayersButton.classList.add("active");
    tournamentButton.classList.remove("active");
    validGameButton.classList.remove("disabled", "btn-outline-info");
    validGameButton.classList.add("btn-info")
    level = 5;
    paddleHeight = 70;
});

tournamentButton.addEventListener("click", function() {
    onePlayerButton.classList.remove("active");
    twoPlayersButton.classList.remove("active");
    tournamentButton.classList.add("active");
    validGameButton.classList.remove("disabled", "btn-outline-info");
    validGameButton.classList.add("btn-info")
    level = 7;
    paddleHeight = 50;
});
// *****************************************************************************


// DIFICULTY -BUTTONS- *********************************************************
const easyButton = document.getElementById("easyButton");
const mediumButton = document.getElementById("mediumButton");
const hardButton = document.getElementById("hardButton");
const validDificultyButton = document.getElementById("validDificultyButton");

easyButton.addEventListener("click", function() {
    easyButton.classList.add("active");
    mediumButton.classList.remove("active");
    hardButton.classList.remove("active");
    validDificultyButton.classList.remove("disabled", "btn-outline-info");
    validDificultyButton.classList.add("btn-info")
    level = 3;
    paddleHeight = 110 - (level * 8);
});

mediumButton.addEventListener("click", function() {
    easyButton.classList.remove("active");
    mediumButton.classList.add("active");
    hardButton.classList.remove("active");
    validDificultyButton.classList.remove("disabled", "btn-outline-info");
    validDificultyButton.classList.add("btn-info")
    level = 5;
    paddleHeight = 70;
});

hardButton.addEventListener("click", function() {
    easyButton.classList.remove("active");
    mediumButton.classList.remove("active");
    hardButton.classList.add("active");
    validDificultyButton.classList.remove("disabled", "btn-outline-info");
    validDificultyButton.classList.add("btn-info")
    level = 7;
    paddleHeight = 50;
});
// *****************************************************************************