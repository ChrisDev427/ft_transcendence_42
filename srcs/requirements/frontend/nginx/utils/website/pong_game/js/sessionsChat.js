 
// function sendMessageSession() {
//     const messageInput = document.getElementById('message-input_session');
//     const message = messageInput.value.trim();

//     if (message !== '') {
//         if (socket.readyState === WebSocket.OPEN) {
//             console.log(message);
//             console.log(sessionId);
//             socket.send(JSON.stringify({ messageType: 'sendMessageSession', message: message, sessionId: sessionId}));
//             messageInput.value = '';
//         } else {
//             console.warn('La connexion WebSocket n\'est pas encore établie.');
//         }
//     }
// }

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessageSession();
    }
}
