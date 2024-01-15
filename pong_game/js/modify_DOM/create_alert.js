
function alert_message(callBack, message) {

    let div = document.createElement('div');
    div.classList = 'w-50 alert alert-danger alert-dismissible mt-3 mb-1 fade show text-center text-danger mx-auto';
    div.role = 'alert';
    div.id = 'alert';
    div.textContent = message;

    let button = document.createElement('button');
    button.classList = 'btn-close';
    button.id = 'alertButton';
    button.setAttribute('data-bs-dismiss', 'alert');
    button.setAttribute('aria-label', 'Close');
    div.appendChild(button);
    // Delete validButton
    let toDel = document.getElementById('buttonDiv');
    toDel.remove();
    // To replace with
    let row = document.getElementById('menu');
    row.appendChild(div);

    const alertButton = document.getElementById('alertButton');
    alertButton.addEventListener("click", function() {
        let alert = document.getElementById('alert')
        alert.remove();
        let buttonDiv = document.createElement('div');
        buttonDiv.classList = 'd-flex justify-content-center mb-3';
        buttonDiv.id = 'buttonDiv';
        let button = document.createElement('button');
        button.classList = 'btn btn-sm btn-outline-success mt-3 mb-2 w-25 mx-auto';
        button.type = 'button';
        button.id = 'validButton';
        button.textContent = '>';

        buttonDiv.appendChild(button);
        let toAdd = document.getElementById('menu');
        toAdd.appendChild(buttonDiv);
        callBack();
    });
}