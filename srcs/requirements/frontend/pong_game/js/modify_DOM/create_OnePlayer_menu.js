//****** ONE PLAYER MENU *****************************************************************************************/
function create_OnePlayer_menu() {

    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.className = 'container rounded-4 shadow bg-secondary bg-opacity-10 mt-3 py-3';

    // Text part
    let textDiv = document.createElement('p');
    textDiv.classList = 'lead-sm fw-light text-secondary d-flex justify-content-center';
    textDiv.textContent = "Player name";
    
    containerDiv.appendChild(textDiv);
    
    //--------------------------------------------------------------------------
    
    // Input part --------------------------------------------------------------
    let rowDiv = document.createElement('div');
    rowDiv.className = 'row d-flex justify-content-center mb-2';
    
    // Création de l'élément div pour l'input
    let inputDiv = document.createElement('div');
    inputDiv.className = 'col-10';
    
    // Creation de l'input
    let input = document.createElement('input');
    input.className = 'form-control border-info w-50 mt-2 mx-auto';
    input.type = 'text';
    input.id = 'name';
    input.placeholder="Name"

    inputDiv.appendChild(input);
    rowDiv.appendChild(inputDiv);
    
    //--------------------------------------------------------------------------
    
    // Création de l'élément div pour le bouton valid
    let buttonDiv = document.createElement('div');
    buttonDiv.className = 'col-12 d-flex justify-content-center mb-3';
    buttonDiv.id = 'buttonDiv';

    // Creation du bouton
    let validButton = document.createElement('button');
    validButton.type = 'button';
    validButton.className = 'btn btn-sm btn-outline-success mt-3 mb-2 w-25';
    validButton.id = 'validButton';
    validButton.setAttribute('data-bs-toggle', 'button');
    validButton.setAttribute('aria-pressed', 'true');
    validButton.textContent = '>';
    
    buttonDiv.appendChild(validButton);
    
    // Ajout de rowDiv dans containerDiv
    containerDiv.appendChild(rowDiv);
    // Ajout de buttonDiv dans containerDiv
    containerDiv.appendChild(buttonDiv);

    // Récupération de la section par son ID
    let mySection = document.getElementById('playPong');
    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);
    init_OnePlayer_buttons();
}

function init_OnePlayer_buttons() {
    const validButton = document.getElementById("validButton");
    validButton.addEventListener("click", function() {
        
        const playerName = document.getElementById("name");
        if(playerName.value === "") {
            alert_playerMissing(init_OnePlayer_buttons);
            return;
        }
        leftPlayerName = "cpu";
        rightPlayerName = playerName.value;
        console.log(rightPlayerName);
        console.log(leftPlayerName);
        removeContent();
        create_Start_menu();
    });
}

