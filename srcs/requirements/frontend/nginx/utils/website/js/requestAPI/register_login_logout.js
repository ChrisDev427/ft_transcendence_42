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
        e.target.reset();


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
      localStorage.setItem('connectType', 'signin');

      getProfileInfos(localStorage.getItem('accessToken'));
      profileAccess(localStorage.getItem('connectType'));

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
// LOGIN WITH 42 ******************************************************************************************
function loginWith42() {
  console.log('connect with 42 function');
  const oauthUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-44e47265c9b8312f83a47d720211e265bef85a1c8fc632f8786fe9dcdade34d1&redirect_uri=http%3A%2F%2Flocalhost&response_type=code';
  window.location.href = oauthUrl;
}

const code = getAuthorizationCode();
if (code) {
  console.log('code = ' + code);
    exchangeCodeForToken(code);
}

function getAuthorizationCode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}
  
async function exchangeCodeForToken(code) {
  try {
    const response = await fetch('http://localhost:8000/api/account/o/token/?code=' + code);
    
    if (!response.ok) {
      throw new Error('Error : fetch : exchange token');
    }
    const data = await response.json();
    console.log('data.access = ' + data.access);
    console.log('data.refresh = ' + data.refresh);
    console.log('data = :', data);
    
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('connectType', '42');

    itemsVisibility_logged_in();
    
    console.log('exchange token');
    getProfileInfos(localStorage.getItem('accessToken'));
    profileAccess(localStorage.getItem('connectType'));
    
    removeParamURL();
  } catch (error) {
    console.error('Error : request exchange code / token :', error);
    throw error;
  }
}

function removeParamURL() {
  // Récupérer l'URL actuelle
  const currentURL = new URL(window.location.href);

  // Récupérer les paramètres de l'URL
  const urlParams = currentURL.searchParams;

  // Supprimer le paramètre spécifié (dans ce cas, 'code')
  urlParams.delete('code');

  // Mettre à jour l'URL sans le paramètre
  window.history.replaceState({}, document.title, currentURL.href);
}
// const code = getAuthorizationCode();
// if (code) {
//   console.log('code = ' + code);
//   response = exchangeCodeForToken(code);
//   console.log('response.access = ' + response.access);
//   console.log('response.refresh = ' + response.refresh);
//   // token = response.access_token;
//   // token_refresh = response.refresh_token;
// }

// function getAuthorizationCode() {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get('code');
// }

// async function exchangeCodeForToken(code) {
//   const response = await fetch('http://localhost:8000/api/account/o/token/?code=' + code);
//   console.log('response = ' + response);
//   const data = await response.json();
//   console.log('data = : ' + data);
//   return data;
// }


//*********************************************************************************************************

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
      console.log('apiUrl ' + data.avatar);
      fetchAndDisplayImage(data.avatar, token);
      document.getElementById('firstNameProfile').textContent = data.user.first_name;
      document.getElementById('lastNameProfile').textContent = data.user.last_name;
      document.getElementById('userNameProfile').textContent = data.user.username;
      document.getElementById('emailProfile').textContent = data.user.email;
      document.getElementById('bioProfile').textContent = data.bio;
      document.getElementById('username-profileDropdown').textContent = data.user.username;
      document.getElementById('bio-profileDropdown').textContent = data.bio;

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

window.addEventListener('DOMContentLoaded', function () {
  var hash = window.location.hash.substring(1);
 
  // console.log(hash);
  if (hash === 'verify-email') {
      // Appeler votre fonction JavaScript ici

      verifyEmail();

  }
});

function verifyEmail() {
  console.log('Fonction verifyEmail !');

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  console.log(token);

  if (token) {
    fetch("http://localhost:8000/api/account/email/verify/?token=" + token)
    
    .then(response => {
      if (response.status === 200) {
        // Authentification réussie
        // return response.json();
        console.log('email verified !');
        alert_email_success();
      } else {
        // Gestion des erreurs lors de la récupération du profil
        console.error('Error email verification', response.status);
        // Vous pouvez afficher un message d'erreur ici si nécessaire
      }
    })
    .catch(error => {
      console.error('Network error', error);
      // Vous pouvez afficher un message d'erreur ici si nécessaire
    });
  } else {
    console.error('Token not found in URL');
    // Vous pouvez afficher un message d'erreur ici si nécessaire
  }
}

function alert_email_success() {

  console.log('Fonction alertEmailSuccess !');
  document.getElementById('verify-email').classList.remove('unvisible');
  const div = document.createElement('div');
  div.classList = 'w-75 p-4 mx-auto alert alert-success text-center text-success shadow';
  div.style.cssText = 'position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%)';

  div.style.maxWidth= '350px';
  div.role = 'alert';
  div.id = 'alertSuccessEmail';
  div.innerHTML = 'Email has been verified with success<br>You can close this window.';

  document.getElementById('verify-email').appendChild(div);
  document.getElementById('header').classList.add('hidden-element');
  document.getElementById('footer').classList.add('hidden-element');
}

