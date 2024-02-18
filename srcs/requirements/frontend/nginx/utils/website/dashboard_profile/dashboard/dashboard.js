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

  // document.getElementById('totalUsersDash').textContent = totalUsers;
  // document.getElementById('connectedUsersDash').textContent = connectedUsers;
}


function manageFriends(data) {
  console.log('dashFriendsInitContent()');
  displaySpinner_dash('friendShipBody-dashboard');
  createFriendArray(data)
  .then(friendsArray => {
    if (friendsArray.length === 0) {

      const div = document.createElement('div');
      div.id = 'friendsTextInfo';
      div.classList = 'p-5';
      const text = document.createElement('h5');
      text.classList = 'font-weight-bold text-center text-secondary';
      text.textContent = "You don't have any friend yet";
      div.appendChild(text);
      document.getElementById('friendShipBody-dashboard').appendChild(div);
      document.getElementById('spinnerFriends').remove();

      console.log('No friendship to display in dashboard');
    } else {
      const textToRemove = document.getElementById('friendsTextInfo');
      if (textToRemove) {
        textToRemove.remove();
      }
      createFriendsContent(friendsArray);
    }
    
  })
  .catch(error => {
    console.error("Error in dashFriendsInitContent():", error);
  });
}

function createFriendsContent(friendsArray) {

  console.log('array size = ' + friendsArray.length);
  sortFriendsArray(friendsArray);
  
  for (let i = 0; i < friendsArray.length; i++) {

    // console.log('check = ' + friendsArray[i][0]);
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
    icon.onclick = '';
    iconDiv.appendChild(icon);
    rowDiv.appendChild(iconDiv);

    mainDiv.appendChild(rowDiv);
    setTimeout(function() {

     
      document.getElementById('friendShipBody-dashboard').appendChild(mainDiv);
    }, 300)

  }
  
  document.getElementById('spinner' + 'friendShipBody-dashboard').remove();
}