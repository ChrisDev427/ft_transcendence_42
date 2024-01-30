const WebSocket = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const server = http.createServer((req, res) => {

});

const wss = new WebSocket.Server({ noServer: true });
const sessions = [];

wss.on('connection', (ws, req) => {
    const ip = req.connection.remoteAddress;    // Gérer les requêtes HTTP ici si nécessaire

    console.log(`Client connected from IP: ${ip}`);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            const ip = req.connection.remoteAddress;
            console.log(`Client connected from IP: ${ip}`);
            
            if (data.action === 'createSession') {
                
                const sessionId = uuidv4();
                sessions.push({ id: sessionId, createdAt: new Date() });
                console.log(`${ip} Session created :`, sessionId);
                broadcastSessions();
                        
            } else if (data.action === 'quitSession') {
                console.log(`${ip} Client quit the session`, data.sessionId);
                
            } else if (data.action === 'join') {
                console.log(`${ip} join session!`, data.sessionId);
            

            }

        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected from IP: ${ip}`);
    });
});

// envoyer les sessions à tous les clients
function broadcastSessions() {
    const sessionsData = sessions.map(session => ({
        id: session.id,
        createdAt: session.createdAt.toISOString(),
    }));

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ action: 'updateSessions', sessions: sessionsData }));
        }
    });
}

setInterval(() => {
    broadcastSessions();
}, 5000);

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

const port = 90;

server.listen(port, '0.0.0.0', () => {
    console.log(`Serveur WebSocket écoutant sur le port ${port}`);
});