//****** ONE PLAYER MENU *****************************************************************************************/
function create_OnePlayer_menu() {

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
    pDiv.textContent = "Player name";

    textDiv.appendChild(pDiv);
    row_1Div.appendChild(textDiv);
    containerDiv.appendChild(row_1Div);



    // Buttons part

    let rowDiv = document.createElement('div');
    rowDiv.className = 'row mb-3';

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

function init_OnePlayer_buttons() {
    const validButton = document.getElementById("validButton");
    validButton.addEventListener("click", function() {
        
        const playerName = document.getElementById("name");
        leftPlayerName = "cpu";
        rightPlayerName = playerName.value;
        console.log(rightPlayerName);
        console.log(leftPlayerName);
        removeContent();
        create_Start_menu();
    });
}