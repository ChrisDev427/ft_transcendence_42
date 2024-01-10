function create_Tournament_menu() {
    
    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.className = 'container rounded shadow bg-secondary bg-opacity-10 mt-3 py-3';

    // Text part
    let row_1Div = document.createElement('div');
    row_1Div.className = 'row';

    let textDiv = document.createElement('div');
    textDiv.className = 'col d-flex justify-content-center';

    let pDiv = document.createElement('p');
    pDiv.classList = 'lead-sm fw-light text-secondary';
    pDiv.textContent = "Number of players";

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
    let fourPlayersButton = document.createElement('button');
    fourPlayersButton.type = 'button';
    fourPlayersButton.className = 'btn btn-outline-info mx-1';
    fourPlayersButton.id = 'fourPlayersButton';
    fourPlayersButton.setAttribute('data-bs-toggle', 'button');
    fourPlayersButton.setAttribute('autocomplete', 'off');
    fourPlayersButton.textContent = '4';
    
    let heightPlayersButton = document.createElement('button');
    heightPlayersButton.type = 'button';
    heightPlayersButton.className = 'btn btn-outline-info mx-1';
    heightPlayersButton.id = 'heightPlayersButton';
    heightPlayersButton.setAttribute('data-bs-toggle', 'button');
    heightPlayersButton.setAttribute('aria-pressed', 'true');
    heightPlayersButton.textContent = '8';

    let twelvePlayersButton = document.createElement('button');
    twelvePlayersButton.type = 'button';
    twelvePlayersButton.className = 'btn btn-outline-info mx-1';
    twelvePlayersButton.id = 'twelvePlayersButton';
    twelvePlayersButton.setAttribute('data-bs-toggle', 'button');
    twelvePlayersButton.setAttribute('aria-pressed', 'true');
    twelvePlayersButton.textContent = '12';

    let sixteenPlayersButton = document.createElement('button');
    sixteenPlayersButton.type = 'button';
    sixteenPlayersButton.className = 'btn btn-outline-info mx-1';
    sixteenPlayersButton.id = 'sixteenPlayersButton';
    sixteenPlayersButton.setAttribute('data-bs-toggle', 'button');
    sixteenPlayersButton.setAttribute('aria-pressed', 'true');
    sixteenPlayersButton.textContent = '16';

    let twentyPlayersButton = document.createElement('button');
    twentyPlayersButton.type = 'button';
    twentyPlayersButton.className = 'btn btn-outline-info mx-1';
    twentyPlayersButton.id = 'twentyPlayersButton';
    twentyPlayersButton.setAttribute('data-bs-toggle', 'button');
    twentyPlayersButton.setAttribute('aria-pressed', 'true');
    twentyPlayersButton.textContent = '20';
    
    
    
    let validButton = document.createElement('button');
    validButton.type = 'button';
    validButton.className = 'btn btn-outline-info disabled mx-1';
    validButton.id = 'validButton';
    validButton.setAttribute('data-bs-toggle', 'button');
    validButton.setAttribute('aria-pressed', 'true');
    validButton.textContent = '>';
    
    // Ajout des boutons à l'élément div des boutons
    buttonsDiv.appendChild(fourPlayersButton);
    buttonsDiv.appendChild(heightPlayersButton);
    buttonsDiv.appendChild(twelvePlayersButton);
    buttonsDiv.appendChild(sixteenPlayersButton);
    buttonsDiv.appendChild(twentyPlayersButton);
    
    buttonsDiv.appendChild(validButton);
    
    // Ajout de l'élément div des boutons à l'élément div principal
    rowDiv.appendChild(buttonsDiv);
    containerDiv.appendChild(rowDiv);
    // Récupération de la section par son ID
    let mySection = document.getElementById('play-pong');

    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);
    init_Tournament_buttons();
    
}

function init_Tournament_buttons() {

    const fourPlayersButton = document.getElementById("fourPlayersButton");
    const heightPlayersButton = document.getElementById("heightPlayersButton");
    const twelvePlayersButton = document.getElementById("twelvePlayersButton");
    const sixteenPlayersButton = document.getElementById("sixteenPlayersButton");
    const twentyPlayersButton = document.getElementById("twentyPlayersButton");
    const validButton = document.getElementById("validButton");
    
    fourPlayersButton.addEventListener("click", function() {
        fourPlayersButton.classList.add("active");
        heightPlayersButton.classList.remove("active");
        twelvePlayersButton.classList.remove("active");
        sixteenPlayersButton.classList.remove("active");
        twentyPlayersButton.classList.remove("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")

        tournamentSise = 4;
          
        
    });

    heightPlayersButton.addEventListener("click", function() {
        fourPlayersButton.classList.remove("active");
        heightPlayersButton.classList.add("active");
        twelvePlayersButton.classList.remove("active");
        sixteenPlayersButton.classList.remove("active");
        twentyPlayersButton.classList.remove("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")

        tournamentSise = 8;
        
      
    });
    twelvePlayersButton.addEventListener("click", function() {
        fourPlayersButton.classList.remove("active");
        heightPlayersButton.classList.remove("active");
        twelvePlayersButton.classList.add("active");
        sixteenPlayersButton.classList.remove("active");
        twentyPlayersButton.classList.remove("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")

        tournamentSise = 12;
        
        
    });
    sixteenPlayersButton.addEventListener("click", function() {
        fourPlayersButton.classList.remove("active");
        heightPlayersButton.classList.remove("active");
        twelvePlayersButton.classList.remove("active");
        sixteenPlayersButton.classList.add("active");
        twentyPlayersButton.classList.remove("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")

        tournamentSise = 16;
        
        
    });
    twentyPlayersButton.addEventListener("click", function() {
        fourPlayersButton.classList.remove("active");
        heightPlayersButton.classList.remove("active");
        twelvePlayersButton.classList.remove("active");
        sixteenPlayersButton.classList.remove("active");
        twentyPlayersButton.classList.add("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")

        tournamentSise = 20;
        
        
    });

    

    validButton.addEventListener("click", function() {

        removeContent();
        create_Tournament_setPlayers_menu();
        // printTournamentLogs();
       
        
    });
}