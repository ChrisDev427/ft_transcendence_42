//****** TWO PLAYERS MENU *****************************************************************************************/
function create_TwoPlayers_menu() {

    // Création de l'élément div principal
    let containerDiv = document.createElement('div');
    containerDiv.id = 'menu';
    containerDiv.classList = 'container rounded-4 shadow bg-secondary bg-opacity-10 mt-3 py-3';

    // Text part ---------------------------------------------------
    let row_1Div = document.createElement('div');
    row_1Div.classList = 'row';
    
    let textDiv = document.createElement('div');
    textDiv.classList = 'col d-flex justify-content-center';
    
    let pDiv = document.createElement('p');
    pDiv.classList = 'lead-sm fw-light text-secondary';
    pDiv.textContent = "Players name";
    
    textDiv.appendChild(pDiv);
    row_1Div.appendChild(textDiv);
    containerDiv.appendChild(row_1Div);
    //---------------------------------------------------------------
    
    
    // Inputs part --------------------------------------------------
    let rowDiv = document.createElement('div');
    rowDiv.classList = 'row d-flex justify-content-center mb-2';
    
    // input_1
    let input_1_Div = document.createElement('div');
    input_1_Div.classList = 'col-6 ';
    // Creation de l'input
    let input_1 = document.createElement('input');
    input_1.classList = 'form-control border-info w-50 mt-2 mx-auto';
    input_1.type = 'text';
    input_1.id = 'namePlayer_1';
    input_1.placeholder="Player 1"
    
    input_1_Div.appendChild(input_1);
    rowDiv.appendChild(input_1_Div);
    
    // input_2
    let input_2_Div = document.createElement('div');
    input_2_Div.classList = 'col-6 ';
    // Creation de l'input
    let input_2 = document.createElement('input');
    input_2.classList = 'form-control border-info w-50 w-md-25 mt-2 mx-auto';
    input_2.type = 'text';
    input_2.id = 'namePlayer_2';
    input_2.placeholder="Player 2"
    
    input_2_Div.appendChild(input_2);
    rowDiv.appendChild(input_2_Div);
    //---------------------------------------------------------------
    
    
    
    // Création de l'élément div pour le bouton valid
    let buttonDiv = document.createElement('div');
    buttonDiv.classList = 'col-12 d-flex justify-content-center mb-3';
    buttonDiv.id = 'buttonDiv';

    // Creation du bouton
    let validButton = document.createElement('button');
    validButton.type = 'button';
    validButton.classList = 'btn btn-sm btn-outline-success mt-3 mb-2 w-25';
    validButton.id = 'validButton';
    validButton.textContent = '>';
    
    // Ajout du bouton a buttonDiv
    buttonDiv.appendChild(validButton);
    
    // Ajout de rowDiv dans containerDiv
    containerDiv.appendChild(rowDiv);
    // Ajout de buttonDiv dans containerDiv
    containerDiv.appendChild(buttonDiv);

    // Récupération de la section par son ID
    let mySection = document.getElementById('playPong');
    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(containerDiv);
    init_TwoPlayers_buttons();
}

function init_TwoPlayers_buttons() {
    const validButton = document.getElementById("validButton");
    validButton.addEventListener("click", function() {
        
        const player_1_Name = document.getElementById("namePlayer_1");
        const player_2_Name = document.getElementById("namePlayer_2");
        // if(player_1_Name.value === "" || player_2_Name.value === "") {
        //     alert_message(init_TwoPlayers_buttons, 'Player(s) missing');
        //     return;
        // }
        if(emptyInput(player_1_Name, init_TwoPlayers_buttons) || emptyInput(player_2_Name, init_TwoPlayers_buttons)) {
            return;
        }
        if(player_1_Name.value === player_2_Name.value) {
            alert_message(init_TwoPlayers_buttons, 'Two players cannot have the same name !');
            return;
        }
        else {

            leftPlayerName = player_1_Name.value;
            rightPlayerName = player_2_Name.value;
            removeContent();
            create_Start_menu();
        }
    });
}