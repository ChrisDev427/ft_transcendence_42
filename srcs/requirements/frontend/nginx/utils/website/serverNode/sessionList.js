
function updateSessionsList(sessions) {
    const sessionsListElement = document.getElementById('sessionsList');
    sessionsListElement.innerHTML = '';

    sessions.forEach(session => {
        const sessionLink = document.createElement('a');
        sessionLink.href = `https://transcendence42.ddns.net/#playPong`;
        sessionLink.textContent = `Session ID: ${session.id}, Created At: ${session.createdAt}, By : ${session.CreatorUsername}, level: ${session.level}`;
        sessionLink.addEventListener('click', () => {

            socket.send(JSON.stringify({ action: 'join', sessionId: session.id, username:session, level:session.level, paddleHeight: session.paddleHeight}));
            leftPlayerName =session.CreatorUsername;            
            rightPlayerName=sessionUsername;
            
            level = session.level;
            paddleHeight = session.paddleHeight;

            console.log("leveltr:", paddleHeight);
            
            
            // playOnline = true;
            start = true;
            
            setPlayerNameToPrint(leftPlayerName, rightPlayerName);
            
            // setHandToStart();
            leftPaddleHand = true;

            printConsoleInfos();
            
            showSection("playPong");
            document.getElementById('gameDiv').classList.remove('hidden-element');
            console.log("testestest : ",session.CreatorUsername);

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

