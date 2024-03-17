


// printConsoleInfos();
// Fonction principale de mise à jour et de rendu

let i = 0;

function run() {


    printGame();
    printInfos();

    if(!start) {
        // if(tournament) {
        //     nextMatch();
        // }
        return;
    }
    // serve();



    if (playLocal){
        serve();



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

    }














    if (playOnline){




        if (leftPlayerName == sessionUsername){
            if (q_keyPressed && leftPaddleY > 0) {
                leftPaddleY -= level + 1.8;
                printConsoleInfos();

                sendPaddlePositions(leftPaddleY, "left")
            } else if (a_keyPressed && leftPaddleY + paddleHeight < canvas.height) {
                leftPaddleY += level + 1.8;
                printConsoleInfos();

                sendPaddlePositions(leftPaddleY, "left")
            }
        }
        else{
            if (q_keyPressed && rightPaddleY > 0) {
                rightPaddleY -= level + 1.8;
                sendPaddlePositions(rightPaddleY, "right")
                printConsoleInfos();
            } else if (a_keyPressed && rightPaddleY + paddleHeight < canvas.height) {
                rightPaddleY += level + 1.8;
                printConsoleInfos();

                sendPaddlePositions(rightPaddleY, "right")
            }
        }







        if (leftPlayerName == sessionUsername){
            serve();
            // sendPaddlePositions(leftPaddleY, "left");
            // sendPaddlePositions(rightPaddleY, "right");

            // Ball Update Position
            ballX += ballSpeedX;
            ballY += ballSpeedY;
            sendBallPositions(ballX, ballY);





            // sendValue(spaceBarPressed, rightPaddleHand, leftPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched);




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

                sendPaddlePositions(leftPaddleY, "left");
                sendPaddlePositions(rightPaddleY, "right");
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
                sendPaddlePositions(leftPaddleY, "left");
                sendPaddlePositions(rightPaddleY, "right");



                // sendValue(spaceBarPressed,leftPaddleHand, rightPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched)
            }

        }


    }
    // Appeler la fonction update à la prochaine frame
    requestAnimationFrame(run);
}
printGame();

// // Set Players Names
// setPlayerNameToPrint();
// setHandToStart();
// // Lancer le jeu en appelant la fonction update
// run();


function sendBallPositions(ballX, ballY) {

    const message = JSON.stringify({
        messageType: 'updateBallPositions',
        ballX: ballX,
        ballY: ballY,
    });
    socket.send(message);
}


function sendPaddlePositions(pos, cote) {

    const message = JSON.stringify({
        messageType: 'updatePaddlePositions',
        pos: pos,
        cote: cote,
        time: new Date().toLocaleTimeString()
    });

    socket.send(message);
}


function sendValue(spaceBarPressed, rightPaddleHand, leftPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched){
    const message = JSON.stringify({
        messageType: 'values',
        spaceBarPressed: spaceBarPressed,
        leftPaddleHand: leftPaddleHand,
        rightPaddleHand: rightPaddleHand,
        leftPlayerScore: leftPlayerScore,
        rightPlayerScore: rightPlayerScore,
        ballLaunched: ballLaunched,
    });
    socket.send(message);
}


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