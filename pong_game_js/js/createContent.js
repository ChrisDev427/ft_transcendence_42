
function reset() {

    removeMenu();
    onePlayer = false;
    twoPlayer = false;
    tournament = false;

    leftPlayerScore = 0;
    rightPlayerScore = 0;

    leftPlayerName = "";
    rightPlayerName = "";

    start = false;
    leftPaddleY = (canvas.height - paddleHeight) / 2;
    rightPaddleY = (canvas.height - paddleHeight) / 2;
    
    ballX = 0;
    ballY = 0;
    // printConsoleInfos();
    printGame();

   
    
}

function removeMenu() {

    let deleteMenu = document.getElementById('menu');
    if(deleteMenu) {
        deleteMenu.remove();
    }
}

function create_StartButton() {

    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.className = 'container mt-3 py-3';

    let rowDiv = document.createElement('div');
    rowDiv.className = 'row w-75 py-2 py-md-5 rounded shadow bg-secondary bg-opacity-10 mx-auto';

    // Création de l'élément div pour le bouton valid
    let buttonDiv = document.createElement('div');
    buttonDiv.className = 'col-12 d-flex justify-content-center';
    // Creation du bouton
    let validButton = document.createElement('button');
    validButton.type = 'button';
    validButton.className = 'btn btn-sm btn-success shadow mt-2 w-25 py-4';
    validButton.id = 'validButton';
    validButton.setAttribute('data-bs-toggle', 'button');
    validButton.setAttribute('aria-pressed', 'true');
    validButton.textContent = 'Start';

    // Ajout du bouton a buttonDiv
    buttonDiv.appendChild(validButton);
    // Ajout de buttonDiv dans rowDiv
    rowDiv.appendChild(buttonDiv);
    // Ajout de rowDiv dans containerDiv
    containerDiv.appendChild(rowDiv);
    // Récupération de la section par son ID
    let mySection = document.getElementById('play-pong');
    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);

    init_Start_button();

}

//****** PLAY MENU CREATE *****************************************************************************************/
function create_PlayMode_menu() {
    
    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.className = 'container mt-3 py-3';
    let rowDiv = document.createElement('div');
    rowDiv.className = 'row w-75 py-2 py-md-5 rounded shadow bg-secondary bg-opacity-10 mx-auto';
    
    // Création de l'élément div pour les boutons
    let buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'col-12 d-flex justify-content-center';
    
    // Création des boutons
    let onePlayerButton = document.createElement('button');
    onePlayerButton.type = 'button';
    onePlayerButton.className = 'btn btn-outline-info';
    onePlayerButton.id = 'onePlayerButton';
    onePlayerButton.setAttribute('data-bs-toggle', 'button');
    onePlayerButton.setAttribute('autocomplete', 'off');
    onePlayerButton.textContent = 'One Player';
    
    let twoPlayersButton = document.createElement('button');
    twoPlayersButton.type = 'button';
    twoPlayersButton.className = 'btn btn-outline-info mx-2';
    twoPlayersButton.id = 'twoPlayersButton';
    twoPlayersButton.setAttribute('data-bs-toggle', 'button');
    twoPlayersButton.setAttribute('aria-pressed', 'true');
    twoPlayersButton.textContent = 'Two Players';
    
    let tournamentButton = document.createElement('button');
    tournamentButton.type = 'button';
    tournamentButton.className = 'btn btn-outline-info';
    tournamentButton.id = 'tournamentButton';
    tournamentButton.setAttribute('data-bs-toggle', 'button');
    tournamentButton.setAttribute('autocomplete', 'off');
    tournamentButton.textContent = 'Tournament';
    
    let validButton = document.createElement('button');
    validButton.type = 'button';
    validButton.className = 'btn btn-outline-info disabled ms-1';
    validButton.id = 'validButton';
    validButton.setAttribute('data-bs-toggle', 'button');
    validButton.setAttribute('aria-pressed', 'true');
    validButton.textContent = '>';
    
    // Ajout des boutons à l'élément div des boutons
    buttonsDiv.appendChild(onePlayerButton);
    buttonsDiv.appendChild(twoPlayersButton);
    buttonsDiv.appendChild(tournamentButton);
    buttonsDiv.appendChild(validButton);
    
    // Ajout de l'élément div des boutons à l'élément div principal
    rowDiv.appendChild(buttonsDiv);
    containerDiv.appendChild(rowDiv);
    // Récupération de la section par son ID
    let mySection = document.getElementById('play-pong');

    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);
    init_PlayMode_buttons();
    
}

//****** DIFICUTLTY MENU CREATE *****************************************************************************************/

function create_Dificulty_menu () {

    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.className = 'container mt-3 py-3';

    let rowDiv = document.createElement('div');
    rowDiv.className = 'row w-75 py-2 py-md-5 rounded shadow bg-secondary bg-opacity-10 mx-auto';
    
    // Création de l'élément div pour les boutons
    let buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'col-12 d-flex justify-content-center';
    
    // Création des boutons
    let easyButton = document.createElement('button');
    easyButton.type = 'button';
    easyButton.className = 'btn btn-outline-info';
    easyButton.id = 'easyButton';
    easyButton.setAttribute('data-bs-toggle', 'button');
    easyButton.setAttribute('autocomplete', 'off');
    easyButton.textContent = 'Easy';
    
    let mediumButton = document.createElement('button');
    mediumButton.type = 'button';
    mediumButton.className = 'btn btn-outline-info mx-2';
    mediumButton.id = 'mediumButton';
    mediumButton.setAttribute('data-bs-toggle', 'button');
    mediumButton.setAttribute('aria-pressed', 'true');
    mediumButton.textContent = 'Medium';
    
    let hardButton = document.createElement('button');
    hardButton.type = 'button';
    hardButton.className = 'btn btn-outline-info';
    hardButton.id = 'hardButton';
    hardButton.setAttribute('data-bs-toggle', 'button');
    hardButton.setAttribute('autocomplete', 'off');
    hardButton.textContent = 'Hard';
    
    let validButton = document.createElement('button');
    validButton.type = 'button';
    validButton.className = 'btn btn-outline-info disabled ms-1';
    validButton.id = 'validButton';
    validButton.setAttribute('data-bs-toggle', 'button');
    validButton.setAttribute('aria-pressed', 'true');
    validButton.textContent = '>';
    
    // Ajout des boutons à l'élément div des boutons
    buttonsDiv.appendChild(easyButton);
    buttonsDiv.appendChild(mediumButton);
    buttonsDiv.appendChild(hardButton);
    buttonsDiv.appendChild(validButton);
    
    // Ajout de l'élément div des boutons à l'élément div principal
    rowDiv.appendChild(buttonsDiv);
    containerDiv.appendChild(rowDiv);
    // Récupération de la section par son ID
    let mySection = document.getElementById('play-pong');

    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);
    init_Dificulty_buttons();
}

//****** ONE PLAYER MENU *****************************************************************************************/
function create_OnePlayer_menu() {

    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.className = 'container mt-3 py-3';

    let rowDiv = document.createElement('div');
    rowDiv.className = 'row w-75 py-2 py-md-5 rounded shadow bg-secondary bg-opacity-10 mx-auto';

    // Création de l'élément div pour l'input
    let inputDiv = document.createElement('div');
    inputDiv.className = 'col-12 d-flex justify-content-center';
    // Creation de l'input
    let input = document.createElement('input');
    input.className = 'form-control border-info w-50 mt-2';
    input.type = 'text';
    input.id = 'name';
    input.placeholder="Name"
   
    
    
    // Création de l'élément div pour le bouton valid
    let buttonDiv = document.createElement('div');
    buttonDiv.className = 'col-12 d-flex justify-content-center';
    // Creation du bouton
    let validButton = document.createElement('button');
    validButton.type = 'button';
    validButton.className = 'btn btn-sm btn-outline-success mt-4 w-25';
    validButton.id = 'validButton';
    validButton.setAttribute('data-bs-toggle', 'button');
    validButton.setAttribute('aria-pressed', 'true');
    validButton.textContent = '>';
    
    // Ajout de input a input div
    inputDiv.appendChild(input);
    // Ajout de inputDiv dans rowDiv
    rowDiv.appendChild(inputDiv);
    // Ajout du bouton a buttonDiv
    buttonDiv.appendChild(validButton);
    // Ajout de buttonDiv dans rowDiv
    rowDiv.appendChild(buttonDiv);

    // Ajout de rowDiv dans containerDiv
    containerDiv.appendChild(rowDiv);

    // Récupération de la section par son ID
    let mySection = document.getElementById('play-pong');
    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);
    init_OnePlayer_buttons();
}

//****** TWO PLAYERS MENU *****************************************************************************************/
function create_TwoPlayers_menu() {

    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.className = 'container mt-3 py-3';

    let rowDiv = document.createElement('div');
    rowDiv.className = 'row w-75 py-2 py-md-5 rounded shadow bg-secondary bg-opacity-10 mx-auto';

    // Création de l'élément div pour l'input_1
    let input_1_Div = document.createElement('div');
    input_1_Div.className = 'col-12 d-flex justify-content-center';
    // Creation de l'input
    let input_1 = document.createElement('input');
    input_1.className = 'form-control border-info w-50 mt-2';
    input_1.type = 'text';
    input_1.id = 'namePlayer_1';
    input_1.placeholder="Player 1"

    // Création de l'élément div pour l'input_2
    let input_2_Div = document.createElement('div');
    input_2_Div.className = 'col-12 d-flex justify-content-center';
    // Creation de l'input
    let input_2 = document.createElement('input');
    input_2.className = 'form-control border-info w-50 mt-2';
    input_2.type = 'text';
    input_2.id = 'namePlayer_2';
    input_2.placeholder="Player 2"
   
    
    
    // Création de l'élément div pour le bouton valid
    let buttonDiv = document.createElement('div');
    buttonDiv.className = 'col-12 d-flex justify-content-center';
    // Creation du bouton
    let validButton = document.createElement('button');
    validButton.type = 'button';
    validButton.className = 'btn btn-sm btn-outline-success mt-4 w-25';
    validButton.id = 'validButton';
    validButton.setAttribute('data-bs-toggle', 'button');
    validButton.setAttribute('aria-pressed', 'true');
    validButton.textContent = '>';
    
    // Ajout de input_1 a input_1_div
    input_1_Div.appendChild(input_1);
    // Ajout de input_1_Div dans rowDiv
    rowDiv.appendChild(input_1_Div);
    // Ajout de input_2 a input_2_div
    input_2_Div.appendChild(input_2);
    // Ajout de input_1_Div dans rowDiv
    rowDiv.appendChild(input_2_Div);

    // Ajout du bouton a buttonDiv
    buttonDiv.appendChild(validButton);
    // Ajout de buttonDiv dans rowDiv
    rowDiv.appendChild(buttonDiv);

    // Ajout de rowDiv dans containerDiv
    containerDiv.appendChild(rowDiv);

    // Récupération de la section par son ID
    let mySection = document.getElementById('play-pong');
    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);
    init_TwoPlayers_buttons();
}