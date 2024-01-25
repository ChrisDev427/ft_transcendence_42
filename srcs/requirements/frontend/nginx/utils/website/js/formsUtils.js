// POST REGISTER ----------------------------------------------------------------------
//const csrfToken = getCookie('csrftoken');
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    fetch('http://localhost:8000/api/account/register/', {
    method: 'POST',
    body: new FormData(e.target)
    })
    .then(response => {
      console.log('response = ' + response);

      if (response.status === 201) { // 201 Created (ou le code approprié renvoyé par votre API en cas de succès)
        console.log('Inscription réussie !');
       
         // Vous pouvez personnaliser le message ou rediriger l'utilisateur ici
        window.location.replace('index.html');
      } else {
        alert('Erreur lors de l\'inscription : ' + response.status);
        e.target.reset();
        // Gérer les erreurs d'inscription ici, par exemple en affichant un message d'erreur
      }
    })
    .catch(error => {
      console.error('Erreur lors de la soumission du formulaire :', error);
    });
  });

  // POST LOGIN -------------------------------------------------------------------------
//   document.getElementById('signin-form').addEventListener('submit', function (e) {
//     e.preventDefault();
//     fetch('http://localhost:8000/api/account/login/', {
//     method: 'POST',
//     body: new FormData(e.target)
//     })
//     .then(response => {
//       if (response.status === 200) { // 201 Created (ou le code approprié renvoyé par votre API en cas de succès)
//         const alerte = alert('authentification réussie !');
//         // setTimeout(function(){
//         //   alerte.close();
//         // }, 2000);
//         const auth_token = response.access;
//         const refresh_token = response.refresh;
//         console.log(auth_token);
//          // Vous pouvez personnaliser le message ou rediriger l'utilisateur ici
//         window.location.replace('index.html');
//       } else {
//         alert('Erreur lors de l\'authentification : ' + response.status);
//         e.target.reset();
//         // Gérer les erreurs d'inscription ici, par exemple en affichant un message d'erreur
//       }
//     })
//     .catch(error => {
//       console.error('Erreur lors de la soumission du formulaire :', error);
//     });
//   });
document.getElementById('signin-form').addEventListener('submit', function (e) {
  e.preventDefault();

  fetch('http://localhost:8000/api/account/login/', {
      method: 'POST',
      body: new FormData(e.target)
  })
  .then(response => {
      if (response.status === 200) {
          // Authentification réussie
          return response.json();
      } else {
          // Authentification échouée
          alert('Erreur lors de l\'authentification : ' + response.status);
          e.target.reset();
          throw new Error('Échec de l\'authentification');
      }
  })
  .then(data => {
      // Récupère les informations de l'utilisateur et le jeton d'accès
      const userInformation = data.user;
      const accessToken = data.access;

      // Fait quelque chose avec les informations de l'utilisateur, par exemple, les afficher

      console.log('Informations de l\'utilisateur :', userInformation);
      console.log('Jeton d\'accès :', accessToken);

      // Redirige l'utilisateur vers une autre page (par exemple, le tableau de bord)
      // window.location.replace('index.html');
  })
  .catch(error => {
      console.error('Erreur lors de la soumission du formulaire :', error);
  });
});