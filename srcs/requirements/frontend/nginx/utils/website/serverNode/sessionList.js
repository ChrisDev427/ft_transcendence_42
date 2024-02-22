const socket = new WebSocket('wss://transcendence42.ddns.net:90');

socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server');
    socket.send(sessionUsername);
});

socket.addEventListener('message', (event) => {
    console.log('Message from server:', event.data);

    const data = JSON.parse(event.data);

    if (data.action === 'updateSessions') {
        console.log('Updating sessions list...');
        updateSessionsList(data.sessions);
    } else if (data.action === 'join') {
        console.log('Joining session with ID:', data.sessionId , data.userame);              }
});

socket.addEventListener('close', (event) => {
    console.log('Connection closed');
});

function updateSessionsList(sessions) {
    const sessionsListElement = document.getElementById('sessionsList');
    sessionsListElement.innerHTML = '';

    sessions.forEach(session => {
        const sessionLink = document.createElement('a');
        sessionLink.href = `https://transcendence42.ddns.net/#playPong`;
        sessionLink.textContent = `Session Name: ${session.username}, Created At: ${session.createdAt}`;

        sessionLink.addEventListener('click', () => {

            socket.send(JSON.stringify({ action: 'join', sessionId: session.id, username:session }));
            
            leftPlayerName ="test";
            rightPlayerName="test1";

            level = 5;
            playOnline = true;
            twoPlayers = true;
            start = true;

            setPlayerNameToPrint(leftPlayerName, rightPlayerName);
            setHandToStart();
            printConsoleInfos();
            
            showSection("playPong");
            document.getElementById('gameDiv').classList.remove('hidden-element');
            run();

        });

        const sessionElement = document.createElement('p');
        sessionElement.appendChild(sessionLink);

        sessionsListElement.appendChild(sessionElement);
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

