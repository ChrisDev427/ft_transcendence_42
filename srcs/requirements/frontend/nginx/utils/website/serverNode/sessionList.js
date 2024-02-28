
function updateSessionsList(sessions) {
    const sessionsListElement = document.getElementById('sessionsList');
    sessionsListElement.innerHTML = '';

    sessions.forEach(session => {
        const sessionLink = document.createElement('a');
        sessionLink.href = domainPath + `/#playPong`;
        sessionLink.textContent = `Session ID: ${session.id}, Created At: ${session.createdAt}, By : ${session.CreatorUsername}`;
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

