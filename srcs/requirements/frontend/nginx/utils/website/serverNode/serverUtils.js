
let socket;
let chatInit = false;

function waitForWebSocketConnection(token) {
    return new Promise((resolve, reject) => {
        // socket = new WebSocket(`wss://transcendence42.ddns.net:90?token=${token}`);

        socket = new WebSocket('ws://localhost:8000'
        + '/api/ws/'
        + roomName
        + '/');

        socket.onopen = (event) => {
            console.log('Connexion WebSocket ouverte :', event);
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Message WebSocket reçu :', message);
        };

        socket.onclose = (event) => {
            console.log('Connexion WebSocket fermée :', event);
        };




        // socket.addEventListener('open', () => {
        //     console.log('Connected to WebSocket server');
        //     resolve(socket);
        // });

        // socket.addEventListener('error', (error) => {
        //     console.error('WebSocket error:', error);
        //     reject(error);
        // });

        // socket.addEventListener('close', (event) => {
        //     console.log('WebSocket connection closed');
        //     reject(new Error('WebSocket connection closed'));
        // });
    })
.then((socket) => {
    console.log('WebSocket connection is ready');


    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.action === 'updateSessions') {
            console.log('Updating sessions list...');
            console.log('ls', data);
            updateSessionsList(data.sessions);
        }
    });

    socket.addEventListener('message', (event) => {
        try {
            const data = JSON.parse(event.data);

            if (data.action === 'sessionCreated') {
                const sessionId = data.sessionId;
                console.log(sessionId, data.level);

            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });


    // socket.addEventListener('message', (event) => {
    //     const data = JSON.parse(event.data);
    //     if (data.type === 'values') {
    //         spaceBarPressed = data.paceBarPressed,
    //         leftPaddleHand = data.leftPaddleHand,
    //         rightPaddleHand = data.rightPaddleHand,
    //         leftPlayerScore = data.leftPlayerScore,
    //         rightPlayerScore = data.rightPlayerScore,
    //         ballLaunched = data.ballLaunched
    //     }
    // });
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'values') {
            spaceBarPressed = data.spaceBarPressed,
            leftPaddleHand = data.leftPaddleHand,
            rightPaddleHand = data.rightPaddleHand,
            leftPlayerScore = data.leftPlayerScore,
            rightPlayerScore = data.rightPlayerScore,
            ballLaunched = data.ballLaunched
        }
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'position') {
            console.log(data.messages, data.messages, data.user , data.cote);
            if (data.cote == "left"){
                leftPaddleY = data.messages;
            }
            else{
                rightPaddleY = data.messages;
            }
        }
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'spacePress') {
            spaceBarPressed = true;
            console.log("chriss spacebar");
            // ballLaunched = true;
        }
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'positionBall') {
            // console.log("positionBall : ", data.ballX, data.ballY);
            ballX = data.ballX;
            ballY = data.ballY;
        }
    });

    socket.addEventListener('message', (event) => {
        const receivedMessage = JSON.parse(event.data);
        if (receivedMessage.type === 'messageGeneral') {
            const messages = receivedMessage.messages;
            console.log(messages)
            let messagesToDisplay;
            if (!chatInit) {
                messagesToDisplay = messages.slice(-10);
            } else {
                messagesToDisplay = messages.slice(-1);
            }
            messagesToDisplay.forEach(msg => {

                chatGeneral_createContent(msg.username, msg.text, msg.time);
            });
            const messageContainer = document.getElementById('chat-area');
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
        chatInit = true;
    });


    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        if (data.action === 'confirmJoin') {
            console.log(data.username, "a rejoind la session", data.level);
            leftPlayerName =sessionUsername;
            rightPlayerName=data.username;

            // level = data.level;
            // playOnline = true;
            // twoPlayers = true;

            start = true;

            setPlayerNameToPrint(leftPlayerName, rightPlayerName);
            // setHandToStart();
            leftPaddleHand = true;

            printConsoleInfos();

            showSection("playPong");
            document.getElementById('gameDiv').classList.remove('hidden-element');
            run();

            showSection('playPong');
        }
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'reciveInviteSession') {
            console.log("tu as ete invite!\n`Session ID: ", data.session.sessionId,", Created At: ", data.session.createdAt,", By : ", data.session.CreatorUsername);

        }
    });

    socket.addEventListener('message', (event) => {
        const messageContainer = document.getElementById('chat-messages_session');
        const receivedMessage = JSON.parse(event.data);
        // console.log(receivedMessage)

        if (receivedMessage.type === 'messageSession') {
            const messages = receivedMessage.messages || [];
            const messagesToDisplay = messages.slice(-10);
            messageContainer.innerHTML = '';
            messagesToDisplay.forEach(msg => {
                messageContainer.innerHTML += `<div><strong>${msg.username}:</strong> ${msg.text}</div>`;
            });
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    });
})
.catch((error) => {
    console.error('Une erreur s\'est produite lors de la connexion WebSocket:', error);
});
}

// function init_socket() {
//     socket = new WebSocket(`wss://transcendence42.ddns.net:90?username=${sessionUsername}`);

//     socket.addEventListener('open', (event) => {
//         console.log('Connected to WebSocket server', sessionUsername);
//     });

//     socket.addEventListener('close', (event) => {
//         console.log('Connection closed');
//     });

//     return socket;
// }

