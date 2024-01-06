function createPlayMenu() {
    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.className = 'container mt-3 py-3';
    let menuDiv = document.createElement('div');
    menuDiv.id = 'menu';
    menuDiv.className = 'row w-75 py-2 py-md-5 rounded shadow bg-secondary bg-opacity-10 mx-auto';
    
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
    
    let validGameButton = document.createElement('button');
    validGameButton.type = 'button';
    validGameButton.className = 'btn btn-outline-info disabled ms-1';
    validGameButton.id = 'validGameButton';
    validGameButton.setAttribute('data-bs-toggle', 'button');
    validGameButton.setAttribute('aria-pressed', 'true');
    validGameButton.textContent = '>';
    
    // Ajout des boutons à l'élément div des boutons
    buttonsDiv.appendChild(onePlayerButton);
    buttonsDiv.appendChild(twoPlayersButton);
    buttonsDiv.appendChild(tournamentButton);
    buttonsDiv.appendChild(validGameButton);
    
    // Ajout de l'élément div des boutons à l'élément div principal
    menuDiv.appendChild(buttonsDiv);
    
    // Ajout de l'élément div principal au body du document
    document.body.appendChild(menuDiv);
}