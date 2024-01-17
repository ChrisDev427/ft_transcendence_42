function create_Start_menu() {

    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.className = 'container rounded-4 shadow bg-secondary bg-opacity-10 mt-3 py-3';

    let rowDiv = document.createElement('div');
    rowDiv.className = 'row mb-3 mt-2';

    // Création de l'élément div pour le bouton valid
    let buttonDiv = document.createElement('div');
    buttonDiv.className = 'col-12 d-flex justify-content-center';
    // Creation du bouton
    let validButton = document.createElement('button');
    validButton.type = 'button';
    validButton.className = 'btn btn-sm btn-success shadow mt-2 w-25 py-4';
    validButton.id = 'validButton';
    // validButton.setAttribute('data-bs-toggle', 'button');
    // validButton.setAttribute('aria-pressed', 'true');
    validButton.textContent = 'Start';

    // Ajout du bouton a buttonDiv
    buttonDiv.appendChild(validButton);
    // Ajout de buttonDiv dans rowDiv
    rowDiv.appendChild(buttonDiv);
    // Ajout de rowDiv dans containerDiv
    containerDiv.appendChild(rowDiv);
    // Récupération de la section par son ID
    let mySection = document.getElementById('playPong');
    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);

    init_Start_button();

}

function init_Start_button() {
    const validButton = document.getElementById("validButton");
    validButton.addEventListener("click", function() {
        
        removeContent();
        start = true;
        // Set Players Names
        setPlayerNameToPrint(leftPlayerName, rightPlayerName);
        setHandToStart();
        printConsoleInfos();
       
        run();
    });
}