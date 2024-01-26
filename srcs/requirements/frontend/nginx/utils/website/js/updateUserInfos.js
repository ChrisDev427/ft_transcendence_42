function handleBio_createForm() {
    // hide current bio
    document.getElementById('bioProfile').classList.add('hidden-element');

    const mainDiv = document.createElement('div');
    mainDiv.id = 'modifyBio';
    mainDiv.classList = 'col-sm-10 mx-auto shadow p-3 mt-3 rounded-4';

    const formDiv = document.createElement('form');
    formDiv.id = 'modifyBio-form';
    formDiv.method = 'patch';
    mainDiv.appendChild(formDiv);
    
    const textareaDiv = document.createElement('textarea');
    textareaDiv.id = 'newBio';
    textareaDiv.type = 'text';
    textareaDiv.classList = 'form-control form-control-sm mb-2 border-info shadow text-center';
    textareaDiv.name = 'newBio';
    textareaDiv.rows = '4';
    textareaDiv.placeholder = 'Enter your bio here';
    formDiv.appendChild(textareaDiv);

    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row mt-2';
    
    const col1Div = document.createElement('div');
    col1Div.classList = 'col-6';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.classList = 'btn btn-sm btn-outline-danger w-100 shadow';
    cancelBtn.type = 'submit';
    cancelBtn.textContent = 'Cancel';
    col1Div.appendChild(cancelBtn);
    rowDiv.appendChild(col1Div);

    const col2Div = document.createElement('div');
    col2Div.classList = 'col-6';
    
    const applyBtn = document.createElement('button');
    applyBtn.id = 'applyBtn';
    applyBtn.classList = 'btn btn-sm btn-outline-success w-100 shadow';
    applyBtn.type = 'submit';
    applyBtn.textContent = 'Apply';
    col2Div.appendChild(applyBtn);
    rowDiv.appendChild(col2Div);

    mainDiv.appendChild(rowDiv);
    document.getElementById('bioDiv').appendChild(mainDiv);

   document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('modifyBio').remove();
        document.getElementById('bioProfile').classList.remove('hidden-element');
   });
}

function handleInfos_createForm() {
    // hide current bio
    document.getElementById('infosProfile').classList.add('hidden-element');

    const mainDiv = document.createElement('div');
    mainDiv.id = 'modifyProfileInfos';
    mainDiv.classList = 'col-sm-6 mx-auto shadow p-3 rounded-4';

    const formDiv = document.createElement('form');
    formDiv.id = 'modifyProfileInfos-form';
    formDiv.method = 'patch';
    mainDiv.appendChild(formDiv);
    
    const inputsName = ["firstname", "lastname", "username", "password"];
    for (let i = 0; i < 4; i++) {
        const input = document.createElement('input');
        
        input.name = inputsName[i];
        input.id = inputsName[i];
        input.placeholder = inputsName[i];

        if(i < 3) {
            input.type = 'text';
            input.classList = 'form-control mb-2 border-info text-secondary text-center';
        } else {
            input.type = 'password';
            input.classList = 'form-control form-control-sm mb-1 mt-4 shadow border-success text-center';
        }
        formDiv.appendChild(input);
    }

    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row mt-2';
    
    const col1Div = document.createElement('div');
    col1Div.classList = 'col-6';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.classList = 'btn btn-sm btn-outline-danger w-100 shadow';
    cancelBtn.type = 'submit';
    cancelBtn.textContent = 'Cancel';
    col1Div.appendChild(cancelBtn);
    rowDiv.appendChild(col1Div);

    const col2Div = document.createElement('div');
    col2Div.classList = 'col-6';
    
    const applyBtn = document.createElement('button');
    applyBtn.id = 'applyBtn';
    applyBtn.classList = 'btn btn-sm btn-outline-success w-100 shadow';
    applyBtn.type = 'submit';
    applyBtn.textContent = 'Apply';
    col2Div.appendChild(applyBtn);
    rowDiv.appendChild(col2Div);

    mainDiv.appendChild(rowDiv);
    document.getElementById('infosDiv').appendChild(mainDiv);

   document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('modifyProfileInfos').remove();
        document.getElementById('infosProfile').classList.remove('hidden-element');
   });
}

function handleEmail_createForm() {
    // hide current bio
    document.getElementById('emailProfile').classList.add('hidden-element');

    const mainDiv = document.createElement('div');
    mainDiv.id = 'modifyEmail';
    mainDiv.classList = 'col-sm-8 mx-auto shadow p-3 rounded-4';

    const formDiv = document.createElement('form');
    formDiv.id = 'modifyEmail-form';
    formDiv.method = 'patch';
    mainDiv.appendChild(formDiv);
    
    let input = document.createElement('input');
    input.id = 'newEmail';
    input.type = 'email';
    input.name = 'newEmail';
    input.classList = 'form-control mb-2 border-info text-secondar text-center';
    input.placeholder = 'newEmail';
    formDiv.appendChild(input);

    input = document.createElement('input');
    input.id = 'password';
    input.type = 'password';
    input.name = 'password';
    input.classList = 'form-control form-control-sm mb-1 mt-4 border-success text-center shadow';
    input.placeholder = 'password';
    formDiv.appendChild(input);
    

    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row mt-2';
    
    const col1Div = document.createElement('div');
    col1Div.classList = 'col-6';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.classList = 'btn btn-sm btn-outline-danger w-100 shadow';
    cancelBtn.type = 'submit';
    cancelBtn.textContent = 'Cancel';
    col1Div.appendChild(cancelBtn);
    rowDiv.appendChild(col1Div);

    const col2Div = document.createElement('div');
    col2Div.classList = 'col-6';
    
    const applyBtn = document.createElement('button');
    applyBtn.id = 'applyBtn';
    applyBtn.classList = 'btn btn-sm btn-outline-success w-100 shadow';
    applyBtn.type = 'submit';
    applyBtn.textContent = 'Apply';
    col2Div.appendChild(applyBtn);
    rowDiv.appendChild(col2Div);

    mainDiv.appendChild(rowDiv);
    document.getElementById('emailDiv').appendChild(mainDiv);

   document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('modifyEmail').remove();
        document.getElementById('emailProfile').classList.remove('hidden-element');
   });
}