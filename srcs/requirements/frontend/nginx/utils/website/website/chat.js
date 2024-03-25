let mutedFriends = [];

function showMainChat() {

    const mainChat = document.getElementById('mainChat');
    if (mainChat.classList.contains('unvisible')) {
        mainChat.classList.remove('unvisible');
        document.getElementById('mainChatBtn').classList.add('text-secondary');
    } else {
        mainChat.classList.add('unvisible');
        document.getElementById('mainChatBtn').classList.remove('text-secondary');
    }
}

function chatGeneral_createContent(username, message, time, messageType) {

    if (mutedFriends.includes(username)) {return;}

    const mainDiv = document.createElement('div');
    const small = document.createElement('small');
    small.textContent = message;

    if (messageType !== 'classic') {
    
        const div = document.createElement('div');
        if (messageType === 'online') {
            if (username === sessionUsername) {
                small.textContent = 'You are connected';
            } else {
                small.textContent = username + ': is connected';
            }
            div.classList = ' fw-bold fst-italic text-success text-center fade-in mx-auto';
        }
        else if (messageType === 'offline'){
            small.textContent = username + ': is disconnected';
            div.classList = ' fw-bold fst-italic text-danger text-center fade-in mx-auto';
        }
        div.style.maxWidth = '210px';
        div.appendChild(small);
        mainDiv.appendChild(div);
        document.getElementById('chat-messages-general').appendChild(mainDiv);
        return;
    }

    if (username === sessionUsername) {
        const timeDiv = document.createElement('div');
        timeDiv.classList = 'row p-0';
        const timeText = document.createElement('p');
        timeText.classList = 'col-12 small fw-bold fst-italic text-warning text-end m-0';
        const small2 = document.createElement('small');
        small2.textContent = time;

        timeText.appendChild(small2);
        timeDiv.appendChild(timeText);
        mainDiv.appendChild(timeDiv);
        const div = document.createElement('div');
        div.classList = 'lh-1 fw-semibold p-2 text-white bg-info bg-opacity-75 rounded-bottom-4 rounded-start-4 ms-auto mb-2 text-break fade-in';
        div.style.maxWidth = '210px';

        div.appendChild(small);
        mainDiv.appendChild(div);
        document.getElementById('chat-messages-general').appendChild(mainDiv);

    } else {

        const usernameDiv = document.createElement('div');
        usernameDiv.classList = 'row';

        const usernameText = document.createElement('p');
        usernameText.classList = 'col-4 fw-semibold fst-italic text-info m-0';
        usernameText.id = username + '_btnProfileChat';

        const small1 = document.createElement('small');
        small1.textContent = username + ': ';
        small1.classList = 'col-auto';
        small1.role = 'button';
        usernameText.appendChild(small1);
        usernameDiv.appendChild(usernameText);

        const timeText = document.createElement('p');
        timeText.classList = 'col-4 small fw-bold fst-italic text-end text-warning m-0 p-0';
        const small2 = document.createElement('small');
        small2.textContent = time;
        timeText.appendChild(small2);
        usernameDiv.appendChild(timeText);


        mainDiv.appendChild(usernameDiv);

        const div = document.createElement('div');
        div.classList = 'lh-1 fw-semibold p-2 text-white bg-secondary bg-opacity-75 rounded-bottom-4 rounded-end-4 me-auto mb-2 text-break fade-in';
        div.style.maxWidth = '210px';

        div.appendChild(small);
        mainDiv.appendChild(div);
        document.getElementById('chat-messages-general').appendChild(mainDiv);

        usernameText.addEventListener('click', function() {
            chatProfile_createContent(username);
        })
    }
}

function chatSession_createContent(username, message, time, messageType) {

    const messageContainer = document.getElementById('chat-messages_session');

    messageContainer.innerHTML += `<div><strong>${username}:</strong> ${message}</div>`;

    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function chatProfile_createContent(username) {

    const input = document.getElementById('message-input_general');
    input.disabled = true;
    fetchUserProfile(username)
    .then((data) => {

        const mainDiv = document.createElement('div');
        mainDiv.classList = 'row p-1 d-flex justify-content-center fade-in';

        const imgDiv = document.createElement('div');
        imgDiv.classList = 'col-auto';

        const img = document.createElement('img');
        getAvatar(username)
        .then(imageURL => {
          img.src = imageURL;
        })
        .catch(error => {
          console.error("Error : download avatar imgage 'chatProfile_createContent()' !", error);
        });
        img.alt = 'avatarImg';
        img.classList = 'rounded-2 shadow';
        img.style.maxHeight = '80px';
        imgDiv.appendChild(img);
        mainDiv.appendChild(imgDiv);

        const infoDiv1 = document.createElement('div');
        infoDiv1.classList = 'col-auto my-auto';

        const userName = document.createElement('h5');
        userName.classList = 'text-center text-info text-uppercase';
        userName.textContent = data.user.username;
        infoDiv1.appendChild(userName);

        const firstName = document.createElement('h5');
        firstName.classList = 'text-center text-secondary mb-0';
        firstName.textContent = data.user.first_name;
        infoDiv1.appendChild(firstName);

        const lastName = document.createElement('h5');
        lastName.classList = 'text-center text-secondary mb-0';
        lastName.textContent = data.user.last_name;
        infoDiv1.appendChild(lastName);

        mainDiv.appendChild(infoDiv1);

        const infoDiv2 = document.createElement('div');

        const hr1 = document.createElement('hr');
        hr1.classList = 'mb-1';
        infoDiv2.appendChild(hr1);

        const friends = document.createElement('h5');
        friends.classList = 'text-center text-primary mb-0';
        friends.textContent = 'Friends - ' + data.friend.length;
        infoDiv2.appendChild(friends);

        const played = document.createElement('h5');
        played.classList = 'text-center text-info mb-0';
        played.textContent = 'Played - ' + (data.win + data.lose);
        infoDiv2.appendChild(played);

        const victories = document.createElement('h5');
        victories.classList = 'text-center text-success mb-0';
        victories.textContent = 'Victories - ' + data.win;
        infoDiv2.appendChild(victories);

        const defeats = document.createElement('h5');
        defeats.classList = 'text-center text-danger mb-0';
        defeats.textContent = 'Defeats - ' + data.lose;
        infoDiv2.appendChild(defeats);

        const hr2 = document.createElement('hr');
        hr2.classList = 'mt-1 mb-2';
        infoDiv2.appendChild(hr2);

        mainDiv.appendChild(infoDiv2);

        const btnsRow = document.createElement('div');
        btnsRow.classList = 'row d-flex justify-content-between';

        const inviteIcon = document.createElement('i');
        inviteIcon.id = 'invite-icon'
        inviteIcon.classList = 'col-auto fas fa-table-tennis fa-2x text-info';
        inviteIcon.role = 'button';
        btnsRow.appendChild(inviteIcon);

        const btnsDiv = document.createElement('div');
        btnsDiv.classList = 'col-auto';

        const mute_icon = document.createElement('i');
        mute_icon.id = 'mute-icon';
        if (mutedFriends.includes(username)) {
            mute_icon.classList = 'fa-solid fa-comment-slash fa-2x text-success me-3';
        } else {
            mute_icon.classList = 'fa-solid fa-comment-slash fa-2x text-secondary text-opacity-50 me-3';
        }
        mute_icon.role = 'button';
        btnsDiv.appendChild(mute_icon);

        const unMute_icon = document.createElement('i');
        unMute_icon.id = 'unMute-icon';
        if (!mutedFriends.includes(username)) {
            unMute_icon.classList = 'fa-solid fa-comment fa-2x text-success me-3';
        } else {
            unMute_icon.classList = 'fa-solid fa-comment fa-2x text-secondary text-opacity-50 me-3';
        }
        unMute_icon.role = 'button';
        btnsDiv.appendChild(unMute_icon);
        btnsRow.appendChild(btnsDiv);

        mainDiv.appendChild(btnsRow);

        const closeBtn = document.createElement('h5');
        closeBtn.classList = 'col-auto text-info fst-italic text-center fs-6 mb-0 mt-2';
        closeBtn.textContent = 'Close';
        closeBtn.role = 'button';
        mainDiv.appendChild(closeBtn);

        document.getElementById('chatProfile').appendChild(mainDiv);

        document.getElementById('chat-messages-general').classList.add('unvisible');
        document.getElementById('chatProfile').classList.remove('unvisible');

        mute_icon.addEventListener('click', function() {

            if (mute_icon.classList.contains('text-secondary')) {

                mute_icon.classList.remove('text-secondary');
                mute_icon.classList.remove('text-opacity-50');
                mute_icon.classList.add('text-success');
                unMute_icon.classList.add('text-secondary');
                unMute_icon.classList.add('text-opacity-50');
                unMute_icon.classList.remove('text-success');

                mutedFriends.push(username);
            }
        })

        unMute_icon.addEventListener('click', function() {

            if (unMute_icon.classList.contains('text-secondary')) {

                unMute_icon.classList.remove('text-secondary');
                unMute_icon.classList.remove('text-opacity-50');
                unMute_icon.classList.add('text-success');
                mute_icon.classList.add('text-secondary');
                mute_icon.classList.add('text-opacity-50');
                mute_icon.classList.remove('text-success');

                mutedFriends.pop(username);
            }
        })

        inviteIcon.addEventListener('click', function() {

            mainDiv.remove();
            document.getElementById('chat-messages-general').classList.add('unvisible');
            document.getElementById('chatProfile').classList.add('unvisible');
            document.getElementById('mainChat-form').classList.add('unvisible');

            inviteFriendToPlayFromChat_createContent(username);
            input.disabled = false;

        })

        closeBtn.addEventListener('click', function() {

            document.getElementById('chat-messages-general').classList.remove('unvisible');
            document.getElementById('chatProfile').classList.add('unvisible');
            mainDiv.remove();
            const messageContainer = document.getElementById('chat-area');
            messageContainer.scrollTop = messageContainer.scrollHeight;
            input.disabled = false;
        })
    })
}

function inviteFriendToPlayFromChat_createContent(username) {

    const mainDiv = document.createElement('div');
    mainDiv.id = 'inviteToPlayDiv';
    mainDiv.classList = 'col-auto p-3 bg-white  rounded-4 fade-in';
    mainDiv.style.height = '300px';

    const secDiv = document.createElement('div');
    secDiv.id = 'waitingDiv';

    const title = document.createElement('h5');
    title.classList = 'fs-3 pt-3 fw-bold text-info text-capitalize text-center';
    title.textContent = 'Invite ' + username + ' to play !';
    secDiv.appendChild(title);

    const text = document.createElement('h5');
    text.classList = 'fs-5 fw-bold text-secondary text-center mt-3';
    text.textContent = 'Choose dificulty';
    secDiv.appendChild(text);

    const dificultyRow = document.createElement('div');
    dificultyRow.classList = 'row d-flex justify-content-center g-3 mt-4';

    const easyDiv = document.createElement('div');
    easyDiv.classList = 'col-auto';
    const easyBtn = document.createElement('h5');
    easyBtn.classList = 'text-success p-2 shadow rounded-2';
    easyBtn.textContent = 'Easy';
    easyBtn.role = 'button';
    easyDiv.appendChild(easyBtn);
    dificultyRow.appendChild(easyDiv);

    const mediumDiv = document.createElement('div');
    mediumDiv.classList = 'col-auto';
    const mediumBtn = document.createElement('h5');
    mediumBtn.classList = 'text-warning p-2 shadow rounded-2';
    mediumBtn.textContent = 'Medium';
    mediumBtn.role = 'button';
    mediumDiv.appendChild(mediumBtn);
    dificultyRow.appendChild(mediumDiv);

    const hardDiv = document.createElement('div');
    hardDiv.classList = 'col-auto';
    const hardBtn = document.createElement('h5');
    hardBtn.classList = 'text-danger p-2 shadow rounded-2';
    hardBtn.textContent = 'Hard';
    hardBtn.role = 'button';
    hardDiv.appendChild(hardBtn);
    dificultyRow.appendChild(hardDiv);

    secDiv.appendChild(dificultyRow);

    const row = document.createElement('div');
    row.classList = 'row';
    const col = document.createElement('div');
    col.classList = 'col-auto mx-auto mt-4';
    const cancelBtn = document.createElement('h5');
    cancelBtn.id = 'cancelInviteToPlayBtn';
    cancelBtn.classList = 'rounded shadow p-2 text-secondary text-center';
    cancelBtn.role = 'button';
    cancelBtn.textContent = 'Cancel';
    col.appendChild(cancelBtn);
    row.appendChild(col);
    secDiv.appendChild(row);
    mainDiv.appendChild(secDiv);

    document.getElementById('chat-area').appendChild(mainDiv);

    cancelInviteToPlayBtn.addEventListener('click', function() {
        mainDiv.remove();
        document.getElementById('chat-messages-general').classList.remove('unvisible');
        document.getElementById('mainChat-form').classList.remove('unvisible');
        const messageContainer = document.getElementById('chat-area');
        messageContainer.scrollTop = messageContainer.scrollHeight;
    })

    easyBtn.addEventListener('click', function() {
        mainDiv.remove();
       inviteFriendCreateSession_createContent(username, 2);
    })

    mediumBtn.addEventListener('click', function() {
        mainDiv.remove();
       inviteFriendCreateSession_createContent(username, 4);
    })

    hardBtn.addEventListener('click', function() {
        mainDiv.remove();
       inviteFriendCreateSession_createContent(username, 6);
    })
}

function inviteFriendCreateSession_createContent(username, level) {

    const mainDiv = document.createElement('div');
    mainDiv.id = 'inviteToPlayDiv';
    mainDiv.classList = 'col-auto p-3 bg-white  rounded-4 fade-in';
    mainDiv.style.height = '300px';

    const secDiv = document.createElement('div');
    secDiv.id = 'waitingDiv';

    const title = document.createElement('h5');
    title.classList = 'fs-3 pt-5 fw-bold text-info text-center';
    title.textContent = 'Invitation sent !';
    secDiv.appendChild(title);

    const text = document.createElement('h5');
    text.classList = 'fs-5 fw-bold text-secondary text-center';
    text.textContent = 'Please wait for response';
    secDiv.appendChild(text);

    const spinnersDiv = document.createElement('div');
    spinnersDiv.classList = 'col mt-3 d-flex justify-content-center';
    for (let i = 0; i < 3; i++) {
        const div = document.createElement('div');
        div.role = 'status';
        if (i === 1) {
            div.classList = 'spinner-grow spinner-grow-sm text-info mx-2';
        } else {
            div.classList = 'spinner-grow spinner-grow-sm text-info';
        }
        spinnersDiv.appendChild(div);
    }
    secDiv.appendChild(spinnersDiv);

    const row = document.createElement('div');
    row.classList = 'row';
    const col = document.createElement('div');
    col.classList = 'col-auto mx-auto mt-3';
    const cancelBtn = document.createElement('h5');
    cancelBtn.id = 'cancelInviteToPlayBtn';
    cancelBtn.classList = 'rounded shadow p-2 text-warning text-center fs-5';
    cancelBtn.role = 'button';
    cancelBtn.textContent = 'Cancel';
    col.appendChild(cancelBtn);
    row.appendChild(col);
    secDiv.appendChild(row);
    mainDiv.appendChild(secDiv);

    document.getElementById('chat-area').appendChild(mainDiv);

    cancelInviteToPlayBtn.addEventListener('click', function() {
        mainDiv.remove();
        document.getElementById('chat-messages-general').classList.remove('unvisible');
        document.getElementById('mainChat-form').classList.remove('unvisible');
        const messageContainer = document.getElementById('chat-area');
        messageContainer.scrollTop = messageContainer.scrollHeight;
    })

    console.log('Create game : ' + sessionUsername + ' VS ' + username + ' level : ' + level);
    // socket.send(JSON.stringify({ action: 'createSession' }));
}
