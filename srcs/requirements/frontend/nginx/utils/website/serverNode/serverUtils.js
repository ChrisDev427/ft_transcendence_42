
let socket;

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


function waitForWebSocketConnection(sessionUsername) {
    return new Promise((resolve, reject) => {
        socket = new WebSocket(`wss://transcendence42.ddns.net:90?username=${sessionUsername}`);

        socket.addEventListener('open', () => {
            console.log('Connected to WebSocket server');
            resolve(socket);
        });

        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
            reject(error);
        });

        socket.addEventListener('close', (event) => {
            console.log('WebSocket connection closed');
            reject(new Error('WebSocket connection closed'));
        });
    });
}


waitForWebSocketConnection().then((socket) => {
    console.log('WebSocket connection is ready');
        
    
    socket.addEventListener('message', (event) => {    
        const data = JSON.parse(event.data);
        console.log(data.action);
        if (data.action === 'updateSessions') {
            console.log('Updating sessions list...');
            updateSessionsList(data.sessions);
        } else if (data.action === 'join') {
            console.log('Joining session with ID:', data.sessionId , data.userame);              }
    });
    
    socket.addEventListener('message', (event) => {
        try {
            const data = JSON.parse(event.data);

            if (data.action === 'sessionCreated') {
                const sessionId = data.sessionId;
                console.log(sessionId);
                
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });


    socket.addEventListener('message', (event) => {
        const messageContainer = document.getElementById('chat-messages-general');
        const receivedMessage = JSON.parse(event.data);
        if (receivedMessage.type === 'messageGeneral') {
            const messages = receivedMessage.messages || [];
            const messagesToDisplay = messages.slice(-10);
            messageContainer.innerHTML = '';
            messagesToDisplay.forEach(msg => {
                messageContainer.innerHTML += `<div><strong>${msg.username}:</strong> ${msg.text}</div>`;
            });
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        if (data.action === 'confirmJoin') {
            console.log(data.username, "a rejoind la session");
            
        }
    });
    
    socket.addEventListener('message', (event) => {
        const messageContainer = document.getElementById('chat-messages_session');
        const receivedMessage = JSON.parse(event.data);
        console.log(receivedMessage)
        
        if (receivedMessage.type === 'messageSession') {
            console.log("salut");
            const messages = receivedMessage.messages || [];
            const messagesToDisplay = messages.slice(-10);
            messageContainer.innerHTML = '';
            messagesToDisplay.forEach(msg => {
                messageContainer.innerHTML += `<div><strong>${msg.username}:</strong> ${msg.text}</div>`;
            });
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    });


}).catch((error) => {
    console.error('Une erreur s\'est produite lors de la connexion WebSocket:', error);
});