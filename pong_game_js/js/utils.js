function printConsoleInfos() {

    console.log("Left Player Name : " + leftPlayerName);
    console.log("Right Player Name : " + rightPlayerName);
    console.log("Paddles Height : " + paddleHeight);
    console.log("Level : " + level);
    console.log("Paddle Left Pos : " + leftPaddleY);
    console.log("Paddle Right Pos : " + rightPaddleY);
    if(leftPaddleHand) {
        console.log("Hand : left");
    } else {
        console.log("Hand : right");
    }
    console.log("Left Player Score : " + leftPlayerScore);
    console.log("Right Player Score : " + rightPlayerScore);
    console.log("Ball Speed X : " + ballSpeedX);
    console.log("Ball Speed Y : " + ballSpeedY);
    console.log("Ball X : " + ballX);
    console.log("Ball Y : " + ballY);
    console.log("Ball Size : " + ballSize);
    console.log("Start : " + start);
    console.log("Ball Launched : " + ballLaunched);
    console.log("Theme : " + theme);
    console.log("One Player : " + onePlayer);
    console.log("Two Player : " + twoPlayer);
    console.log("Tournament : " + tournament);
}

function printGame() {

    // Effacement du canvas
    ctx.fillStyle = themeColor[theme].field;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessin de la ligne au milieu du terrain
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.lineWidth = 4;
    ctx.strokeStyle = themeColor[theme].midLine;
    ctx.stroke();
    ctx.closePath();

    // Dessin des raquettes
    ctx.fillStyle = themeColor[theme].paddle;
    drawPaddles(5, leftPaddleY, paddleWidth, paddleHeight, 5);  // Left Paddle
    drawPaddles(canvas.width - paddleWidth -5, rightPaddleY, paddleWidth, paddleHeight, 5);  // Right Paddle

    // Dessin de la balle
    ctx.fillStyle = themeColor[theme].ball;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function printWinner() {

    ctx.font = "130px Calibri";
    ctx.fillStyle = themeColor[theme].winPrint;
    if(rightPlayerScore === 10) {
        const lines = [" " + rightPlayerNamePrint, "WIN !"];
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], canvas.width - 440, canvas.height - 410 + i * 130);
        }
    }
    if(leftPlayerScore === 10) {
        const lines = [" " + leftPlayerNamePrint, "WIN !"];
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], canvas.width - 1000, canvas.height - 410 + i * 130);
        }
    }
    leftPlayerNamePrint = "";
    rightPlayerNamePrint = "";
    start = false;
}

function printInfos() {

    // Print score
    ctx.font = "90px Calibri";
    if( leftPlayerScore < 10) {

        ctx.fillText(leftPlayerScore, (canvas.width / 2) - 65, 75);
    } else {
        ctx.fillText(leftPlayerScore, (canvas.width / 2) - 110, 75);
    }
    ctx.fillText(rightPlayerScore, canvas.width - (canvas.width / 2) + 20, 75);

    if (leftPlayerScore === 10 || rightPlayerScore === 10) {
        printWinner();
    }

    // Print Players Name 
    ctx.fillStyle = themeColor[theme].playersName; 
    ctx.globalAlpha = 0.2;
    ctx.font = "90px Calibri"; 
    ctx.fillText(leftPlayerNamePrint, 30, 105);
    ctx.fillText(rightPlayerNamePrint, canvas.width - 220, canvas.height - 40);
    ctx.globalAlpha = 1.0;
}

function serve() {

    // Si la balle n'a pas été lancée et la barre d'espace est enfoncée, lancez la balle

    if (!ballLaunched) {
        
        if(rightPaddleHand) {
            ballX = canvas.width - 25;
            ballY = rightPaddleY + paddleHeight / 2;
        }
        else if(leftPaddleHand) {
            ballX = 25;
            ballY = leftPaddleY + paddleHeight / 2;
        }
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2); 
        ctx.fill();
        if (spaceBarPressed) {
            
            ballSpeedX = level + 2; // Choisissez la vitesse initiale en fonction de votre préférence
            ballSpeedY = level; // Choisissez la vitesse initiale en fonction de votre préférence
            ballLaunched = true;
            paddleFX.play();
        }
    }
}

// Cut the name if is length > 5
function setPlayerNameToPrint() {

    if (leftPlayerName.length > 3) {
        leftPlayerNamePrint = leftPlayerName.substring(0, 3);
        leftPlayerNamePrint = leftPlayerNamePrint.toUpperCase();
    }
    else {
        leftPlayerNamePrint = leftPlayerName;
        leftPlayerNamePrint = leftPlayerNamePrint.toUpperCase(leftPlayerNamePrint);

    }
    if (rightPlayerName.length > 3) {
        rightPlayerNamePrint = rightPlayerName.substring(0, 3);
        rightPlayerNamePrint = rightPlayerNamePrint.toUpperCase();

    }
    else {
        rightPlayerNamePrint = rightPlayerName;
        rightPlayerNamePrint = rightPlayerNamePrint.toUpperCase();
    }
}

function setHandToStart() {
    // Générer un nombre entier aléatoire entre 0 et 1
    let number = Math.floor(Math.random() * 2);
    if (number == 0) {
        leftPaddleHand = true;
    } else {
        rightPaddleHand = true;
    }
}

function drawPaddles(x, y, largeur, hauteur, rayon) {
    // Dessiner une forme rectangulaire avec des coins arrondis
    ctx.beginPath();
    ctx.moveTo(x + rayon, y);
    ctx.arcTo(x + largeur, y, x + largeur, y + hauteur, rayon);
    ctx.arcTo(x + largeur, y + hauteur, x, y + hauteur, rayon);
    ctx.arcTo(x, y + hauteur, x, y, rayon);
    ctx.arcTo(x, y, x + largeur, y, rayon);
    ctx.closePath();
    ctx.fill();
}