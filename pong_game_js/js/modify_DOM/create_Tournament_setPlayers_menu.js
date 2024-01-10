function create_Tournament_setPlayers_menu() {

    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.className = 'container rounded shadow bg-secondary bg-opacity-10 mt-3 py-3';
    
    // Text part
    let textDiv = document.createElement('p');
    textDiv.classList = 'lead-sm fw-light text-secondary d-flex justify-content-center';
    textDiv.textContent = "Player names";
    
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

function alert_playerMissing() {

    let div = document.createElement('div');
    div.classList = 'w-50 alert alert-danger alert-dismissible mt-3 mb-1 fade show text-center text-danger mx-auto';
    div.role = 'alert';
    div.id = 'alert';
    div.textContent = 'Player(s) missing';

    let button = document.createElement('button');
    button.classList = 'btn-close';
    button.id = 'alertButton';
    button.setAttribute('data-bs-dismiss', 'alert');
    button.setAttribute('aria-label', 'Close');
    div.appendChild(button);
    // Delete validButton
    let toDel = document.getElementById('buttonDiv');
    toDel.remove();
    // To replace with
    let row = document.getElementById('menu');
    row.appendChild(div);

    const alertButton = document.getElementById('alertButton');
    alertButton.addEventListener("click", function() {
        let alert = document.getElementById('alert')
        alert.remove();
        let buttonDiv = document.createElement('div');
        buttonDiv.classList = 'd-flex justify-content-center mb-3';
        buttonDiv.id = 'buttonDiv';
        let button = document.createElement('button');
        button.classList = 'btn btn-sm btn-outline-success mt-3 mb-2 w-25 mx-auto';
        button.type = 'button';
        button.id = 'validButton';
        button.textContent = '>';

        buttonDiv.appendChild(button);
        let toAdd = document.getElementById('menu');
        toAdd.appendChild(buttonDiv);
        init_Tournament_setPlayers_button();

    });
}

function init_Tournament_setPlayers_button() {

    const validButton = document.getElementById("validButton");
    validButton.addEventListener("click", function() {
        
        for(let i = 0; i < tournamentSise; i++) {
            const name = document.getElementById("player" + (i+1));
            if(name.value === "") {
                alert_playerMissing();
                return;
            } else {

                tournamentPlayersName[i] = name.value;
            }
            
        }
        
        printTournamentLogs();
        removeContent();
        create_Start_menu();
    });
}