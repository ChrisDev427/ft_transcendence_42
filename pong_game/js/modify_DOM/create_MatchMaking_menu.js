function create_MatchMaking_menu() {

    // Création de l'élément div container
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.className = 'container bg-info bg-opacity-50 py-3 mt-3  w-auto rounded-4 shadow-lg';

    // Table part
    let rowDiv = document.createElement('div');
    rowDiv.classList = 'row d-flex justify-content-center';
    rowDiv.id = 'rowDiv';
    containerDiv.appendChild(rowDiv);
    
    let table = document.createElement('table');
    table.classList = 'table table-sm table-hover mt-4 mb-3 text-center w-75 shadow';
    table.id = 'table';
    rowDiv.appendChild(table);

    let thead = document.createElement('thead');
    thead.classList = 'table-secondary';
    table.appendChild(thead);

    let tr = document.createElement('tr');
    thead.appendChild(tr);

    // Set the 4 'th' inside 'tr'
    for(let i = 0; i < 4; i++) {
        
        let titles = ["#", "Player 1", "Player 2", "Score"];
        let th = document.createElement('th');
        th.classList = 'text-info';
        th.textContent = titles[i];
        tr.appendChild(th);
    }

    // Set the 'tbody'
    let tbody = document.createElement('tbody');
    table.appendChild(tbody);

    let lineNumber = 0;
    // find pairs of players still IN tournament
    for(let i = 0; i < tournamentPlayers.length; i++) {
        let players = [];
        if(tournamentPlayers[i].in === true && tournamentPlayers[i].played === false) {
            lineNumber++;
            players.push(lineNumber);
            players.push(tournamentPlayers[i].name);
            i++;
            while(tournamentPlayers[i].in === false && i < tournamentPlayers.length) {
                i++;
            }
            players.push(tournamentPlayers[i].name);
            players.push("not played yet");

            tr = document.createElement('tr');
            tbody.appendChild(tr);
            // Set the 4 cols - first[matchNumber] - second[player 1 name] - third[player 2 name] - forth[score init with '-']
            for(let j = 0; j < 4; j++) {

                let td = document.createElement('td');
                
                if(j === 0) {
                    td.classList = 'text-info table-secondary border-end';
                }
                if( j === 1 || j === 2) {
                    td.classList = 'text-secondary fw-bold border-end';
                }
                if(j === 3) {
                    td.classList = 'text-secondary fw-lighter fst-italic border-end';
                    td.id = 'scoreLine' + lineNumber;
                }
                td.textContent = players[j];
                tr.appendChild(td);
            }
        }
    }
    
    // Création de l'élément div pour le bouton Start Tournament
    let buttonDiv = document.createElement('div');
    buttonDiv.className = 'd-flex justify-content-center';
    buttonDiv.id = 'buttonDiv';
    buttonDiv.style.height = '80px';
    // Creation du bouton
    let startTournamentButton = document.createElement('button');
    startTournamentButton.type = 'button';
    startTournamentButton.className = 'btn btn-sm btn-success shadow p-3 my-2';
    startTournamentButton.id = 'startTournamentButton';
    startTournamentButton.textContent = 'Start';
    buttonDiv.appendChild(startTournamentButton);
    containerDiv.appendChild(buttonDiv);

    // Récupération de la section par son ID
    let mySection = document.getElementById('play-pong');
    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);

    init_StartTournament_button();
}

function init_StartTournament_button() {
    const startTournamentButton = document.getElementById("startTournamentButton");
    startTournamentButton.addEventListener("click", function() {
        
        startTournamentButton.remove();
        // startTournament = true;
        // tourNumber++;
        create_PlayMatch_button();
    });
}

function create_PlayMatch_button() {

    matchNumber++;
    // Creation du bouton
    let buttonDiv = document.getElementById('buttonDiv');
    let playMatchButton = document.createElement('button');
    playMatchButton.type = 'button';
    playMatchButton.className = 'btn btn-sm btn-success shadow p-3 my-2';
    playMatchButton.id = 'playMatchButton';
    playMatchButton.textContent = 'Play Match';
    buttonDiv.appendChild(playMatchButton);

    // Modif de la ligne score
    let scoreValue = document.getElementById('scoreLine' + matchNumber);
    scoreValue.classList.add('text-info')
    scoreValue.classList.remove('text-secondary','fw-lighter', 'fst-italic')
    scoreValue.textContent = 'waiting to play';
    init_PlayMatch_button();
}

function init_PlayMatch_button() {
    let playMatchButton = document.getElementById("playMatchButton");
    playMatchButton.addEventListener("click", function() {
        
        let scoreValue = document.getElementById('scoreLine' + matchNumber);
        scoreValue.textContent = 'playing';
        playMatchButton.remove();
        
        
        start = true;
    printTournamentLogs();
        
        matchMaking_selectPlayersToPrint();
        setHandToStart();
        run();
    

    });
}



function create_NextTour_button() {

    // matchNumber++;
    // Creation du bouton
    let buttonDiv = document.getElementById('buttonDiv');
    let nextTourButton = document.createElement('button');
    nextTourButton.type = 'button';
    nextTourButton.className = 'btn btn-sm btn-success shadow p-3 my-2';
    nextTourButton.id = 'nextTourButton';
    nextTourButton.textContent = 'Next Tour';
    buttonDiv.appendChild(nextTourButton);
   
    init_NextTour_button();
}

function init_NextTour_button() {
    let nextTourButton = document.getElementById("nextTourButton");
    nextTourButton.addEventListener("click", function() {
        let deleteMenu = document.getElementById('menu');
        deleteMenu.remove();
        // nextTourButton.remove();
        create_MatchMaking_menu();
        
        
    });
}

function storeMatchInfo() {
    for(let i = 0; i != tournamentPlayers.length; i++) {
        if(tournamentPlayers[i].name === tournament_PlayerName_left) {
            if(leftPlayerScore === 10) {
                tournamentPlayers[i].victories++;
                tournamentPlayers[i].played = true;
            } else {
                tournamentPlayers[i].in = false;
                tournamentPlayers[i].played = true;
            }
        }
        if(tournamentPlayers[i].name === tournament_PlayerName_right) {
            if(rightPlayerScore === 10) {
                tournamentPlayers[i].victories++;
                tournamentPlayers[i].played = true;
            } else {
                tournamentPlayers[i].in = false;
                tournamentPlayers[i].played = true;
            }
        }
    }
}

function endOfTournament() {

    let table = document.getElementById('table');
    table.remove();
    let buttonDiv = document.getElementById('buttonDiv');
    buttonDiv.remove();

    let menuDiv = document.getElementById('menu');
    menuDiv.classList.remove('bg-info', 'bg-opacity-50');
    menuDiv.classList.add('bg-secondary' , 'bg-opacity-10');

    let colDiv = document.createElement('div');
    colDiv.id = 'colDiv';
    colDiv.classList = 'col d-flex justify-content-center p-2 p-md-5';

    let textDiv = document.createElement('h2');
    textDiv.id = 'textDiv';
    textDiv.classList = 'display-3 text-center';
    textDiv.style.fontFamily = 'Bagel Fat One';
    textDiv.style.color = themeColor[theme].winPrint;
    textDiv.style.textShadow = '5px 5px 10px rgba(62, 62, 62, 0.3)';
    textDiv.textContent = 'The Winner is ' + tournamentWinnerName;

    colDiv.appendChild(textDiv);

    let getElement = document.getElementById('rowDiv');
    getElement.appendChild(colDiv);

}

function ManageTournament() {

    // Modif de la ligne score
    let scoreValue = document.getElementById('scoreLine' + matchNumber);
    scoreValue.classList.add('text-info')
    scoreValue.classList.remove('text-secondary','fw-lighter', 'fst-italic')
    scoreValue.textContent = leftPlayerScore + ' - ' + rightPlayerScore;
    storeMatchInfo();
    // printTournamentLogs();

    leftPlayerScore = 0;
    rightPlayerScore = 0;
    if(checkEndOfTournament()) {
        //fin du tournois
        endOfTournament();
        return;
    }
    if(!checkTour()) {
        // match suivant
        create_PlayMatch_button();
    }
    else {
        // tour suivant
        matchNumber = 0;
        for(let i = 0; i < tournamentPlayers.length; i++) {
            if (tournamentPlayers[i].in === true ) {
                tournamentPlayers[i].played = false;
            }
        }
        printTournamentLogs();
        create_NextTour_button();
    }
}

function checkEndOfTournament() {
    let nbPlayersIn = 0;
    for(let i = 0; i < tournamentPlayers.length; i++) {
        if (tournamentPlayers[i].in === true) {
            tournamentWinnerName = tournamentPlayers[i].name;
            nbPlayersIn++;
        }
    }
    if(nbPlayersIn === 1) {
        return true;
    }
    return false;
}

function checkTour() {
    for(let i = 0; i < tournamentPlayers.length; i++) {
        if (tournamentPlayers[i].played === false) {
            return false;
        }
    }
    return true;
}