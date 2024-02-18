
// let userNames_database = [];
let user_profiles;
let myFriendsUsernames;
let friendsArray;


function handleDates(data) {
  if (data) {
    let index = data.indexOf(".");
    let result = index !== -1 ? data.substring(0, index) : data;
    result = result.replace("T", " ");
    return result;
  } else {
    return "/";
  }
}

// Handle Friend List ------------------------------------------------------------------------------------

function createFriendArray(data) {
  friendsArray = [];

  return (
    getFriendsUsername(data)
      .then((friendsUsername) => {
        if (friendsUsername.length > 0) {
          const promises = friendsUsername.map((username) => {
            return fetchFriendInfos(username)
              .then((friendInfos) => {
                if (friendInfos) {
                  friendsArray.push(friendInfos);
                }
              })
              .catch((error) => {
                console.error(
                  `Error fetching friendInfos for username ${username}: `,
                  error
                );
              });
          });

          // Attendre que toutes les opérations asynchrones soient terminées
          return Promise.all(promises);
        }
      })
      .then(() => friendsArray)
      .catch((error) => {
        console.error("Error in getFriendMap():", error);
        throw error; // Propager l'erreur pour une gestion ultérieure si nécessaire
      })
  );
}

function getFriendsUsername(data) {
  const friendsUsernamePromises = data.friend.map((friendId) =>
    fetchUsername(friendId)
  );

  return Promise.all(friendsUsernamePromises)
    .then((usernames) => usernames.filter((username) => username !== null))
    .catch((error) => {
      console.error("Error in getFriendsUsername():", error);
      throw error; // Propager l'erreur pour une gestion ultérieure si nécessaire
    });
}




function fetchUsername(id) {
  return fetch("http://localhost:8000/api/account/" + id)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching username for ID ${id}`);
      }
      return response.json();
    })
    .then((data) => data.username)
    .catch((error) => {
      console.error(error);
      return null;
    });
}

function fetchFriendInfos(userName) {
  return fetch("http://localhost:8000/api/account/profile/" + userName)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching friendInfos for username ${userName}`);
      }
      return response.json();
    })
    .then((data) => {
      return [
        data.user.username,
        data.avatar,
        data.bio,
        data.is_connected,
        data.is_ingame,
      ];
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

function sortFriendsArray(arr) {
  // Utilisez la méthode de tri avec une fonction de comparaison
  arr.sort(function (a, b) {
    // Comparez les éléments de la première colonne (index 0)
    return a[0].localeCompare(b[0]);
  });
  // Retournez le tableau trié
  return arr;
}

function displaySpinner_dash(idDiv) {
  const div1 = document.createElement('div');
  div1.id = 'spinner' + idDiv;
  div1.classList = 'd-flex justify-content-center mt-3';
  const div2 = document.createElement('div');
  div2.classList = 'spinner-border text-info';
  div2.role = 'status';
  div1.appendChild(div2);
  document.getElementById(idDiv).appendChild(div1);
}


// Handle Users Data ----------------------------------------------------------------------------------

function get_users_data() {

  let totalUsers = 0;
  let connectedUsers = 0;
  user_profiles = [];


  fetchAccounts()
  .then(data => {
    // console.log('fetch accounts = ', data);
    for (let i = 0; i < data.length; i++) {
      // push in 'user_profiles[]' all profiles except current user and id=1(superUser)
      if (data[i].username !== sessionUsername && data[i].id !== 1 && data[i].is_active === true) {
        totalUsers++;
       
        // console.log('fetch accounts = ', data[i].username);
        fetchUserProfile(data[i].username)
        .then((data) => {
          if (data.is_connected === true) {
            connectedUsers++;
          }
          user_profiles.push(data);
        })
        .catch((error) => {
          console.error('Error : fetchUserProfile() called from get_users_data()', error);
          
        });
      }
    }
    console.log(user_profiles);
    
    document.getElementById('totalUsersDash').textContent = totalUsers +1;
    document.getElementById('connectedUsersDash').textContent = connectedUsers +1;



  })
  .catch((error) => {
    console.error('Error : get_users_data()', error);
  });
}

function fetchUserProfile(username) {
  // fetch all accounts
  return fetch("http://localhost:8000/api/account/profile/" + username)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error fetching user profile !');
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error('Error : fetchUserProfile()', error);
      return null;
    });
}

function fetchAccounts() {
  
  return fetch("http://localhost:8000/api/account/")
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error fetching userNames !');
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error('Error : fetch : fetchAccounts()', error);
      return null;
    });
}

document.getElementById('searchUserBtn').addEventListener('click', function() {
  refreshFriendSearch();

  const input = document.getElementById('searchUserInput');
  if (input.value === "") {
    console.log('no value');
  } else {
    // console.log(input.value);
    // const matchingUsernames = [];
    const matchedUsernames = compare_input_usernames(input.value)
    handleMatchedUsernames(matchedUsernames);
    
  }
})

document.getElementById('searchUserRefreshBtn').addEventListener('click', function() {
  refreshFriendSearch();
  document.getElementById('searchUserInput').value = ''
})


function compare_input_usernames(value) {

  const usernames = [];
  for (let i = 0; i < user_profiles.length; i ++) {
    // console.log(user_profiles[i]);
    usernames.push(user_profiles[i].user.username)
  }
  let matchedUsernames = usernames.filter(username =>
    username.substring(0, value.length) === value.substring(0, value.length)
  );
  // return an array of usernames matched
  return matchedUsernames;
}

function handleMatchedUsernames(matchedUsernames) {

  
  if (matchedUsernames.length === 0) {
    console.log("Usernames correspondants :", matchedUsernames);

    const div = document.createElement('div');
    div.id = 'searchUserNotFound';
    div.classList = 'p-2';
    const text = document.createElement('h5');
    text.classList = 'font-weight-bold text-center text-warning fs-3';
    text.textContent = "No match found !";
    div.appendChild(text);
    document.getElementById('searchFriend-cardArea').appendChild(div);
    

    document.getElementById('searchUserInput').value = ''
    setTimeout( function() {
      document.getElementById('searchUserNotFound').remove();
    }, 2000);
  } else {

    displaySpinner_dash('searchFriend-cardArea');
    for (let i = 0; i < matchedUsernames.length; i ++) {
      
      // console.log("Usernames :", matchedUsernames[i]);
      
      for (let j = 0; j < user_profiles.length; j ++) {
        
        if (matchedUsernames[i] === user_profiles[j].user.username) {
          
          console.log(user_profiles[j]);
          searchFriend_createContent(user_profiles[j])
        }
      }
    }
    setTimeout( function() {
      document.getElementById('spinner' + 'searchFriend-cardArea').remove();
    }, 290);

  }
}

function searchFriend_createContent(friendObjet) {


  console.log('avatar url = ' + friendObjet.avatar);
  const mainDiv = document.createElement('div');
  mainDiv.classList = 'col-sm-10 mx-auto bg-primary bg-opacity-10 rounded shadow p-3 mb-3 fade-in';

  const rowDiv = document.createElement('div');
  rowDiv.classList = 'row';

  const imgDiv = document.createElement('div');
  imgDiv.classList = 'col-auto mx-auto mx-sm-0 my-auto';

  const img = document.createElement('img');
  img.classList = 'rounded-3 shadow';
  img.alt = 'avatarUser';
  img.style.maxWidth = '80px';
  getAvatar(friendObjet.user.username)
  .then(imageURL => {
    img.src = imageURL;
  })
  .catch(error => {
    console.error("Error : download avatar imgage 'searchFriend_createContent()' !", error);
  });
  imgDiv.appendChild(img);
  rowDiv.appendChild(imgDiv);

  const infosDiv = document.createElement('div');
  infosDiv.classList = 'col-sm-5 my-auto';
  const username = document.createElement('h5');
  username.classList = 'text-info text-center text-sm-start fs-3 mb-2 mt-md-0';
  username.textContent = friendObjet.user.username;
  infosDiv.appendChild(username);
  const firstname = document.createElement('h5');
  firstname.classList = 'text-secondary text-center text-sm-start fs-5';
  firstname.textContent = friendObjet.user.first_name;
  infosDiv.appendChild(firstname);
  const lastname = document.createElement('h5');
  lastname.classList = 'text-secondary text-center text-sm-start fs-5';
  lastname.textContent = friendObjet.user.last_name;
  infosDiv.appendChild(lastname);
  rowDiv.appendChild(infosDiv);

  const div = document.createElement('div');
  div.classList = 'col-sm-3 d-flex justify-content-center align-items-center';
  if (!isFriend(friendObjet.user.username)) {
    const btn = document.createElement('button');
    btn.classList = 'btn btn-info text-white mx-auto';
    btn.textContent = 'Ask as friend';
    btn.id = 'askFriendBtn';
    div.appendChild(btn);
  } else {
    const icon = document.createElement('i');
    icon.classList = 'fa-solid fa-user-group fa-3x text-info';
    icon.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.3)';
    div.appendChild(icon);
  }
  rowDiv.appendChild(div);

  mainDiv.appendChild(rowDiv);
  // document.getElementById('spinner' + 'searchFriend-cardArea').remove();
  setTimeout(function() {
    document.getElementById('searchFriend-cardArea').appendChild(mainDiv);
  }, 300)
  
}

function refreshFriendSearch() {
  // Sélectionner la div par son id
  const div = document.getElementById("searchFriend-cardArea");

  // Supprimer tous les enfants de la div
  while (div.firstChild) {
      div.removeChild(div.firstChild);
  }
}

function isFriend(usernameFounded) {
  // console.log('friendsArray = ' + friendsArray);

  for (let i = 0; i < friendsArray.length; i ++) {
    if (usernameFounded === friendsArray[i][0]) {
      console.log(usernameFounded + ' is a friend');
      return true;
    }
  }
  console.log(usernameFounded + ' is not a friend !');
  return false;
}