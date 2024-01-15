//****** DIFICUTLTY MENU CREATE *****************************************************************************************/

function create_Dificulty_menu () {

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
    pDiv.textContent = "Choose dificulty";

    textDiv.appendChild(pDiv);
    row_1Div.appendChild(textDiv);
    containerDiv.appendChild(row_1Div);



    // Buttons part
    let row_2Div = document.createElement('div');
    row_2Div.className = 'row mb-3';
    
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
    row_2Div.appendChild(buttonsDiv);
    containerDiv.appendChild(row_2Div);
    // Récupération de la section par son ID
    let mySection = document.getElementById('play-pong');

    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);
    init_Dificulty_buttons();
}

// DIFICULTY -BUTTONS- *********************************************************
function init_Dificulty_buttons() {

    const easyButton = document.getElementById("easyButton");
    const mediumButton = document.getElementById("mediumButton");
    const hardButton = document.getElementById("hardButton");
    const validButton = document.getElementById("validButton");
    
    easyButton.addEventListener("click", function() {
        easyButton.classList.add("active");
        mediumButton.classList.remove("active");
        hardButton.classList.remove("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")
        level = 3;
        paddleHeight = 110;
    });
    
    mediumButton.addEventListener("click", function() {
        
        easyButton.classList.remove("active");
        mediumButton.classList.add("active");
        hardButton.classList.remove("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")
        level = 5;
        paddleHeight = 70;
    });
    
    hardButton.addEventListener("click", function() {

        easyButton.classList.remove("active");
        mediumButton.classList.remove("active");
        hardButton.classList.add("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info")
        level = 7;
        paddleHeight = 50;
    });

    validButton.addEventListener("click", function() {
        removeContent();
        create_local_online_menu();
        
    });
}