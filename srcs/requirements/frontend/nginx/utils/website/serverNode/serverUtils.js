// let socket;

// function waitForWebSocketConnection(username) {
//     return new Promise((resolve, reject) => {
//         // Connexion au WebSocket
//         if (!socket || socket.readyState !== WebSocket.OPEN)
//             socket = new WebSocket('ws://localhost:8000/api/ws/general/?user_username=' + username);

//         socket.onopen = (event) => {
//             console.log('Connexion WebSocket ouverte :', event);
//             resolve(socket);
//             socket.send(JSON.stringify({
//                 'messageType': 'online',
//                 'owner': username,
//                 'message' : ""
//             }));
//         };

//         socket.onmessage = (event) => {
//             const message = JSON.parse(event.data);
//             console.log('Message WebSocket reçu :', message);

//             // Traitement du message reçu selon son type
//             handleMessage(message);
//         };

//         socket.onclose = (event) => {
//             console.log('Connexion WebSocket fermée :', event);
//             reject(new Error('Connexion WebSocket fermée'));
//         };

//         socket.onerror = (error) => {
//             console.error('Erreur WebSocket :', error);
//             reject(error);
//         };


//     });
// }

// function handleMessage(message) {
//     // Traitement du message reçu selon son type
//     // switch (message.type) {
//     //     case 'messageGeneral':
//     displayGeneralMessage(message);
//             // break;
//         // Ajoutez d'autres cas de traitement pour les différents types de messages si nécessaire
//         // default:
//             // console.log('Type de message non géré :', message.type);
//     // }
// }

// function displayGeneralMessage(message) {
//     const messageContainer = document.getElementById('chat-area');
//     if (message.messageType === 'classic')
//         messageContainer.innerHTML += `<div><strong>${message.owner}:</strong> ${message.message}</div>`;
//     else if (message.messageType === 'online')
//         messageContainer.innerHTML += `<div>${message.owner} is connected</div>`;
//     else if (message.messageType === 'offline')
//         messageContainer.innerHTML += `<div>${message.owner} is disconnected</div>`;
//     messageContainer.scrollTop = messageContainer.scrollHeight;
// }

// // function sendMessage(message) {
// //     if (socket.readyState === WebSocket.OPEN) {
// //         socket.send(JSON.stringify(message));
// //     } else {
// //         console.error('La connexion WebSocket n\'est pas ouverte.');
// //     }
// // }

// // Appel de la fonction pour se connecter au WebSocket
// // waitForWebSocketConnection()
// //     .then((socket) => {
// //         console.log('Connexion au WebSocket établie avec succès');

// //         // Vous pouvez envoyer des messages au serveur WebSocket si nécessaire
// //         // Exemple :
// //         sendMessage({ type: 'message', content: 'Hello, World!' });
// //     })
// //     .catch((error) => {
// //         console.error('Une erreur s\'est produite lors de la connexion WebSocket:', error);
// //     });


let socket;
let chatInit = false;

function waitForWebSocketConnection(username) {
    return new Promise((resolve, reject) => {
        if (!socket || socket.readyState !== WebSocket.OPEN)
                     socket = new WebSocket('ws://localhost:8000/ws/general/?user_username=' + username);

        socket.addEventListener('open', () => {
            console.log('Connected to WebSocket server');
            resolve(socket);
            socket.send(JSON.stringify({
                'messageType': 'online',
                'owner': username,
                'message' : "",
                'time' : new Date().toLocaleTimeString(),
            }));
            // chatGeneral_createContent(username, "is connected", new Date().toLocaleTimeString(), "online");
        });

        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
            reject(error);
        });

        socket.addEventListener('close', (event) => {
            console.log('WebSocket connection closed');
            reject(new Error('WebSocket connection closed'));
        });
    })
.then((socket) => {
    console.log('WebSocket connection is ready');


    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'updateSessions') {
            console.log('Updating sessions list...');
            console.log(data.sessions);
            updateSessionsList(data.sessions);
        }
    });
    




    socket.addEventListener('message', (event) => {
        const receivedMessage = JSON.parse(event.data);
        // if (receivedMessage.messageType === 'classic') {
            // const messages = receivedMessage.message;
            // console.log("message receive")
            // console.log(messages)
            // let messagesToDisplay;
            // if (!chatInit) {
            //     messagesToDisplay = messages.slice(-10);
            // } else {
            //     messagesToDisplay = messages.slice(-1);
            // }
            // messagesToDisplay.forEach(msg => {

            chatGeneral_createContent(receivedMessage.owner, receivedMessage.message, receivedMessage.time, receivedMessage.messageType);
            // });
            const messageContainer = document.getElementById('chat-area');
            messageContainer.scrollTop = messageContainer.scrollHeight;
        // }
        chatInit = true;
    });




    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'positionBall') {
            // console.log("positionBall : ", data.ballX, data.ballY);
            ballX = data.ballX;
            ballY = data.ballY;
        }
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'values') {
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
        if (data.messageType === 'position') {
            
            
            // console.log( data.pos, data.cote);
            if (data.cote == "left"){
                leftPaddleY = data.pos;
            }
            else{
                rightPaddleY = data.pos;
            }
        }
    });


    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        if (data.messageType === 'confirmJoin') {
            console.log(data.username, "a rejoind la session");
            console.log(data.username, "a rejoind la session", data.level);
            leftPlayerName =sessionUsername;
            rightPlayerName=data.username;


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



    // socket.addEventListener('message', (event) => {
    //     const messageContainer = document.getElementById('chat-messages_session');
    //     const receivedMessage = JSON.parse(event.data);
    //     console.log(receivedMessage)

    //     if (receivedMessage.type === 'messageSession') {
    //         console.log("salut");
    //         const messages = receivedMessage.messages || [];
    //         const messagesToDisplay = messages.slice(-10);
    //         messageContainer.innerHTML = '';
    //         messagesToDisplay.forEach(msg => {
    //             messageContainer.innerHTML += `<div><strong>${msg.username}:</strong> ${msg.text}</div>`;
    //         });
    //         messageContainer.scrollTop = messageContainer.scrollHeight;
    //     }
    // });
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