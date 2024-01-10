//****** TWO PLAYERS MENU *****************************************************************************************/
function create_TwoPlayers_menu() {

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
    pDiv.textContent = "Players names";

    textDiv.appendChild(pDiv);
    row_1Div.appendChild(textDiv);
    containerDiv.appendChild(row_1Div);



    // Buttons part

    let rowDiv = document.createElement('div');
    rowDiv.className = 'row mb-3';

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

function init_TwoPlayers_buttons() {
    const validButton = document.getElementById("validButton");
    validButton.addEventListener("click", function() {
        
        const player_1_Name = document.getElementById("namePlayer_1");
        const player_2_Name = document.getElementById("namePlayer_2");
        leftPlayerName = player_1_Name.value;
        rightPlayerName = player_2_Name.value;
        console.log(rightPlayerName);
        console.log(leftPlayerName);
        removeContent();
        create_Start_menu();
    });
}