function create_Tournament_setPlayers_menu() {

    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.className = 'container rounded-4 shadow bg-secondary bg-opacity-10 mt-3 py-3';
    
    // Text part
    let textDiv = document.createElement('p');
    textDiv.classList = 'lead-sm fw-light text-secondary d-flex justify-content-center';
    textDiv.textContent = "Players name";
    containerDiv.appendChild(textDiv);
    
    // Input part
    let rowDiv = document.createElement('div');
    rowDiv.classList = 'row mb-2 d-flex justify-content-center';
    rowDiv.id = 'row';
   
    for(let i = 1; i <= tournamentSise; i++) {
        let colDiv = document.createElement('div');
        colDiv.classList = 'col-6 col-md-3 mb-2';
        let input = document.createElement('input');
        input.classList = 'form-control border-info';
        input.type = 'text';
        input.name = 'Player ' + i;
        input.id = 'player' + i;
        input.placeholder = 'Player ' + i;
        colDiv.appendChild(input);
        rowDiv.appendChild(colDiv);
    }

    let buttonDiv = document.createElement('div');
    buttonDiv.classList = 'd-flex justify-content-center mb-3';
    buttonDiv.id = 'buttonDiv';
    let button = document.createElement('button');
    button.classList = 'btn btn-sm btn-outline-success mt-3 mb-2 w-25 mx-auto';
    button.type = 'button';
    button.id = 'validButton';
    button.textContent = '>';
    buttonDiv.appendChild(button);
    
    containerDiv.appendChild(rowDiv);
    containerDiv.appendChild(buttonDiv);

    // Récupération de la section par son ID
    let mySection = document.getElementById('play-pong');
    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);

    init_Tournament_setPlayers_button();
}

function init_Tournament_setPlayers_button() {

    const validButton = document.getElementById("validButton");
    validButton.addEventListener("click", function() {
        
        for(let i = 0; i < tournamentSise; i++) {
            const playerNameInput = document.getElementById("player" + (i+1));
           
            if(emptyInput(playerNameInput, init_Tournament_setPlayers_button)) {
                return;
            }
            if(checkDblName(playerNameInput, init_Tournament_setPlayers_button)) {
                return;
            } 
            const playerName = shorteredName(playerNameInput);
            tournamentPlayers.push({...playerObj, name: playerName});
        }
        printTournamentLogs();
        removeContent();
        
        // Lancer une fonction de matchmaking
        create_MatchMaking_menu();
        matchMakingLogs();

      
    });
}
