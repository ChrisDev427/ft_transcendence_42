let socket;

function waitForWebSocketConnection(username) {
    return new Promise((resolve, reject) => {
        // Connexion au WebSocket
        if (!socket || socket.readyState !== WebSocket.OPEN)
            socket = new WebSocket('ws://localhost:8000/api/ws/general/?user_username=' + username);

        socket.onopen = (event) => {
            console.log('Connexion WebSocket ouverte :', event);
            resolve(socket);
            socket.send(JSON.stringify({
                'messageType': 'online',
                'owner': username,
                'message' : ""
            }));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Message WebSocket reçu :', message);

            // Traitement du message reçu selon son type
            handleMessage(message);
        };

        socket.onclose = (event) => {
            console.log('Connexion WebSocket fermée :', event);
            reject(new Error('Connexion WebSocket fermée'));
        };

        socket.onerror = (error) => {
            console.error('Erreur WebSocket :', error);
            reject(error);
        };
    });
}

function handleMessage(message) {
    // Traitement du message reçu selon son type
    // switch (message.type) {
    //     case 'messageGeneral':
    displayGeneralMessage(message);
            // break;
        // Ajoutez d'autres cas de traitement pour les différents types de messages si nécessaire
        // default:
            // console.log('Type de message non géré :', message.type);
    // }
}

function displayGeneralMessage(message) {
    const messageContainer = document.getElementById('chat-area');
    if (message.messageType === 'classic')
        messageContainer.innerHTML += `<div><strong>${message.owner}:</strong> ${message.message}</div>`;
    else if (message.messageType === 'online')
        messageContainer.innerHTML += `<div>${message.owner} is connected</div>`;
    else if (message.messageType === 'offline')
        messageContainer.innerHTML += `<div>${message.owner} is disconnected</div>`;
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// function sendMessage(message) {
//     if (socket.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify(message));
//     } else {
//         console.error('La connexion WebSocket n\'est pas ouverte.');
//     }
// }

// Appel de la fonction pour se connecter au WebSocket
// waitForWebSocketConnection()
//     .then((socket) => {
//         console.log('Connexion au WebSocket établie avec succès');

//         // Vous pouvez envoyer des messages au serveur WebSocket si nécessaire
//         // Exemple :
//         sendMessage({ type: 'message', content: 'Hello, World!' });
//     })
//     .catch((error) => {
//         console.error('Une erreur s\'est produite lors de la connexion WebSocket:', error);
//     });
