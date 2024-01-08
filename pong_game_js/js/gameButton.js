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
// *****************************************************************************

// START -BUTTON- ********************************************************
function init_Start_button() {
    const validButton = document.getElementById("validButton");
    validButton.addEventListener("click", function() {
        
        // removeMenu();
        start = true;
        // Set Players Names
        setPlayerNameToPrint();
        setHandToStart();
        printConsoleInfos();
       
        run();
    });
}
// *****************************************************************************

// DIFICULTY -BUTTONS- *********************************************************
function init_Dificulty_buttons() {

    const easyButton = document.getElementById("easyButton");
    const mediumButton = document.getElementById("mediumButton");
    const hardButton = document.getElementById("hardButton");
    const validButton = document.getElementById("validButton");
    
    easyButton.addEventListener("click", function() {
        easyButton.classList.add("active");
        mediumButton.classList.remove("active");
        hardButton.classList.remove("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")
        level = 3;
        paddleHeight = 110;
    });
    
    mediumButton.addEventListener("click", function() {
        easyButton.classList.remove("active");
        mediumButton.classList.add("active");
        hardButton.classList.remove("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")
        level = 5;
        paddleHeight = 70;
    });
    
    hardButton.addEventListener("click", function() {
        easyButton.classList.remove("active");
        mediumButton.classList.remove("active");
        hardButton.classList.add("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")
        level = 7;
        paddleHeight = 50;
    });

    validButton.addEventListener("click", function() {
        removeMenu();
        create_PlayMode_menu()
        
    });
}
// *****************************************************************************

// ONE-PLAYER, TWO-PLAYERS, TOURNAMENT -BUTTONS- *******************************
function init_PlayMode_buttons() {

    const onePlayerButton = document.getElementById("onePlayerButton");
    const twoPlayersButton = document.getElementById("twoPlayersButton");
    const tournamentButton = document.getElementById("tournamentButton");
    const validButton = document.getElementById("validButton");
    
    onePlayerButton.addEventListener("click", function() {
        onePlayerButton.classList.add("active");
        twoPlayersButton.classList.remove("active");
        tournamentButton.classList.remove("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")
        level = 3;
        paddleHeight = 110 - (level * 8);
        onePlayer = true;
        twoPlayer = false;
        tournament = false;
    });

    twoPlayersButton.addEventListener("click", function() {
        onePlayerButton.classList.remove("active");
        twoPlayersButton.classList.add("active");
        tournamentButton.classList.remove("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")
        level = 5;
        paddleHeight = 70;
        onePlayer = false;
        twoPlayer = true;
        tournament = false;
    });

    tournamentButton.addEventListener("click", function() {
        onePlayerButton.classList.remove("active");
        twoPlayersButton.classList.remove("active");
        tournamentButton.classList.add("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")
        level = 7;
        paddleHeight = 50;
        onePlayer = false;
        twoPlayer = false;
        tournament = true;
    });

    validButton.addEventListener("click", function() {
        removeMenu();
        if(onePlayer) {
            create_OnePlayer_menu();
        }
        if(twoPlayer) {
            create_TwoPlayers_menu();
        }
        
    });
}
// *****************************************************************************

// ONE-PLAYER -BUTTON- ********************************************************
function init_OnePlayer_buttons() {
    const validButton = document.getElementById("validButton");
    validButton.addEventListener("click", function() {
        
        const playerName = document.getElementById("name");
        leftPlayerName = "cpu";
        rightPlayerName = playerName.value;
        console.log(rightPlayerName);
        console.log(leftPlayerName);
        removeMenu();
        create_StartButton();
    });
}
// *****************************************************************************

// TWO-PLAYERS -BUTTON- ********************************************************
function init_TwoPlayers_buttons() {
    const validButton = document.getElementById("validButton");
    validButton.addEventListener("click", function() {
        
        const player_1_Name = document.getElementById("namePlayer_1");
        const player_2_Name = document.getElementById("namePlayer_2");
        leftPlayerName = player_1_Name.value;
        rightPlayerName = player_2_Name.value;
        console.log(rightPlayerName);
        console.log(leftPlayerName);
        removeMenu();
        create_StartButton();
    });
}
// *****************************************************************************
