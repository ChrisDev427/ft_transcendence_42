function alert_register_fail(message) {

    // Disable form
    const signUpSection = document.getElementById('signUp');
    // Parcourez tous les éléments descendants de la section
    signUpSection.querySelectorAll('input, button').forEach((element) => {
    element.disabled = true;  // Rendre l'élément inactif
    });


    let div = document.createElement('div');
    div.classList = 'w-75 mx-auto alert alert-danger alert-dismissible fade show text-center text-danger shadow ';
    div.role = 'alert';
    div.id = 'alert';
    div.textContent = message;

    let button = document.createElement('button');
    button.classList = 'btn-close';
    button.id = 'alertBtn';
    button.setAttribute('data-bs-dismiss', 'alert');
    button.setAttribute('aria-label', 'Close');
    div.appendChild(button);
   
    document.getElementById('signUpDiv').appendChild(div);

    document.getElementById('alertBtn').addEventListener("click", function() {
        
        signUpSection.querySelectorAll('input, button').forEach((element) => {
            element.disabled = false;  // Rendre l'élément actif
        });
    });
}

function alert_register_success() {

    // Sélectionnez la section par son ID
    const signUpSection = document.getElementById('signUp');

    // Parcourez tous les éléments descendants de la section
    signUpSection.querySelectorAll('input, button').forEach((element) => {
    element.disabled = true;  // Rendre l'élément inactif
    });

    let div = document.createElement('div');
    div.classList = 'w-75 mx-auto alert alert-success alert-dismissible fade show text-center text-success shadow';
    div.role = 'alert';
    div.id = 'alertSuccess';
    div.textContent = 'The account has been created successfully.';

    const br = document.createElement('br');
    div.appendChild(br);

    let link = document.createElement('a');
    link.id = 'linkToSignIn'
    link.classList = 'alert-link text-success';
    link.href = '#signIn';
    link.textContent = 'sign in';
    
    div.appendChild(link);
   
    document.getElementById('signUpDiv').appendChild(div);

    document.getElementById('linkToSignIn').addEventListener("click", function() {
        document.getElementById('alertSuccess').remove();
        document.getElementById('signup-form').reset();
        signUpSection.querySelectorAll('input, button').forEach((element) => {
            element.disabled = false;  // Rendre l'élément actif
        });
    });
}

function alert_login_fail() {
    // Disable form
    const signInSection = document.getElementById('signIn');
    // Parcourez tous les éléments descendants de la section
    signInSection.querySelectorAll('input, button').forEach((element) => {
    element.disabled = true;  // Rendre l'élément inactif
    });


    let div = document.createElement('div');
    div.classList = 'w-75 mx-auto alert alert-danger alert-dismissible fade show text-center text-danger shadow ';
    div.role = 'alert';
    div.id = 'alert';
    div.textContent = 'Wrong username or password !';

    let button = document.createElement('button');
    button.classList = 'btn-close';
    button.id = 'alertBtn';
    button.setAttribute('data-bs-dismiss', 'alert');
    button.setAttribute('aria-label', 'Close');
    div.appendChild(button);
   
    document.getElementById('signInDiv').appendChild(div);

    document.getElementById('alertBtn').addEventListener("click", function() {
        
        signInSection.querySelectorAll('input, button').forEach((element) => {
            element.disabled = false;  // Rendre l'élément actif
        });
    });
    
}

function alert_login_success() {

    // Sélectionnez la section par son ID
    const signInSection = document.getElementById('signIn');

    // Parcourez tous les éléments descendants de la section
    signInSection.querySelectorAll('input, button').forEach((element) => {
    element.disabled = true;  // Rendre l'élément inactif
    });

    const div = document.createElement('div');
    div.classList = 'w-75 mx-auto alert alert-success text-center text-success shadow';
    div.role = 'alert';
    div.id = 'alertSuccess';
    div.textContent = 'You are successfully logged !';
    
    document.getElementById('signInDiv').appendChild(div);
    
    const div1 = document.createElement('div');
    div1.id = 'spinner';
    div1.classList = 'd-flex justify-content-center';
    




    const div2 = document.createElement('div');
    div2.classList = 'spinner-border text-success';
    div2.role = 'status';
    // let span = document.createElement('span');
    // span.classList = 'visually-hidden';
    div1.appendChild(div2);

    document.getElementById('signInDiv').appendChild(div1);
    

    setTimeout(function () {
        
        document.getElementById('alertSuccess').remove();
        document.getElementById('spinner').remove();
        document.getElementById('nav-signIn').classList.add('hidden-element');
        document.getElementById('nav-signUp').classList.add('hidden-element');
        document.getElementById('dropDownProfile').classList.remove('hidden-element');

        document.getElementById('signIn-signUp-btn').classList.add('hidden-element');
        document.getElementById('friends-ganeHistory-btn').classList.remove('hidden-element');

        document.getElementById('signIn').disabled = true;

        showSection('main');
      }, 2000);


    // document.getElementById('linkToSignIn').addEventListener("click", function() {
    //     document.getElementById('signup-form').reset();
    //     signInSection.querySelectorAll('input, button').forEach((element) => {
    //         element.disabled = false;  // Rendre l'élément actif
    //     });
    // });
}