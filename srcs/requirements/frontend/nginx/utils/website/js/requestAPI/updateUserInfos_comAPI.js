// Update User Infos

function modifyAvatar_API() {
    console.log('in modifyAvatar_API()');
    verifyToken();

    document.getElementById('modifyAvatar-form').addEventListener('submit', function (e) {
        e.preventDefault();

        fetch('http://localhost:8000/api/account/avatar/', {
            method: 'POST',
            body: new FormData(e.target),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then(response => {
            console.log('response status:', response.status);

            if (response.ok) {
                console.log('Modify Avatar Success!');
                return response.json();
            } else {
                throw new Error('Modify Avatar Error');
            }
        })
        .then(data => {
            console.log('apiUrl ' + data.avatar);
            // Vous pouvez gérer le succès et les erreurs ici
            fetchAndDisplayImage(data.avatar, token);
            alert_modify_success('avatarProfile', 'Success');
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            // Gérez toutes les erreurs ici, qu'elles soient liées à la requête ou à la réponse
            alert_modify_error('avatarProfile', 'Error');
        });
    });
}

function modifyBio_API() {
    console.log('in modifyInfos_API()');
    verifyToken();

    document.getElementById('modifyBio-form').addEventListener('submit', function (e) {
        e.preventDefault();

        fetch('http://localhost:8000/api/account/profile/', {
            method: 'PATCH',
            body: new FormData(e.target),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then(response => {
            console.log('response status:', response.status);

            if (response.ok) { // Vérifiez si la réponse a un statut de succès (200-299)
                console.log('Modify Bio Success!');
                getProfileInfos(localStorage.getItem('accessToken'));
                alert_modify_success('bioProfile', 'Success');
                // Vous pouvez appeler une fonction pour gérer le succès ici
            } else {
                // Si la réponse n'est pas OK, traitez l'erreur
                console.error('Error:', response.status);
                return response.json(); // Retourne la promesse pour que vous puissiez accéder aux données JSON de l'erreur
            }
        })
        .then(errorData => {
            // Traitez les données d'erreur ici s'il y en a
            if (errorData) {
                alert_modify_error('infosProfile', Object.values(errorData));
                console.error('Error Data:', errorData);
                // Vous pouvez également appeler une fonction pour gérer l'erreur ici
            }
        })
        .catch(error => {
            // Attrapez les erreurs qui se produisent lors de l'envoi de la requête
            console.error('Fetch Error:', error);
        });
    });
}


function modifyInfos_API() {
    console.log('in modifyInfos_API()');
    verifyToken();

    document.getElementById('modifyProfileInfos-form').addEventListener('submit', function (e) {
        e.preventDefault();

        fetch('http://localhost:8000/api/account/profile/', {
            method: 'PATCH',
            body: new FormData(e.target),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then(response => {
            console.log('response status:', response.status);

            if (response.ok) { // Vérifiez si la réponse a un statut de succès (200-299)
                console.log('Modify Infos Success!');
                getProfileInfos(localStorage.getItem('accessToken'));
                alert_modify_success('infosProfile', 'Success');
                // Vous pouvez appeler une fonction pour gérer le succès ici
            } else {
                // Si la réponse n'est pas OK, traitez l'erreur
                console.error('Error : Modify Infos : ', response.status);
                return response.json(); // Retourne la promesse pour que vous puissiez accéder aux données JSON de l'erreur
            }
        })
        .then(errorData => {
            // Traitez les données d'erreur ici s'il y en a
            if (errorData) {
                alert_modify_error('infosProfile', Object.values(errorData));
                console.error('Error Data:', errorData);
                // Vous pouvez également appeler une fonction pour gérer l'erreur ici
            }
        })
        .catch(error => {
            // Attrapez les erreurs qui se produisent lors de l'envoi de la requête
            console.error('Fetch Error:', error);
        });
    });
}

function modifyEmail_API() {
    console.log('in modifyEmail_API()');
    verifyToken();

    document.getElementById('modifyEmail-form').addEventListener('submit', function (e) {
        e.preventDefault();

        fetch('http://localhost:8000/api/account/profile/', {
            method: 'PATCH',
            body: new FormData(e.target),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then(response => {
            console.log('response status:', response.status);

            if (response.ok) { // Vérifiez si la réponse a un statut de succès (200-299)
                console.log('Modify Email Success!');
                getProfileInfos(localStorage.getItem('accessToken'));
                alert_modify_success('emailProfile', 'Success');
                // Vous pouvez appeler une fonction pour gérer le succès ici
            } else {
                // Si la réponse n'est pas OK, traitez l'erreur
                console.error('Error : Modify Email : ', response.status);
                return response.json(); // Retourne la promesse pour que vous puissiez accéder aux données JSON de l'erreur
            }
        })
        .then(errorData => {
            // Traitez les données d'erreur ici s'il y en a
            if (errorData) {
                alert_modify_error('emailProfile', Object.values(errorData));
                console.error('Error Data:', errorData);
                // Vous pouvez également appeler une fonction pour gérer l'erreur ici
            }
        })
        .catch(error => {
            // Attrapez les erreurs qui se produisent lors de l'envoi de la requête
            console.error('Fetch Error:', error);
        });
    });
}

function modify2FA_API() {
    console.log('in modify2FA_API()');
    verifyToken();

    document.getElementById('twofa-form').addEventListener('submit', function (e) {
        e.preventDefault();

        fetch('http://localhost:8000/api/account/profile/', {
            method: 'PATCH',
            body: new FormData(e.target),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then(response => {
            console.log('response status:', response.status);

            if (response.ok) { // Vérifiez si la réponse a un statut de succès (200-299)
                console.log('Modify 2FA Success!');
                // getProfileInfos(localStorage.getItem('accessToken'));
                // alert_modify_success('authProfile', 'Success');
                // Vous pouvez appeler une fonction pour gérer le succès ici
            } else {
                // Si la réponse n'est pas OK, traitez l'erreur
                console.error('Error : Modify 2FA : ', response.status);
                return response.json(); // Retourne la promesse pour que vous puissiez accéder aux données JSON de l'erreur
            }
        })
        .then(errorData => {
            // Traitez les données d'erreur ici s'il y en a
            if (errorData) {
                alert_modify_error('authProfile', Object.values(errorData));
                console.error('Error Data:', errorData);
                // Vous pouvez également appeler une fonction pour gérer l'erreur ici
            }
        })
        .catch(error => {
            // Attrapez les erreurs qui se produisent lors de l'envoi de la requête
            console.error('Fetch Error:', error);
        });
    });
}

function eraseAccount_API() {
    console.log('in eraseAccount_API()');
    verifyToken();

    document.getElementById('eraseAccount-form').addEventListener('submit', function (e) {
        e.preventDefault();

        fetch('http://localhost:8000/api/account/profile/', {
            method: 'DELETE',
            body: new FormData(e.target),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then(response => {
            console.log('response status:', response.status);

            if (response.ok) { // Vérifiez si la réponse a un statut de succès (200-299)
                console.log('Erase Account Success!');
                
                alert_modify_success('authProfile', 'Erasing...');
                setTimeout(function () {
                    
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    itemsVisibility_logged_out();
                    showSection('main');
                  }, 3000);
                // Vous pouvez appeler une fonction pour gérer le succès ici
            } else {
                // Si la réponse n'est pas OK, traitez l'erreur
                console.error('Error : Erase Account : ', response.status);
                // alert_modify_error('authProfile', 'An error accured !');

                return response.json(); // Retourne la promesse pour que vous puissiez accéder aux données JSON de l'erreur
            }
        })
        .then(errorData => {
            // Traitez les données d'erreur ici s'il y en a
            if (errorData) {
                alert_modify_error('authProfile', Object.values(errorData));
                console.error('Error Data:', errorData);
                // Vous pouvez également appeler une fonction pour gérer l'erreur ici
            }
        })
        .catch(error => {
            // Attrapez les erreurs qui se produisent lors de l'envoi de la requête
            console.error('Fetch Error:', error);
        });
    });
}

function alert_modify_success(targetDiv, message) {

    // Sélectionnez la section par son ID
    const modifyForm = document.getElementById('modifyForm');

    // Parcourez tous les éléments descendants de la section
    modifyForm.querySelectorAll('input, button').forEach((element) => {
    element.disabled = true;  // Rendre l'élément inactif
    });

    const div = document.createElement('div');
    div.classList = 'w-75 mx-auto alert alert-success text-center text-success shadow mt-3';
    div.role = 'alert';
    div.id = 'alert';
    div.textContent = message;
    
    modifyForm.appendChild(div);
    
    const div1 = document.createElement('div');
    div1.id = 'spinner';
    div1.classList = 'd-flex justify-content-center';
    
    const div2 = document.createElement('div');
    div2.classList = 'spinner-border text-secondary';
    div2.role = 'status';
    div1.appendChild(div2);

    modifyForm.appendChild(div1);
    

    setTimeout(function () {
        
      

        document.getElementById('modifyForm').remove();
        document.getElementById(targetDiv).classList.remove('hidden-element');
        enableProfileBtn();
        
      }, 3000);

}

function alert_modify_error(targetDiv, message) {

    // Sélectionnez la section par son ID
    const modifyForm = document.getElementById('modifyForm');

    // Parcourez tous les éléments descendants de la section
    modifyForm.querySelectorAll('input, button').forEach((element) => {
        element.disabled = true;  // Rendre l'élément inactif
    });

    const div = document.createElement('div');
    div.classList = 'w-75 mx-auto alert alert-danger alert-dismissible fade show text-center text-danger shadow mt-3';
    div.role = 'alert';
    div.id = 'alert';
    div.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.id = 'closeAlert';
    closeBtn.type = 'button';
    closeBtn.classList = 'btn-close';
    closeBtn.setAttribute('data-bs-dismiss', 'alert');
    closeBtn.setAttribute('aria-label', 'Close');

    div.appendChild(closeBtn);
    
    modifyForm.appendChild(div);

    closeBtn.addEventListener('click', function () {
        modifyForm.querySelectorAll('input, button').forEach((element) => {
            element.disabled = false;  // Rendre l'élément inactif
        });
        document.getElementById('modifyForm').remove();
        document.getElementById(targetDiv).classList.remove('hidden-element');
        enableProfileBtn();

        
    });
}

// document.getElementById('2FA-btn-on').addEventListener('click', function () {


    
//     verifyToken();
//     fetch('http://localhost:8000/api/account/profile/', {
//             method: 'PATCH',
//             headers: {
//                 'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 two_fa: 'True',
//             }),
//         })
//         .then(response => {
//             console.log('response status:', response.status);

//             if (response.ok) { // Vérifiez si la réponse a un statut de succès (200-299)
//                 console.log('Modify 2FA Success!');

            
//             } else {
//                 // Si la réponse n'est pas OK, traitez l'erreur
//                 console.error('Error : Modify 2FA : ', response.status);
//                 return response.json(); // Retourne la promesse pour que vous puissiez accéder aux données JSON de l'erreur
//             }
//         })
//         .then(errorData => {
//             console.error('Error : Modify 2FA : ', errorData);
//         })
//         .catch(error => {
//             // Attrapez les erreurs qui se produisent lors de l'envoi de la requête
//             console.error('Fetch Error:', error);
//         });
// });

// document.getElementById('2FA-btn-off').addEventListener('click', function () {
//     verifyToken();
//     fetch('http://localhost:8000/api/account/profile/', {
//             method: 'PATCH',
//             headers: {
//                 'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 two_fa: 'False',
//             }),
//         })
//         .then(response => {
//             console.log('response status:', response.status);

//             if (response.ok) { // Vérifiez si la réponse a un statut de succès (200-299)
//                 console.log('Modify 2FA Success!');

            
//             } else {
//                 // Si la réponse n'est pas OK, traitez l'erreur
//                 console.error('Error : Modify 2FA : ', response.status);
//                 return response.json(); // Retourne la promesse pour que vous puissiez accéder aux données JSON de l'erreur
//             }
//         })
//         .then(errorData => {
//             console.error('Error : Modify 2FA : ', errorData);
//         })
//         .catch(error => {
//             // Attrapez les erreurs qui se produisent lors de l'envoi de la requête
//             console.error('Fetch Error:', error);
//         });
// });
