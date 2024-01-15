function create_PlayMode_menu() {
    
    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.className = 'container rounded-4 shadow bg-secondary bg-opacity-10 mt-3 py-3';

    // Text part
    let row_1Div = document.createElement('div');
    row_1Div.className = 'row';

    let textDiv = document.createElement('div');
    textDiv.className = 'col d-flex justify-content-center';

    let pDiv = document.createElement('p');
    pDiv.classList = 'lead-sm fw-light text-secondary';
    pDiv.textContent = "Play mode";

    textDiv.appendChild(pDiv);
    row_1Div.appendChild(textDiv);
    containerDiv.appendChild(row_1Div);



    // Buttons part
    let rowDiv = document.createElement('div');
    rowDiv.className = 'row mb-3';
    
    // Création de l'élément div pour les boutons
    let buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'col-12 d-flex justify-content-center';
    
    // Création des boutons
    if(playLocal) {

        let onePlayerButton = document.createElement('button');
        onePlayerButton.type = 'button';
        onePlayerButton.className = 'btn btn-outline-info';
        onePlayerButton.id = 'onePlayerButton';
        onePlayerButton.setAttribute('data-bs-toggle', 'button');
        onePlayerButton.setAttribute('autocomplete', 'off');
        onePlayerButton.textContent = 'One Player';
        buttonsDiv.appendChild(onePlayerButton);
    }
    
    let twoPlayersButton = document.createElement('button');
    twoPlayersButton.type = 'button';
    twoPlayersButton.className = 'btn btn-outline-info mx-2';
    twoPlayersButton.id = 'twoPlayersButton';
    twoPlayersButton.setAttribute('data-bs-toggle', 'button');
    twoPlayersButton.setAttribute('aria-pressed', 'true');
    twoPlayersButton.textContent = 'Two Players';
    buttonsDiv.appendChild(twoPlayersButton);
    
    let tournamentButton = document.createElement('button');
    tournamentButton.type = 'button';
    tournamentButton.className = 'btn btn-outline-info';
    tournamentButton.id = 'tournamentButton';
    tournamentButton.setAttribute('data-bs-toggle', 'button');
    tournamentButton.setAttribute('autocomplete', 'off');
    tournamentButton.textContent = 'Tournament';
    buttonsDiv.appendChild(tournamentButton);
    
    let validButton = document.createElement('button');
    validButton.type = 'button';
    validButton.className = 'btn btn-outline-info disabled ms-1';
    validButton.id = 'validButton';
    validButton.setAttribute('data-bs-toggle', 'button');
    validButton.setAttribute('aria-pressed', 'true');
    validButton.textContent = '>';
    buttonsDiv.appendChild(validButton);
    
    
    
    // Ajout de l'élément div des boutons à l'élément div principal
    rowDiv.appendChild(buttonsDiv);
    containerDiv.appendChild(rowDiv);
    // Récupération de la section par son ID
    let mySection = document.getElementById('play-pong');

    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);
    if(playLocal) {
        init_PlayMode_local_buttons();
    } else {
        init_PlayMode_online_buttons();
    }
    
}

function init_PlayMode_local_buttons() {

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
        
        onePlayer = false;
        twoPlayer = false;
        tournament = true;
    });

    validButton.addEventListener("click", function() {
        removeContent();
        if(onePlayer) {
            create_OnePlayer_menu();
        }
        if(twoPlayer) {
            create_TwoPlayers_menu();
        }
        if(tournament) {
            create_Tournament_menu();
        }
        
    });
}

function init_PlayMode_online_buttons() {

    //******* MODE ONLINE A DEFINIR *******

    const twoPlayersButton = document.getElementById("twoPlayersButton");
    const tournamentButton = document.getElementById("tournamentButton");
    const validButton = document.getElementById("validButton");

    twoPlayersButton.addEventListener("click", function() {
      
        twoPlayersButton.classList.add("active");
        tournamentButton.classList.remove("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")
        
        onePlayer = false;
        twoPlayer = true;
        tournament = false;
    });

    tournamentButton.addEventListener("click", function() {
        
        twoPlayersButton.classList.remove("active");
        tournamentButton.classList.add("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")
        
        onePlayer = false;
        twoPlayer = false;
        tournament = true;
    });

    validButton.addEventListener("click", function() {
        removeContent();
        
        if(twoPlayer) {
            // create_TwoPlayers_menu();
        }
        if(tournament) {
            // create_Tournament_menu();
        }
        
    });
}