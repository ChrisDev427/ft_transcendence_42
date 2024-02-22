
function init_socket(){
    const socket = new WebSocket('wss://transcendence42.ddns.net:90');
    
    socket.addEventListener('open', (event) => {
        console.log('Connected to WebSocket server');
        socket.send(sessionUsername);
    });
    socket.addEventListener('close', (event) => {
        console.log('Connection closed');
    });
}

