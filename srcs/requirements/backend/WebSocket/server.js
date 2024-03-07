const WebSocket = require('ws');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let server;

if (process.env.SITE_URL === 'http://localhost') {
    const http = require('http');
    server = http.createServer();
    var local = true;
} else {
    const https = require('https');
    server = https.createServer({
        cert: fs.readFileSync('certificate.crt'),
        key: fs.readFileSync('private.key'),
    });
}

const fetch = require('node-fetch');



class Session {
    constructor(sessionId, createdAt, CreatorUsername) {
        this.sessionId = sessionId;
        this.createdAt = createdAt;
        this.CreatorUsername = CreatorUsername;
    }
}

const wss = new WebSocket.Server({ noServer: true });

const MAX_MESSAGES = 10;
const sessions = [];
const connectedUsersBySession = {};
const messageHistoryBySession = {};
const messageHistory = [];

// var fetch = require("node-fetch");
// import fetch from 'node-fetch';
// const http = require('node:http');



function UserConnexion(token, local) {
    return new Promise(async (resolve, reject) => {
        try {
            let response;
            if (local)
            {
                response = await fetch("http://django_container:8000/api/account/profile/", {
                    method: 'GET',
                    headers: {
                        Host: "localhost",
                        Authorization: "Bearer " + token,
                    },
                });
            }
            else
            {
                response = await fetch("https://transcendence42.ddns.net/api/account/profile/", {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });
            }
            if (response.status === 200) {
                console.log('login success');
                const data = await response.json();
                resolve(data);
            } else {
                console.error('Authentication failed : ' + response.status);
                const data = await response.json();
                console.log('Response data:', data);
                reject(new Error('Authentication failed'));
            }
        } catch (error) {
            console.error(error);
            // alert_login_fail(error);
            reject(error);
        }
    });
}

wss.on('connection', async (ws, req) => {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const token = urlParams.get('token');

    // User connexion
    const test = await UserConnexion(token, local);
    ws.userId = test.user.username;




    ws.sessionId = getSessionIdByUserId(ws.userId);
    console.log(`Client connected : ${ws.userId}`);

    // envoie des donnees au nouveau client
    const latestMessages = messageHistory.slice(-MAX_MESSAGES);
    ws.send(JSON.stringify({ type: 'messageGeneral', messages: latestMessages }));

    const latestsessions = sessions.map(session => ({
        id: session.sessionId,
        createdAt: session.createdAt.toISOString(),
        CreatorUsername: session.CreatorUsername,
    }));
    ws.send(JSON.stringify({ action: 'updateSessions', sessions: latestsessions }));


    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            const username = ws.userId;
            const sessionId = getSessionIdByUserId(ws.userId);

            // chat general
            if (data.action === 'sendMessage') {
                const text = data.text;
                console.log(text);
                const time = getTime();
                broadcastMessage({ action: 'receiveMessage', username, text, time });
            }

            // chat session
            if (data.action === 'sendMessageSession') {
                const text = data.text;
                broadcastMessageSession({ action: 'receiveMessage', username, text,  }, sessionId);
            }

            // reception de demande de creation de session
            if (data.action === 'createSession') {
                if (isUserAlreadyConnected(username, data.sessionId)) {
                    console.log(`${username} est deja connecte a une session`);

                } else {
                    const sessionId = uuidv4();
                    const session = new Session(sessionId, new Date(), username);
                    sessions.push(session);
                    console.log(`Session created :`, sessionId, username);

                    connectedUsersBySession[sessionId] = [];
                    connectedUsersBySession[sessionId].push(username);
                    console.log(`${username} join session!`, sessionId);
                    ws.sessionId = sessionId;

                    console.log(connectedUsersBySession);
                    ws.send(JSON.stringify({ action: 'sessionCreated', sessionId }));
                    broadcastSessions();
                }
            }

            if (data.action === 'updatePaddlePositions') {
                const { leftPaddleY, rightPaddleY } = data;

                const ID = Object.keys(connectedUsersBySession).find(sessionId =>
                    connectedUsersBySession[sessionId].includes(username)
                );
                const sessionId = ID ? ID : "Unknown Session";

                console.log("session ",sessionId, leftPaddleY, rightPaddleY)

                // console.log(`UserID: ${username}`);
                // console.log(`Session ID: ${sessionId}`);
                // console.log('Left Paddle Y:', leftPaddleY);
                // console.log('Right Paddle Y:', rightPaddleY);

            }

            else if (data.action === 'quitSession') {
                userLeaveSession(username);
                console.log(`${username} Client quit the session`, data.sessionId);
            }

            else if (data.action === 'join') {
                if (isUserAlreadyConnected(username, data.sessionId)) {
                    console.log(`${username} est deja connecte a une session`);

                } else {
                    // Ajout de l'utilisateur à la liste des utilisateurs connectés à la session
                    if (connectedUsersBySession[data.sessionId]) {
                        connectedUsersBySession[data.sessionId].push(username);
                        console.log(username,` join session!`, data.sessionId);
                        ws.sessionId = data.sessionId;

                        const sessionMessageHistory = messageHistoryBySession[data.sessionId] || [];
                        ws.send(JSON.stringify({ type: "messageSession", messages: sessionMessageHistory }));

                        sessionconf(ws.userId, data.sessionId);
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
        userLeaveSession(ws.sessionId, username);
        console.log(`Client disconnected : ${username}`);
    });
});



function sessionconf(username, sessionId){
    for (const client of wss.clients) {
        const clientSessionId = getSessionIdByUserId(client.userId);
        if (client.readyState === WebSocket.OPEN && clientSessionId === sessionId) {
            const response = client.send(JSON.stringify({ action: 'confirmJoin', username }));
        }
    }
}



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
            client.send(JSON.stringify({ type: "messageSession", messages: latestMessages }));
        }
    });
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
    if (connectedUsersBySession[sessionId] && connectedUsersBySession[sessionId].includes(userId)) {
        return true;
    }
    for (const session in connectedUsersBySession) {
        if (session !== sessionId && connectedUsersBySession[session].includes(userId)) {
            return true;
        }
    }
    return false;
}


function userLeaveSession(sessionId, username) {

    if (connectedUsersBySession[sessionId]){

        const indexToRemove = connectedUsersBySession[sessionId].indexOf(username);

        if (indexToRemove !== -1) {
            connectedUsersBySession[sessionId].splice(indexToRemove, 1);

            // Supprimer la session si elle est vide
            if (connectedUsersBySession[sessionId].length === 0) {
                delete connectedUsersBySession[sessionId];
                if (messageHistoryBySession[sessionId])
                    delete messageHistoryBySession[sessionId];
                const indexSessions = sessions.findIndex(session => session.sessionId === sessionId);

                if (indexSessions !== -1) {
                    sessions.splice(indexSessions, 1);
                }
            }
        }
    }
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
        CreatorUsername: session.CreatorUsername
    }));
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
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

const port = 9000;

server.listen(port, '0.0.0.0', () => {
    console.log(`Serveur WebSocket écoutant sur le port ${port}`);
});

function getTime() {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const dateTimeString = `${hours}:${minutes}:${seconds}`;

    return dateTimeString;
}