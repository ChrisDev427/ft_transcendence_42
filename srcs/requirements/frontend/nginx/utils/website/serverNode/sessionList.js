
function updateSessionsList(sessions) {
    // const sessionsListElement = document.getElementById('sessionsList');
    // sessionsListElement.innerHTML = '';

    let index = 1;
    sessions.forEach(session => {
        sessions_createContent(session, index);
        index++;
        // const sessionLink = document.createElement('a');
        // // sessionLink.href = `https://transcendence42.ddns.net/#playPong`;
        // sessionLink.href = '#playPong';
        // sessionLink.textContent = `Session ID: ${session.id}, Created At: ${session.createdAt}, By : ${session.CreatorUsername}`;
        // sessionLink.addEventListener('click', () => {

        //     socket.send(JSON.stringify({ action: 'join', sessionId: session.id, username:session }));

        //     leftPlayerName ="test";
        //     rightPlayerName="test1";

        //     level = 5;
        //     playOnline = true;
        //     twoPlayers = true;
        //     start = true;

        //     setPlayerNameToPrint(leftPlayerName, rightPlayerName);
        //     setHandToStart();
        //     printConsoleInfos();

        //     showSection("playPong");
        //     document.getElementById('gameDiv').classList.remove('hidden-element');
        //     run();

        // });

        // const sessionElement = document.createElement('p');
        // sessionElement.appendChild(sessionLink);

        // sessionsListElement.appendChild(sessionElement);
    });

    console.log('Updated sessions list:', sessions);
}

document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        const match = hash.match(/^#playPong\/([a-zA-Z0-9-]+)$/);

        if (match) {
            const sessionId = match[1];
            console.log('Joining session with ID:', sessionId);
        }
    });
});

function  sessions_createContent(session, index) {

    document.getElementById('sessionListeEmpty').classList.add('hidden-element');

    const div = document.createElement('div');
    div.id = 'joinCard' + index;
    div.classList = 'col-auto m-2 p-3 rounded-4 shadow';

    const title = document.createElement('h5');
    title.classList = 'fs-3 fw-bold text-info text-center';
    title.textContent = 'Room ' + index;
    div.appendChild(title);

    const creator = document.createElement('h5');
    creator.classList = 'fs-5 fw-bold text-secondary text-center';
    creator.textContent = 'Creator : ' + session.CreatorUsername;
    div.appendChild(creator);

    const level = document.createElement('h5');
    level.classList = 'fs-5 fw-bold text-secondary text-center';
    level.textContent = 'Level : ' + session.level;
    div.appendChild(level);

    const joinBtn = document.createElement('h5');
    joinBtn.id = 'joinRoomBtn';
    joinBtn.classList = 'fs-3 fw-bold text-success text-center';
    joinBtn.textContent = 'Play !';
    joinBtn.role = 'button';
    div.appendChild(joinBtn);

    document.getElementById('sessionsList').appendChild(div);

    joinBtn.addEventListener('click', function() {
        joinSession(session, index);
    })


}

function joinSession(session, index) {

    socket.send(JSON.stringify({ action: 'join', sessionId: session.id, username:session }));

    leftPlayerName = session.CreatorUsername;
    rightPlayerName= sessionUsername;
    level = session.level;
    playOnline = true;
    twoPlayers = true;
    start = true
    setPlayerNameToPrint(leftPlayerName, rightPlayerName);
    printConsoleInfos();
    showSection("playPong");
    document.getElementById('gameDiv').classList.remove('hidden-element');
    run();

    document.getElementById('joinCard' + index).remove();
    if (document.getElementById('sessionsList').childElementCount == 0 ) {
        document.getElementById('sessionListeEmpty').classList.remove('hidden-element');
    }
}