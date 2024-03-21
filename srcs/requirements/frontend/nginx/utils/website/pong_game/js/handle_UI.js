const btn = {
    easyBtn: document.getElementById("easyBtn"),
    mediumBtn: document.getElementById("mediumBtn"),
    hardBtn: document.getElementById("hardBtn"),

    localBtn: document.getElementById("localBtn"),
    onLineBtn: document.getElementById("onLineBtn"),

    createBtn: document.getElementById("createBtn"),
    joinBtn: document.getElementById("joinBtn"),

    onePlayerBtn: document.getElementById("onePlayerBtn"),
    twoPlayersBtn: document.getElementById("twoPlayersBtn"),
    tournamentBtn: document.getElementById("tournamentBtn"),

    createRoomBtn: document.getElementById("createRoomBtn"),
};

//************************************************************************************

btn.createBtn.addEventListener("click", function() {

    btn.createBtn.classList.add("disabled");
    btn.createBtn.classList.remove("btn-outline-info");
    btn.createBtn.classList.add("btn-info");
    btn.joinBtn.classList.add("disabled");

    document.getElementById('createRoomMenu').classList.remove('hidden-element');
    document.getElementById('dificultyMenu').classList.remove('hidden-element');

});

btn.joinBtn.addEventListener("click", function() {

    btn.joinBtn.classList.add("disabled");
    btn.joinBtn.classList.remove("btn-outline-info");
    btn.joinBtn.classList.add("btn-info");
    btn.createBtn.classList.add("disabled");

    console.log("session user join ", sessionUsername);

    // document.getElementById('sessions').classList.remove('hidden-element')
    showSection('sessions');
});


//************************************************************************************

btn.localBtn.addEventListener("click", function() {

    btn.localBtn.classList.add("disabled");
    btn.localBtn.classList.remove("btn-outline-info");
    btn.localBtn.classList.add("btn-info");
    btn.onLineBtn.classList.add("disabled");

    document.getElementById('dificultyMenu').classList.remove('hidden-element');
    document.getElementById('gameModeMenu').classList.remove('hidden-element');

    playLocal = true;
    playOnline = false;
});
btn.onLineBtn.addEventListener("click", function() {

    btn.localBtn.classList.add("disabled");

    btn.onLineBtn.classList.add("disabled");
    btn.onLineBtn.classList.remove("btn-outline-info");
    btn.onLineBtn.classList.add("btn-info");

    document.getElementById('onlineMenu').classList.remove('hidden-element');

    playLocal = false;
    playOnline = true;
});

//************************************************************************************

btn.easyBtn.addEventListener("click", function() {
    btn.easyBtn.classList.add("disabled");
    btn.easyBtn.classList.remove("btn-outline-info");
    btn.easyBtn.classList.add("btn-info");
    btn.mediumBtn.classList.add("disabled");
    btn.hardBtn.classList.add("disabled");

    if (playLocal) {
        btn.onePlayerBtn.classList.remove("disabled");
        btn.twoPlayersBtn.classList.remove("disabled");
        btn.tournamentBtn.classList.remove("disabled");
    }
    if (playOnline) {
        btn.createRoomBtn.classList.remove('disabled')
    }
    // btn.onLineBtn.classList.remove("disabled");
    // btn.localBtn.classList.remove("disabled");

    level = 3;
    paddleHeight = 110;
});

btn.mediumBtn.addEventListener("click", function() {

    btn.easyBtn.classList.add("disabled");
    btn.mediumBtn.classList.add("disabled");
    btn.mediumBtn.classList.remove("btn-outline-info");
    btn.mediumBtn.classList.add("btn-info");
    btn.hardBtn.classList.add("disabled");

    if (playLocal) {
        btn.onePlayerBtn.classList.remove("disabled");
        btn.twoPlayersBtn.classList.remove("disabled");
        btn.tournamentBtn.classList.remove("disabled");
    }
    if (playOnline) {
        btn.createRoomBtn.classList.remove('disabled')
    }
    // btn.onLineBtn.classList.remove("disabled");
    // btn.localBtn.classList.remove("disabled");

    level = 5;
    paddleHeight = 80;
});

btn.hardBtn.addEventListener("click", function() {

    btn.easyBtn.classList.add("disabled");
    btn.mediumBtn.classList.add("disabled");
    btn.hardBtn.classList.add("disabled");
    btn.hardBtn.classList.remove("btn-outline-info");
    btn.hardBtn.classList.add("btn-info");

    if (playLocal) {
        btn.onePlayerBtn.classList.remove("disabled");
        btn.twoPlayersBtn.classList.remove("disabled");
        btn.tournamentBtn.classList.remove("disabled");
    }
    if (playOnline) {
        btn.createRoomBtn.classList.remove('disabled')
    }
    // btn.onLineBtn.classList.remove("disabled");
    // btn.localBtn.classList.remove("disabled");

    level = 7;
    paddleHeight = 60;
});



//************************************************************************************

btn.onePlayerBtn.addEventListener("click", function() {

    btn.onePlayerBtn.classList.add("disabled");
    btn.onePlayerBtn.classList.remove("btn-outline-info");
    btn.onePlayerBtn.classList.add("btn-info");
    btn.twoPlayersBtn.classList.add("disabled");
    btn.tournamentBtn.classList.add("disabled");

    onePlayer = true;
    create_OnePlayer_input();
});

btn.twoPlayersBtn.addEventListener("click", function() {

    btn.onePlayerBtn.classList.add("disabled");
    btn.twoPlayersBtn.classList.add("disabled");
    btn.twoPlayersBtn.classList.remove("btn-outline-info");
    btn.twoPlayersBtn.classList.add("btn-info");
    btn.tournamentBtn.classList.add("disabled");

    twoPlayers = true;

    if (playLocal) {
        create_TwoPlayers_input();
    }
    if(playOnline) {

        const message = JSON.stringify({
            messageType: 'createSession',
            level: level,
            // paddleHeight: paddleHeight,

            // id: 123,
            // username: sessionUsername,
        });
        console.log("session user create ", sessionUsername);
        // socket.send(message);

    }
});

btn.tournamentBtn.addEventListener("click", function() {

    btn.onePlayerBtn.classList.add("disabled");
    btn.twoPlayersBtn.classList.add("disabled");
    btn.tournamentBtn.classList.add("disabled");
    btn.tournamentBtn.classList.remove("btn-outline-info");
    btn.tournamentBtn.classList.add("btn-info");

    tournament = true;
    create_Tournament_mode();
});

btn.createRoomBtn.addEventListener("click", function() {

    create_room();

});



function initPlayBtn() {
    const playBtn = document.getElementById("playBtn");
    playBtn.addEventListener("click", function() {


        if(onePlayer) {

            const playerName = document.getElementById("name");
            if(playerName.value === "") {
                alert_message('Player name missing !');
                return;
            }
            leftPlayerName = "cpu";
            rightPlayerName = playerName.value;
        }

        else if(twoPlayers) {
            const playerName_1 = document.getElementById("playerName_1");
            const playerName_2 = document.getElementById("playerName_2");

            if(emptyInput(playerName_1) || emptyInput(playerName_2)) {
                return;
            }
            if(playerName_1.value === playerName_2.value) {
                alert_message('Two players cannot have the same name !');
                return;
            }
            leftPlayerName = playerName_1.value;
            rightPlayerName = playerName_2.value;

        }

        else if(tournament) {
            console.log('tournament condition');
            for(let i = 0; i < tournamentSize; i++) {

                const playerNameInput = document.getElementById("playerName" + (i+1));

                if(emptyInput(playerNameInput)) {
                    return;
                }
                if(checkDblName(playerNameInput)) {
                    return;
                }
                const playerName = shorteredName(playerNameInput);
                tournamentPlayers.push({...playerObj, name: playerName});
            }
            matchMakingLogs();
            hideCurrentSection();
            showSection('playPong');
            create_MatchMaking_menu();
            reset_UI();
            removeInput();
            return;
        }
        start = true;
        // Set Players Names
        setPlayerNameToPrint(leftPlayerName, rightPlayerName);
        setHandToStart();
        printConsoleInfos();
        hideCurrentSection();
        showSection('playPong');
        document.getElementById('gameDiv').classList.remove('hidden-element');
        reset_UI();
        removeInput();
        locaRun();

    });
}

function reset_UI() {

    for (let key in btn) {
        if (['localBtn', 'onLineBtn', 'easyBtn', 'mediumBtn', 'hardBtn', 'createBtn', 'joinBtn'].includes(key)) {
            // Pour les cas spécifiques
            if (btn[key].classList.contains('disabled')) {
                btn[key].classList.remove('disabled');
            }
        } else {
            // Pour le cas par défaut
            if (!btn[key].classList.contains('disabled')) {
                btn[key].classList.add('disabled');
            }
        }
        // Commun à tous les cas
        if (btn[key].classList.contains('btn-info')) {
            btn[key].classList.remove('btn-info');
            btn[key].classList.add('btn-outline-info');
        }
    }
    document.getElementById('dificultyMenu').classList.add('hidden-element');
    document.getElementById('gameModeMenu').classList.add('hidden-element');
    document.getElementById('onlineMenu').classList.add('hidden-element');
}

function removeInput() {
    const deleteInput = document.getElementById('inputDiv');
    if(deleteInput)
        deleteInput.remove();
    const deleteTournamentBtn = document.getElementById('tournamentModeBtn');
    if(deleteTournamentBtn)
        deleteTournamentBtn.remove();

}

// close btn
const closeBtnUI = document.getElementById('clBtnUI');
closeBtnUI.addEventListener('click', function() {
    reset_UI();
    removeInput();
    resetGameValues();
    showSection('main');
});

// close reset
const resetBtnUI = document.getElementById('resetBtnUI');
resetBtnUI.addEventListener('click', function() {
    reset_UI();
    removeInput();
    resetGameValues();
});

const quitButton = document.getElementById("quitGameBtn");
quitGameBtn.addEventListener("click", function() {

    resetGameValues();
    showSection('main');

    const message = JSON.stringify({ messageType: 'quitSession' });
    socket.send(message);
});