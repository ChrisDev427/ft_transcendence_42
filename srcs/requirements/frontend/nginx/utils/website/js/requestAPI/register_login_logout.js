// REGISTER ----------------------------------------------------------------------
//const csrfToken = getCookie('csrftoken');
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    verifyToken();

    fetch('http://localhost:8000/api/account/register/', {
    method: 'POST',
    body: new FormData(e.target)

    })
    .then(response => {
      console.log('response = ' + response);

      if (response.status === 201) { // 201 Created (ou le code approprié renvoyé par votre API en cas de succès)
        console.log('Register Success !' + response.status);
        alert_register_success();

      } else {
            response.json().then((jsonData) => {
            console.error('Erreur lors de l\'inscription : ' + Object.values(jsonData));
            alert_register_fail("Registration error : " + Object.values(jsonData));
          }).catch((error) => {
              console.error('Erreur lors de la récupération du contenu JSON de la réponse : ' + error);
        });
        e.target.reset();
      }
    })
    .catch(error => {
      console.error('Erreur lors de la soumission du formulaire :', error);
    });
  });

// LOGIN -------------------------------------------------------------------------

document.getElementById('signin-form').addEventListener('submit', function (e) {
  e.preventDefault();
  verifyToken();

  fetch('http://localhost:8000/api/account/login/', {
      method: 'POST',
      body: new FormData(e.target)
  })
  .then(response => {
      if (response.status === 200) {
          // Authentification réussie
          console.log('login success');
          alert_login_success();
          return response.json();
      } else {
          // Authentification échouée
          console.error('Authentication failed : ' + response.status);
          alert_login_fail();
          e.target.reset();
          throw new Error('Authentication failed');
      }
  })
  .then(data => {
      // Récupère les informations de l'utilisateur et le jeton d'accès
      console.log(data);
      const userInformation = data.user;
      // const accessToken = data.access;
      // const refreshToken = data.refresh;

      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      getProfileInfos(localStorage.getItem('accessToken'));

      // Fait quelque chose avec les informations de l'utilisateur, par exemple, les afficher

      // console.log('Informations de l\'utilisateur :', userInformation);
      // console.log('Jeton d\'accès :', accessToken);

      // Redirige l'utilisateur vers une autre page (par exemple, le tableau de bord)
      // window.location.replace('index.html');
  })
  .catch(error => {
      console.error('Error : form submit :', error);
  });
});


function getProfileInfos(token) {
  console.log('GET PROFILE INFOS FUNCTION');
  verifyToken();
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
      } else if (response.status === 401) {

          console.error('Error : expired access token', response.status);

          // getProfileInfos(localStorage.getItem('accessToken'));

      } else {
        // Gestion des erreurs lors de la récupération du profil
        console.error('Erreur lors de la récupération du profil :', response.status);
        throw new Error('Échec de la récupération du profil');
    }
  })
  .then(data => {
      // Récupère les informations de l'utilisateur
      fetchAndDisplayImage(data.avatar, token);
      document.getElementById('dropDownProfileName').textContent = data.user.username;
      document.getElementById('firstNameProfile').textContent = data.user.first_name;
      document.getElementById('lastNameProfile').textContent = data.user.last_name;
      document.getElementById('userNameProfile').textContent = data.user.username;
      document.getElementById('emailProfile').textContent = data.user.email;
      document.getElementById('bioProfile').textContent = data.bio;

      userId = data.user.id;
      username = data.user.username;

  })
  .catch(error => {
    console.error('Erreur lors de la récupération du profil :', error);
  });
}

function fetchAndDisplayImage(apiUrl, token) {
  verifyToken();

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
    document.getElementById('avatar-img_profilDropdown').src = imageURL;
  })
  .catch(error => {
    console.error('Erreur lors du chargement de l\'image :', error);
  });
}



function verifyEmail() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  console.log(token);
  verifyToken();

  fetch("http://localhost:8000/api/account/register/verify/?token=" + token)

  .then(response => {
    if (response.status === 200) {
        // Authentification réussie
        // return response.json();
        console.log('email verified !');
    } else {
      // Gestion des erreurs lors de la récupération du profil
      console.error('Error email verfification', response.status);
  }})
}


