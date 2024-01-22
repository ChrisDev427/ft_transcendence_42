


// printConsoleInfos();
// Fonction principale de mise à jour et de rendu
function run() {
    
    if(!start) {
        // if(tournament) {
        //     nextMatch();
        // }
        return;
    }
  
    serve();
    printGame();
    printInfos();
    // Updating paddles position based on key presses
   
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
    
    // Ball Update Position
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
   

    // Appeler la fonction update à la prochaine frame
    requestAnimationFrame(run);
}
printGame();

// // Set Players Names
// setPlayerNameToPrint();
// setHandToStart();
// // Lancer le jeu en appelant la fonction update
// run();