socket.addEventListener('message', (event) => {
    const messageContainer = document.getElementById('chat-messages');
    const receivedMessage = JSON.parse(event.data);

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
        
function sendMessageSession() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (message !== '') {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ action: 'sendMessageSession', text: message }));
            messageInput.value = '';
        } else {
            console.warn('La connexion WebSocket n\'est pas encore établie.');
        }
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessageSession();
    }
}
