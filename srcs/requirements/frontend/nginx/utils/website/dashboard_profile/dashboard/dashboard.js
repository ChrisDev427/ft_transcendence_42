function getDashboardInfos() {
  console.log('function getDashboardInfos()');
  verifyToken();
  fetch('http://localhost:8000/api/account/profile/', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    }
  })
  .then(response => {
    if (response.status === 200) {
       
      return response.json();
    } else if (response.status === 401) {
      console.error('Error : expired access token', response.status);
    } else {
      console.error('Erreur lors de la récupération du dashboard :', response.status);
      throw new Error('Échec de la récupération du dashboard');
    }
  })
  .then(data => {

    console.log('apiUrl ' + data.avatar);
    initDashboard(data);
  })
  .catch(error => {
    console.error('Erreur lors de la récupération du dashboard :', error);
  });
}

function initDashboard(data) {
  // const friendShipList = document.getElementById('friendShipList-dashboard');
  // if (friendShipList) {
    
  //   document.querySelectorAll('#friendShipList-dashboard').forEach((element) => {
  //     element.remove();
  // });
  // }

  document.getElementById('firstNameDash').textContent = data.user.first_name;
  document.getElementById('lastNameDash').textContent = data.user.last_name;
  document.getElementById('userNameDash').textContent = data.user.username;
  document.getElementById('emailDash').textContent = data.user.email;
  if (data.mobile_number !== "") {
    document.getElementById('mobileDash').textContent = data.mobile_number;
  } else {
    document.getElementById('mobileDash').textContent = "Mobile not provided";
  }
  document.getElementById('bioDash').textContent = data.bio;
  document.getElementById('joinedDash').textContent = 'joined on : ' + handleDates(data.user.date_joined);
  document.getElementById('lastLoginDash').textContent = 'last login : ' + handleDates(data.user.last_login);
  document.getElementById('friendsNumberDash').textContent = data.friend.length;
  document.getElementById('victoriesNumberDash').textContent = data.win;
  document.getElementById('defeatsNumberDash').textContent = data.lose;
  document.getElementById('playedNumberDash').textContent = data.games_id.length;
  
  setPieChart(data.win, data.lose);
  getAvatar(data.user.username)
  .then(imageURL => {
    document.getElementById('avatar-img_dash').src = imageURL;
  })
  .catch(error => {
    console.error("Error : download avatar imgage 'initDashboard()' !", error);
  });
  
  manageFriends(data);
  get_users_data();
}


function manageFriends(data) {
  console.log('dashFriendsInitContent()');
  displaySpinner_dash('friendShipBody-dashboard');
  createFriendArray(data)
  .then(friendsArray => {
    if (friendsArray.length === 0) {
      document.getElementById('spinner' + 'friendShipBody-dashboard').remove();
      document.getElementById('friendsTextInfo').classList.remove('hidden-element');
      console.log('No friendship to display in dashboard');
    } else {
     
      friends_createContent(friendsArray);
    }
  })
  .catch(error => {
    console.error("Error in dashFriendsInitContent():", error);
  });
}

function friends_createContent(friendsArray) {

  sortFriendsArray(friendsArray);
  
  for (let i = 0; i < friendsArray.length; i++) {

    const mainDiv = document.createElement('div');
    mainDiv.classList = 'px-3 mb-3 fade-in';
    mainDiv.id = 'friendShipList-dashboard';
    
    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row py-3 px-3 shadow-sm rounded-3 bg-info bg-opacity-10';
    
    //*********************************************************************************
    
    const imgDiv = document.createElement('div');
    imgDiv.classList = 'col-auto mx-auto mx-sm-0 my-auto';
    
    const img = document.createElement('img');
    img.id = 'friendship-img';
    img.classList = 'rounded-3';
    img.style.maxWidth = '80px';
    getAvatar(friendsArray[i][0])
    .then(imageURL => {
      img.src = imageURL;
    })
    .catch(error => {
      console.error("Error : download avatar imgage 'createFriendsContent()' !", error);
    });
    img.alt = 'friendAvatar';
    imgDiv.appendChild(img);
    rowDiv.appendChild(imgDiv);

    //*********************************************************************************
    
    const infosDiv = document.createElement('div');
    infosDiv.classList = 'col-auto mx-auto mx-sm-0';
    
    const userName = document.createElement('h5');
    userName.classList = 'text-info text-center text-sm-start fs-3 mb-2 mt-1';
    userName.textContent = friendsArray[i][0];
    infosDiv.appendChild(userName);
    
    const isOnline = document.createElement('p');
    if (friendsArray[i][3] === true) {
      isOnline.classList = 'lead text-success fw-bold text-center text-sm-start fst-italic fs-6 mb-0';
      isOnline.textContent = 'Online';
    } else {
      isOnline.classList = 'lead text-danger text-center text-sm-start fst-italic fs-6 mb-0';
      isOnline.textContent = 'Offline';
    }
    infosDiv.appendChild(isOnline);
    
    const isPlaying = document.createElement('p');
    if (friendsArray[i][4] === true) {
      isPlaying.classList = 'lead text-success fw-bold text-center text-sm-start fst-italic fs-6 mb-2';
      isPlaying.textContent = 'Playing';
    } else {
      isPlaying.classList = 'lead text-danger text-center text-sm-start fst-italic fs-6 mb-2';
      isPlaying.textContent = 'Not playing';
    }
    infosDiv.appendChild(isPlaying);
    rowDiv.appendChild(infosDiv);
    
    //*********************************************************************************

    const bioDiv = document.createElement('div');
    bioDiv.classList = 'col-sm-4 col-md-6 col-xxl-7 mt-2 m-sm-auto bg-white bg-opacity-75 rounded-3 shadow-sm border';
    bioDiv.style.overflowY = 'auto';
    bioDiv.style.height = '80px';
    bioDiv.style.maxWidth = '780px';

    const bio = document.createElement('p');
    bio.classList = 'pt-1 lead fs-6 text-secondary text-center';
    bio.style.wordBreak = 'break-all';

    const small = document.createElement('small');
    small.textContent = friendsArray[i][2];
    rowDiv.appendChild(bioDiv);

    bio.appendChild(small);
    bioDiv.appendChild(bio);
    const iconDiv = document.createElement('div');
    iconDiv.classList = 'col-auto my-sm-auto mx-auto mx-md-0 ml-md-auto mt-2';
    const icon = document.createElement('i');
    icon.classList = 'btn border-0 fa-solid fa-ellipsis-vertical text-secondary';
    icon.id = 'friendExpand' + i;
    iconDiv.appendChild(icon);
    rowDiv.appendChild(iconDiv);

    //************************************************************************
    const friendObject = getUserObject(friendsArray[i][0]);
    const expandInfos = friendExpandInfos_createContent(friendObject, i);
    rowDiv.appendChild(expandInfos);
    //************************************************************************
    
    mainDiv.appendChild(rowDiv);

    setTimeout(function() {

      document.getElementById('friendShipBody-dashboard').appendChild(mainDiv);

      document.getElementById('friendExpand' + i).addEventListener('click', function() {
        const expandInfos = document.getElementById('expand' + i);
        if (expandInfos.classList.contains('hidden-element')) {
          expandInfos.classList.remove('hidden-element');
        } else {
          expandInfos.classList.add('hidden-element');
        }
      })
    }, 300);
  }
  document.getElementById('spinner' + 'friendShipBody-dashboard').remove();
}


function friendExpandInfos_createContent(userObject, index) {
  
  const cardTitles = ['Victories', 'Defeats', 'Played', 'Friends'];
  const cardValue = [userObject.win, userObject.lose, userObject.win + userObject.lose, userObject.friend.length];
  const cardIcons = ['fas fa-trophy text-success', 'fa-solid fa-face-sad-tear text-danger', 'fas fa-table-tennis text-info', 'fa-solid fa-people-group text-primary'];
  const cardTextColor = [' text-success', ' text-danger', ' text-info', ' text-primary'];
  const infosUser = [userObject.user.first_name, userObject.user.last_name, userObject.user.email];

  console.log('userObject = ' + userObject.user.username);

  const mainDiv = document.createElement('div');
  mainDiv.classList = 'col-12 mt-3 hidden-element';
  mainDiv.id = 'expand' + index;

  // const hr1 = document.createElement('hr');
  // hr1.classList = 'border-secondary';
  // mainDiv.appendChild(hr1);

  const mainRow = document.createElement('div');
  mainRow.classList = 'row p-4 d-flex justify-content-evenly bg-success bg-opacity-25 rounded-3 shadow-sm';

  for (let i = 0; i < 4; i++) {

    const mainCol = document.createElement('div');
    mainCol.classList = 'col-sm-5 px-2 rounded bg-white mb-2 shadow';
    const row = document.createElement('div');
    row.classList = 'row';

    const col1 = document.createElement('div');
    col1.classList = 'col';

    const title = document.createElement('small');
    title.classList = 'fw-bold' + cardTextColor[i];
    title.textContent = cardTitles[i];
    col1.appendChild(title);

    const value = document.createElement('small');
    value.classList = 'mb-0 fw-bold text-secondary ms-sm-2';
    value.textContent = cardValue[i];
    col1.appendChild(value);
    row.appendChild(col1);
    
    const col2 = document.createElement('div');
    col2.classList = 'col-auto';
    const icon = document.createElement('i');
    icon.classList = cardIcons[i];
    col2.appendChild(icon);
    row.appendChild(col2);
    
    mainCol.appendChild(row);
    mainRow.appendChild(mainCol);
  }
  
  const infosDiv = document.createElement('div');
  infosDiv.classList = 'col-12 mt-3';
  for (let i = 0; i < 4; i++) {
    const h5 = document.createElement('h5');
    if (i < 3) {
      h5.classList = 'text-secondary text-center fs-5';
      h5.textContent = infosUser[i];
    } else {
      h5.classList = 'text-secondary text-center fst-italic fs-6';
      if (userObject.mobile_number.length === 0) {
        h5.textContent = 'Mobile not provided';
      } else {
        h5.textContent = userObject.mobile_number;
      }
    }
    infosDiv.appendChild(h5);
  }
  mainRow.appendChild(infosDiv);

  const p1 = document.createElement('p');
  p1.classList = 'lead fst-italic text-secondary text-center fs-6 mb-0';
  const small1 = document.createElement('small');
  small1.textContent = 'joined on : ' + handleDates(userObject.user.date_joined);
  p1.appendChild(small1);
  infosDiv.appendChild(p1);

  const p2 = document.createElement('p');
  p2.classList = 'lead fst-italic text-secondary text-center fs-6';
  const small2 = document.createElement('small');
  small2.textContent = 'last login : ' + handleDates(userObject.user.last_login);
  p2.appendChild(small2);
  infosDiv.appendChild(p2);
  mainRow.appendChild(infosDiv);


  const btnDiv = document.createElement('div');
  btnDiv.classList = 'd-flex justify-content-center';
  const btn = document.createElement('button');
  btn.classList = 'btn btn-sm btn-warning text-white';
  btn.id = 'removeFriendBtn';
  btn.textContent = 'Remove friendship';
  btnDiv.appendChild(btn);
  infosDiv.appendChild(btnDiv);
  mainDiv.appendChild(mainRow);

  // const hr2 = document.createElement('hr');
  // hr2.classList = 'border-secondary';
  // mainDiv.appendChild(hr2);

  return mainDiv;  
}

function searchUser_createContent(friendObjet) {

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
  setTimeout(function() {
    document.getElementById('searchFriend-cardArea').appendChild(mainDiv);
  }, 300)
}
