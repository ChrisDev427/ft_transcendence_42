// REGISTER ----------------------------------------------------------------------
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
        console.log('Register Success !' + response.status);
       
         // Vous pouvez personnaliser le message ou rediriger l'utilisateur ici
        window.location.replace('#signIn');
      } else {
        console.error('Erreur lors de l\'inscription : ' + response);
        e.target.reset();
        // Gérer les erreurs d'inscription ici, par exemple en affichant un message d'erreur
      }
    })
    .catch(error => {
      console.error('Erreur lors de la soumission du formulaire :', error);
    });
  });

// LOGIN -------------------------------------------------------------------------

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
          console.error('Erreur lors de l\'authentification : ' + response.status);
          e.target.reset();
          throw new Error('Échec de l\'authentification');
      }
  })
  .then(data => {
      // Récupère les informations de l'utilisateur et le jeton d'accès
      console.log(data);
      const userInformation = data.user;
      const accessToken = data.access;
      const refreshToken = data.refresh;

      getProfileInfos(accessToken);

      // Fait quelque chose avec les informations de l'utilisateur, par exemple, les afficher

      // console.log('Informations de l\'utilisateur :', userInformation);
      // console.log('Jeton d\'accès :', accessToken);

      // Redirige l'utilisateur vers une autre page (par exemple, le tableau de bord)
      // window.location.replace('index.html');
  })
  .catch(error => {
      console.error('Erreur lors de la soumission du formulaire :', error);
  });
});


function getProfileInfos(token) {
  fetch('http://localhost:8000/api/account/profile/', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
    }
  })
  .then(response => {
      if (response.status === 200) {
          // Authentification réussie
          return response.json();
      } else {
        // Gestion des erreurs lors de la récupération du profil
        console.error('Erreur lors de la récupération du profil :', response.status);
        throw new Error('Échec de la récupération du profil');
    }
  })
  .then(data => {
      // Récupère les informations de l'utilisateur
      
      console.log('Informations de l\'utilisateur :', data.avatar);
      fetchAndDisplayImage(data.avatar, token);

      document.getElementById('firstNameUser').textContent = data.user.first_name;
      document.getElementById('lastNameUser').textContent = data.user.last_name;
      document.getElementById('userName').textContent = data.user.username;
      document.getElementById('emailUser').textContent = data.user.email;
      document.getElementById('bioUser').textContent = data.user.bio;
      

      
      // Redirige l'utilisateur vers une autre page (par exemple, le tableau de bord)
      // window.location.replace('index.html');
  })
  .catch(error => {
    console.error('Erreur lors de la récupération du profil :', error);
  });
}

function fetchAndDisplayImage(apiUrl, token) {
  fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors du chargement de l\'image');
    }
    return response.blob();
  })
  .then(blob => {
    // Crée une URL objet à partir du blob
    const imageURL = URL.createObjectURL(blob);
    // Met à jour la source de l'élément image avec l'id 'avatar-img'
    document.getElementById('avatar-img').src = imageURL;
  })
  .catch(error => {
    console.error('Erreur lors du chargement de l\'image :', error);
  });
}
