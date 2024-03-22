


// printConsoleInfos();
// Fonction principale de mise à jour et de rendu

let i = 0;

let gameData = {
    ballX: 0,
    ballY: 0,
    leftPaddleY: 0,
    rightPaddleY: 0,
    spaceBarPressed: false,
    leftPaddleHand: false,
    rightPaddleHand: false,
    leftPlayerScore: 0,
    rightPlayerScore: 0,
    ballLaunched: false,
};

function localRun() {

    if(!start) {
        // if(tournament) {
        //     nextMatch();
        // }
        return;
    }
    serve();
    printGame();
    printInfos();

        if (p_keyPressed && rightPaddleY > 0) {
            rightPaddleY -= level + 1.8;
        } else if (l_keyPressed && rightPaddleY + paddleHeight < canvas.height) {
            rightPaddleY += level + 1.8;
        }
        if(twoPlayers || tournament) {
            if (q_keyPressed && leftPaddleY > 0) {
                leftPaddleY -= level + 1.8;
            } else if (a_keyPressed && leftPaddleY + paddleHeight < canvas.height) {
                leftPaddleY += level + 1.8;
            }
        }

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Bouncing Sides
        if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
            ballSpeedY = -ballSpeedY;
        }

        // Right Paddle Bounce
        if (
            ballX + ballSize > canvas.width - paddleWidth &&
            ballY > rightPaddleY &&
            ballY < rightPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX;
            paddleFX.play();
        } else if (ballX + ballSize > canvas.width) { // Right Wall Bounce
            leftPlayerScore++;
            ballLaunched = false;
            spaceBarPressed = false;
            leftPaddleHand = true;
            rightPaddleHand = false;
            if(leftPlayerScore < 10) {
                pointFX.play();
            } else {
                applauseFX.play();
            }
            leftPaddleY = (canvas.height - paddleHeight) / 2;
            rightPaddleY = (canvas.height - paddleHeight) / 2;

        }
        // Left Paddle Bounce
        if (
            ballX - ballSize < paddleWidth &&
            ballY > leftPaddleY &&
            ballY < leftPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX;
            paddleFX.play();
        } else if (ballX + ballSize < 0) { // Left Wall Bounce
            rightPlayerScore++;
            ballLaunched = false;
            spaceBarPressed = false;
            leftPaddleHand = false;
            rightPaddleHand = true;
            if(rightPlayerScore < 10) {
                pointFX.play();
            } else {
                applauseFX.play();
            }

            leftPaddleY = (canvas.height - paddleHeight) / 2;
            rightPaddleY = (canvas.height - paddleHeight) / 2;

        }

    requestAnimationFrame(() => localRun());
}
printGame();


// let lastUpdateSentTime = 0;
// const updateInterval = 500; // Interval de mise à jour en millisecondes

function onlineRun(peer) {
    // printConsoleInfos();
    // const currentTime = Date.now();

    if (leftPlayerName == sessionUsername){
        if (q_keyPressed && leftPaddleY > 0) {
            leftPaddleY -= level + 1.8;
            // printConsoleInfos();

            // sendPaddlePositions(peer, leftPaddleY, "left")
        } else if (a_keyPressed && leftPaddleY + paddleHeight < canvas.height) {
            leftPaddleY += level + 1.8;
            // printConsoleInfos();
            // sendPaddlePositions(peer, leftPaddleY, "left")
        }
        // if (leftPaddleHand){
        // }
        serveLeft();
        
    }
    else{

        if (q_keyPressed && rightPaddleY > 0) {
            rightPaddleY -= level + 1.8;
            sendGameUpdate(peer);
            // sendPaddlePositions(peer, rightPaddleY, "right")
            // printConsoleInfos();
        } if (a_keyPressed && rightPaddleY + paddleHeight < canvas.height) {
            rightPaddleY += level + 1.8;
            sendGameUpdate(peer);
            // printConsoleInfos();

            // sendPaddlePositions(peer, rightPaddleY, "right")
        } if (spaceBarPressed && rightPaddleHand){
            console.log(spaceBarPressed);
            spaceRight = true;
            sendGameUpdate(peer);
            spaceBarPressed = false;
            spaceRight = false;
        }
        if (!start){
            printGame();
            printInfos();
            return;
        }
    }

    if (leftPlayerName == sessionUsername){

        serveRight();
        // if (rightPaddleHand){

            // }
        // serve();

        // sendPaddlePositions(leftPaddleY, "left");
        // sendPaddlePositions(rightPaddleY, "right");

        // Ball Update Position
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        // sendBallPositions(peer, ballX, ballY);
        sendGameUpdate(peer);
        if (!start){
            printGame();
            printInfos();
            return;
        }

        // sendValue(peer, spaceBarPressed, rightPaddleHand, leftPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched);

        // sendPaddlePositions(rightPaddleY, "right");

        // Bouncing Sides
        if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
            ballSpeedY = -ballSpeedY;
        }
        // Right Paddle Bounce
        if (
            ballX + ballSize > canvas.width - paddleWidth &&
            ballY > rightPaddleY &&
            ballY < rightPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX;
            paddleFX.play();
        } else if (ballX + ballSize > canvas.width) { // Right Wall Bounce
            leftPlayerScore++;
            ballLaunched = false;
            spaceBarPressed = false;
            leftPaddleHand = true;
            rightPaddleHand = false;
            if(leftPlayerScore < 10) {
                pointFX.play();
            } else {
                applauseFX.play();
            }
            leftPaddleY = (canvas.height - paddleHeight) / 2;
            rightPaddleY = (canvas.height - paddleHeight) / 2;
            sendGameUpdate(peer, 'reset');
            // sendPaddlePositions(peer, leftPaddleY, "left");
            // sendPaddlePositions(peer, rightPaddleY, "right");
            // sendValue(spaceBarPressed,leftPaddleHand, rightPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched)
        }

        // Left Paddle Bounce
        if (
            ballX - ballSize < paddleWidth &&
            ballY > leftPaddleY &&
            ballY < leftPaddleY + paddleHeight
        ){
            ballSpeedX = -ballSpeedX;
            paddleFX.play();
        } else if (ballX + ballSize < 0) { // Left Wall Bounce
            rightPlayerScore++;
            ballLaunched = false;
            spaceBarPressed = false;
            leftPaddleHand = false;
            rightPaddleHand = true;
            if(rightPlayerScore < 10) {
                pointFX.play();
            } else {
                applauseFX.play();
            }

            leftPaddleY = (canvas.height - paddleHeight) / 2;
            rightPaddleY = (canvas.height - paddleHeight) / 2;
            sendGameUpdate(peer, 'reset');
            // sendPaddlePositions(leftPaddleY, "left");
            // sendPaddlePositions(rightPaddleY, "right");

            // sendValue(spaceBarPressed,leftPaddleHand, rightPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched)
        }

    }
    printGame();
    printInfos();
    // if (currentTime - lastUpdateSentTime >= updateInterval) {
        // lastUpdateSentTime = currentTime;
        // }
        // Appeler la fonction update à la prochaine frame
    requestAnimationFrame(() => onlineRun(peer));

}


function sendGameUpdate(peer, messageType) {

    let gameData;
    if (leftPlayerName == sessionUsername)
    {
        if (messageType === 'reset')
        {
            gameData = {
                messageType: messageType,
                rightPaddleY : rightPaddleY,
                // spaceBarPressed: spaceBarPressed,
                rightPaddleHand : rightPaddleHand,

            }
            
        }
        else {

        gameData  = {
            ballX,
            ballY,
            leftPaddleY,
            // rightPaddleY,
            leftPlayerScore,
            rightPlayerScore,

            // spaceBarPressed,
            // rightPaddleHand

            start,
            // Autres données de jeu à inclure...
        };
    }
    }
    else
    {
        gameData = {
            rightPaddleY,
            spaceBarPressed,
            spaceRight
        }
    }
    peer.send(JSON.stringify(gameData));
}

function processGameData(gameData) {
    // Traiter les nouvelles données de jeu
    // console.log('Nouvelles données de jeu reçues :', gameData);
    if (gameData.messageType === 'reset')
    {
        rightPaddleY = gameData.rightPaddleY;
        // spaceBarPressed = gameData.spaceBarPressed;
        rightPaddleHand = gameData.rightPaddleHand;
        // ballLaunched = gameData.ballLaunched

    }
    // Mettre à jour le jeu en fonction des données reçues
    // Par exemple :
    ballX = gameData.ballX;
    ballY = gameData.ballY;
    leftPaddleY = gameData.leftPaddleY;

    // rightPaddleY = gameData.rightPaddleY;
    
    leftPlayerScore = gameData.leftPlayerScore;
    rightPlayerScore = gameData.rightPlayerScore;

    spaceBarPressed = gameData.spaceBarPressed;
    
    start = gameData.start


    // leftPaddleHand = gameData.leftPaddleHand;
    // rightPaddleHand = gameData.rightPaddleHand;
    // ballLaunched = gameData.ballLaunched;

    // etc.
}

// function sendBallPositions(peer, ballX, ballY) {

//     const message = JSON.stringify({
//         messageType: 'updateBallPositions',
//         ballX: ballX,
//         ballY: ballY,
//     });
//     peer.send(message);
// }


// function sendPaddlePositions(peer, pos, cote) {

//     const message = JSON.stringify({
//         messageType: 'updatePaddlePositions',
//         pos: pos,
//         cote: cote,
//         time: new Date().toLocaleTimeString()
//     });

//     peer.send(message);
// }


// function sendValue(peer, spaceBarPressed, rightPaddleHand, leftPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched){
//     const message = JSON.stringify({
//         messageType: 'values',
//         spaceBarPressed: spaceBarPressed,
//         leftPaddleHand: leftPaddleHand,
//         rightPaddleHand: rightPaddleHand,
//         leftPlayerScore: leftPlayerScore,
//         rightPlayerScore: rightPlayerScore,
//         ballLaunched: ballLaunched,
//     });
//     peer.send(message);
// }


// function sendValue(spaceBarPressed,leftPaddleHand, rightPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched){
//     const message = JSON.stringify({
//         action: 'values',
//         spaceBarPressed: spaceBarPressed,
//         leftPaddleHand: leftPaddleHand,
//         rightPaddleHand: rightPaddleHand,
//         leftPlayerScore: leftPlayerScore,
//         rightPlayerScore: rightPlayerScore,
//         ballLaunched: ballLaunched,
//     });
//     socket.send(message);
// }