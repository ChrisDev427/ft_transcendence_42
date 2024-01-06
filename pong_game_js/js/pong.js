





// Fonction principale de mise à jour et de rendu
function run() {
    
    serve();
    printGame();
    printInfos();

    // Updating paddles position based on key presses
    if(start) {

        if (arrowUpPressed && rightPaddleY > 0) {
            rightPaddleY -= level + 1.8;
        } else if (arrowDownPressed && rightPaddleY + paddleHeight < canvas.height) {
            rightPaddleY += level + 1.8;
        }
        if(twoPlayer || tournament) {

            if (wKeyPressed && leftPaddleY > 0) {
                leftPaddleY -= level + 1.8;
            } else if (sKeyPressed && leftPaddleY + paddleHeight < canvas.height) {
                leftPaddleY += level + 1.8;
            }
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
    } else if (ballX + ballSize > canvas.width) { // Right Wall Bounce
        playerLeftScore++;
        ballLaunched = false;
        spaceBarPressed = false;
        leftPaddleHand = true;
        rightPaddleHand = false;
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
    } else if (ballX + ballSize < 0) { // Left Wall Bounce
        playerRightScore++;
        ballLaunched = false;
        spaceBarPressed = false;
        leftPaddleHand = false;
        rightPaddleHand = true;
        leftPaddleY = (canvas.height - paddleHeight) / 2;
        rightPaddleY = (canvas.height - paddleHeight) / 2;

    }
   

    // Appeler la fonction update à la prochaine frame
    requestAnimationFrame(run);
}
// Set Players Names
setPlayerNameToPrint();
setHandToStart();
// Lancer le jeu en appelant la fonction update
run();