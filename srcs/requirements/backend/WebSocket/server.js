const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const server = https.createServer({
    cert: fs.readFileSync('certificate.crt'),
    key: fs.readFileSync('private.key'),
});


class Session {
    constructor(sessionId, createdAt, ip, level, paddleHeight, user_id, username) {
        this.sessionId = sessionId;
        this.createdAt = createdAt;
        this.ip = ip
        this.level = level;
        this.paddleHeight = paddleHeight;
        this.user_id = user_id;
        this.username = username;
        
    }
}

const wss = new WebSocket.Server({ noServer: true });

const MAX_MESSAGES = 10;
const sessions = [];
const connectedUsersBySession = {};
const messageHistoryBySession = {};
const messageHistory = [];


wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const id = urlParams.get('username');

    ws.userId = id;
    ws.sessionId = getSessionIdByUserId(ws.userId);
    console.log(`Client connected : ${ws.userId}`);

    // envoie des donnees au nouveau client
    const latestMessages = messageHistory.slice(-MAX_MESSAGES);
    ws.send(JSON.stringify({ type: 'messageGeneral', messages: latestMessages }));

    const latestsessions = sessions.map(session => ({
        id: session.sessionId,
        createdAt: session.createdAt.toISOString(),
        level: session.level,
        paddleHeight: session.paddleHeight,
        user_id: session.user_id,
        username: session.username,
    }));
    ws.send(JSON.stringify({ action: 'updateSessions', sessions: latestsessions }));


    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            const username = ws.userId;
            const sessionId = getSessionIdByUserId(ws.userId);

            if (data.action === 'sendMessage') {
                const text = data.text;
                console.log(text);
                broadcastMessage({ action: 'receiveMessage', username, text });
            }

            if (data.action === 'sendMessageSession') {
                const text = data.text;

                console.log(text);
                console.log(sessionId);

                console.log(connectedUsersBySession);
                broadcastMessageSession({ action: 'receiveMessage', username, text }, sessionId);
            }

            // reception de demande de creation de session
            if (data.action === 'createSession') {
                if (isUserAlreadyConnected(username, data.sessionId)) {
                    console.log(`${username} est deja connecte a une session`);

                } else {
                    
                    const sessionId = uuidv4();
                    const session = new Session(sessionId, new Date(), username, data.level, data.paddleHeight, data.id, data.username);
                    sessions.push(session);

                    console.log(`${username} Session created :`, sessionId, data.level, data.paddleHeight, data.id, data.username);
                    
                    connectedUsersBySession[sessionId] = [];
                    connectedUsersBySession[sessionId].push(username);
                    console.log(`${username} join session!`, sessionId);
                    ws.sessionId = sessionId;
                    // getSessionIdByUserId(username);

                    console.log(connectedUsersBySession);

                    ws.send(JSON.stringify({ action: 'sessionCreated', sessionId }));
                    
                    // envoie a tout les utilisateurs
                    broadcastSessions();
                }
                

            } if (data.action === 'updatePaddlePositions') {
                const { leftPaddleY, rightPaddleY } = data;
            
                const ID = Object.keys(connectedUsersBySession).find(sessionId =>
                    connectedUsersBySession[sessionId].includes(username)
                );
                const sessionId = ID ? ID : "Unknown Session";
                

                // console.log(`UserID: ${ip}`);
                // console.log(`Session ID: ${sessionId}`);
                // console.log('Left Paddle Y:', leftPaddleY);
                // console.log('Right Paddle Y:', rightPaddleY);

            } else if (data.action === 'quitSession') {
                userLeaveSession(username);
                console.log(`${username} Client quit the session`, data.sessionId);
                
            } else if (data.action === 'join') {
                
            
                if (isUserAlreadyConnected(username, data.sessionId)) {
                    console.log(`${username} est deja connecte a une session`);
                    

                } else {
                    // Ajout de l'utilisateur à la liste des utilisateurs connectés à la session
                    if (connectedUsersBySession[data.sessionId]) {
                        connectedUsersBySession[data.sessionId].push(username);
                        console.log(`${data.username} join session!`, data.sessionId);
                        ws.sessionId = data.sessionId;
                        // getSessionIdByUserId(username);
                        const sessionMessageHistory = messageHistoryBySession[data.sessionId] || [];
                        ws.send(JSON.stringify({ type: "messageSession", messages: sessionMessageHistory }));
                
                        console.log(connectedUsersBySession);
                    }

                }
            }

        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        const username = ws.userId;
        userLeaveSession(username);
        console.log(connectedUsersBySession);
        console.log(`Client disconnected : ${username}`);
    });
});

function broadcastMessageSession(message, sessionId) {
    if (!messageHistoryBySession[sessionId]) {
        messageHistoryBySession[sessionId] = [];
    }

    messageHistoryBySession[sessionId].push(message);
    if (messageHistoryBySession[sessionId].length > MAX_MESSAGES) {
        messageHistoryBySession[sessionId].shift();
    }
    const latestMessages = messageHistoryBySession[sessionId];
    wss.clients.forEach(client => {
        const clientSessionId = getSessionIdByUserId(client.userId);
        
        if (client.readyState === WebSocket.OPEN && clientSessionId === sessionId) {
            console.log(clientSessionId)
            client.send(JSON.stringify({ type: "messageSession", messages: latestMessages }));
            // client.send(JSON.stringify({ type: "messageGeneral", messages: latestMessages }));
        }
    });

    // wss.clients.forEach(client => {
    //     if (client.readyState === WebSocket.OPEN) {
    //         console.log(client)
    //         client.send(JSON.stringify({ type: "messageSession", messages: latestMessages }));
    //     }
    // });


}



function getSessionIdByUserId(userId) {
    for (const sessionId in connectedUsersBySession) {
        if (connectedUsersBySession[sessionId].includes(userId)) {
            return sessionId;
        }
    }
    return null;
}



function isUserAlreadyConnected(userId, sessionId) {
    // Vérifier si l'utilisateur est déjà connecté à la session spécifiée
    if (connectedUsersBySession[sessionId] && connectedUsersBySession[sessionId].includes(userId)) {
        return true;
    }
    // Vérifier si l'utilisateur est déjà connecté à une autre session
    for (const session in connectedUsersBySession) {
        if (session !== sessionId && connectedUsersBySession[session].includes(userId)) {
            return true;
        }
    }
    return false;
}


function userLeaveSession(sessionId) {
    // const sessionIndex = sessions.findIndex(session => session.sessionId === sessionId);

    // const removedSession = sessions.splice(sessionIndex, 1)[0];
    
    // const index = connectedUsersBySession[sessionId].indexOf('yu');
    // if (index !== -1) {
    //     connectedUsersBySession[sessionId].splice(index, 1);
    // }

    delete messageHistoryBySession[sessionId];
    delete connectedUsersBySession[sessionId];
    // console.log("test : ", sessionIndex)
    broadcastSessions();

    console.log(connectedUsersBySession);
    console.log(sessions);
}


// envoie des messages du general
function broadcastMessage(message) {
    messageHistory.push(message);
    if (messageHistory.length > MAX_MESSAGES) {
        messageHistory.shift();
    }
    const latestMessages = messageHistory.slice(-MAX_MESSAGES);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "messageGeneral", messages: latestMessages }));
        }
    });
}


// envoyer les sessions à tous les clients
function broadcastSessions() {
    const sessionsData = sessions.map(session => ({
        id: session.sessionId,
        createdAt: session.createdAt.toISOString(),
        level: session.level,
        paddleHeight: session.paddleHeight,
        user_id: session.user_id,
        username: session.username,
    }));
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            console.log(sessionsData)
            client.send(JSON.stringify({ action: 'updateSessions', sessions: sessionsData }));
        }
    });
}

// setInterval(() => {
//     broadcastSessions();
// }, 5000);



server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

const port = 90;

server.listen(port, '0.0.0.0', () => {
    console.log(`Serveur WebSocket écoutant sur le port ${port}`);
});
