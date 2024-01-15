function create_local_online_menu() {
    
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
    pDiv.textContent = "Play local or online";

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
    
    let localButton = document.createElement('button');
    localButton.type = 'button';
    localButton.className = 'btn btn-outline-info mx-2';
    localButton.id = 'localButton';
    localButton.setAttribute('data-bs-toggle', 'button');
    localButton.setAttribute('aria-pressed', 'true');
    localButton.textContent = 'Local';
    
    let onLineButton = document.createElement('button');
    onLineButton.type = 'button';
    onLineButton.className = 'btn btn-outline-info';
    onLineButton.id = 'onLineButton';
    onLineButton.setAttribute('data-bs-toggle', 'button');
    onLineButton.setAttribute('autocomplete', 'off');
    onLineButton.textContent = 'Online';
    
    let validButton = document.createElement('button');
    validButton.type = 'button';
    validButton.className = 'btn btn-outline-info disabled ms-1';
    validButton.id = 'validButton';
    validButton.setAttribute('data-bs-toggle', 'button');
    validButton.setAttribute('aria-pressed', 'true');
    validButton.textContent = '>';
    
    // Ajout des boutons à l'élément div des boutons
    buttonsDiv.appendChild(localButton);
    buttonsDiv.appendChild(onLineButton);
    buttonsDiv.appendChild(validButton);
    
    // Ajout de l'élément div des boutons à l'élément div principal
    rowDiv.appendChild(buttonsDiv);
    containerDiv.appendChild(rowDiv);
    // Récupération de la section par son ID
    let mySection = document.getElementById('play-pong');

    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);

    init_local_online_buttons();
    
}

function init_local_online_buttons() {

    const localButton = document.getElementById("localButton");
    const onLineButton = document.getElementById("onLineButton");
    const validButton = document.getElementById("validButton");
    
    localButton.addEventListener("click", function() {
        
        onLineButton.classList.remove("active");
        localButton.classList.add("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info");
        playLocal = true;
        playOnline = false;
    });
    onLineButton.addEventListener("click", function() {
        onLineButton.classList.add("active");
        localButton.classList.remove("active");
        validButton.classList.remove("disabled", "btn-outline-info");
        validButton.classList.add("btn-info");
        playLocal = false;
        playOnline = true;
    });

    validButton.addEventListener("click", function() {
        removeContent();
        create_PlayMode_menu();
    });
}