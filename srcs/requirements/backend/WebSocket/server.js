const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
    // Gérer les requêtes HTTP ici si nécessaire
});

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, req) => {
    console.log('Client connected');

    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send('bonjour');
        }
    }, 1000);

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

const port = 90;

server.listen(port, '0.0.0.0', () => {
    console.log(`Serveur WebSocket écoutantt sur le port ${port}`);
});