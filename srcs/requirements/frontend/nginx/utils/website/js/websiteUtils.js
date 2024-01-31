
function hideCurrentSection() {
    const sections = document.querySelectorAll('section');
    sections.forEach(function (section) {
        if (!section.classList.contains('hidden-element')) {
            section.classList.add('hidden-element');
        }
    });
}

function showSection(sectionId) {
    let targetSection = document.getElementById(sectionId);
    
    hideCurrentSection();
    // Si sectionId est vide, affichez la section principale par défaut
    if (!sectionId) {
        // Remplacez 'main' par l'ID de votre section principale
        targetSection = document.getElementById('main');
        targetSection.classList.remove('hidden-element');

        location.hash = ''; // Supprime le hash de l'URL
    } else {
        targetSection.classList.remove('hidden-element');
        location.hash = '#' + sectionId;
    }
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);
}


// Écouter les changements d'état du navigateur (bouton de retour)
window.addEventListener('popstate', function (event) {
    var sectionId = (location.hash) ? location.hash.slice(1) : null;
    console.log('Popstate event:', sectionId);
    
    showSection(sectionId);
    
});

// Au chargement initial, vérifiez s'il y a un hash et affichez la section correspondante
document.addEventListener('DOMContentLoaded', function () {
    var sectionId = location.hash.slice(1);
    console.log('Initial hash:', sectionId);

    showSection(sectionId);
    
});

// Navbar close auto
// document.addEventListener('DOMContentLoaded', function () {
//     const navLinks = document.querySelectorAll('.navbar-nav a');

//     navLinks.forEach(function (link) {
//         link.addEventListener('click', function () {
//             // Ferme le menu
//             const navbarToggler = document.querySelector('.navbar-toggler');
//             if (navbarToggler && !navbarToggler.classList.contains('collapsed')) {
//                 navbarToggler.click();
//             }
//         });
//     });
// });

// document.addEventListener('DOMContentLoaded', function () {
//     console.log('Check accessToken & refreshToken');
//     // Récupérez les tokens du localStorage
//     const storedAccessToken = localStorage.getItem('accessToken');
//     const storedRefreshToken = localStorage.getItem('refreshToken');
//     // Vérifiez si les tokens existent
//     if (storedAccessToken && storedRefreshToken) {
//         // Utilisez les tokens pour l'authentification
//         // ...
//         getProfileInfos(storedAccessToken);
//         // document.getElementById('alertSuccess').remove();
//         // document.getElementById('spinner').remove();
//         document.getElementById('nav-signIn').classList.add('unvisible');
//         document.getElementById('nav-signUp').classList.add('unvisible');
//         document.getElementById('dropDownProfile').classList.remove('unvisible');

//         document.getElementById('signIn-signUp-btn').classList.add('unvisible');
//         document.getElementById('friends-gameHistory-btn').classList.remove('unvisible');
//         document.getElementById('profile').classList.remove('unvisible');

//         document.getElementById('signIn').disabled = true;

//         // showSection('main');
//         console.log('AccessToken:', storedAccessToken);
//         console.log('RefreshToken:', storedRefreshToken);

//         // Par exemple, vous pourriez renvoyer ces tokens au serveur pour vérification
//         // ou effectuer toute autre opération nécessaire pour restaurer la session.
//     }
// });