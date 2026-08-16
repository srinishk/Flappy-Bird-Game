const bird = document.getElementById("bird");
const gameArea = document.getElementById("game-area");

const pipeTop = document.getElementById("pipe-top");
const pipeBottom = document.getElementById("pipe-bottom");

const gameOverScreen = document.getElementById("game-over");

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");


/* =========================================
   GAME VARIABLES
========================================= */

let birdY = 0;
let velocity = 0;

let score = 0;
let highScore = 0;

let pipeX = 0;
let gap = 0;

let gameStarted = false;
let gameLoop;


/* =========================================
   GAME PHYSICS
========================================= */

const gravity = 0.35;
const jumpStrength = -7;


/* =========================================
   GAME SIZE
========================================= */

function getGameSize() {

    return {
        width: gameArea.clientWidth,
        height: gameArea.clientHeight
    };
}


/* =========================================
   START GAME
========================================= */

function startGame() {

    if (gameStarted) {
        return;
    }

    const { width, height } = getGameSize();

    gameStarted = true;

    score = 0;
    velocity = 0;

    birdY = height * 0.45;

    pipeX = width;

    gameOverScreen.style.display = "none";

    randomPipe();

    updateScreen();

    clearInterval(gameLoop);

    gameLoop = setInterval(updateGame, 30);
}


/* =========================================
   GAME LOOP
========================================= */

function updateGame() {

    const { width } = getGameSize();


    /* Gravity */

    velocity += gravity;

    birdY += velocity;

    bird.style.top = birdY + "px";


    /* Pipe movement */

    pipeX -= width * 0.014;

    pipeTop.style.left = pipeX + "px";
    pipeBottom.style.left = pipeX + "px";


    /* Create new pipe */

    if (pipeX < -pipeTop.offsetWidth) {

        pipeX = width;

        randomPipe();

        score++;

        if (score > highScore) {
            highScore = score;
        }

        updateScreen();
    }


    /* Collision */

    checkCollision();
}


/* =========================================
   RANDOM PIPE
========================================= */

function randomPipe() {

    const { height } = getGameSize();


    /*
       Bigger gap between pipes.
    */

    gap = height * 0.42;


    /*
       Keeps the opening
       away from the top and bottom.
    */

    const minTop = height * 0.14;
    const maxTop = height * 0.46;


    const topHeight =
        Math.random() *
        (maxTop - minTop) +
        minTop;


    const bottomHeight =
        height - topHeight - gap;


    pipeTop.style.height =
        topHeight + "px";


    pipeBottom.style.height =
        bottomHeight + "px";
}


/* =========================================
   JUMP
========================================= */

function jump() {

    if (!gameStarted) {
        return;
    }

    velocity = jumpStrength;
}


/* =========================================
   SCORE
========================================= */

function updateScreen() {

    scoreDisplay.textContent = score;

    highScoreDisplay.textContent = highScore;
}


/* =========================================
   COLLISION
========================================= */

function checkCollision() {

    const {
        height
    } = getGameSize();


    /* =====================================
       BIRD SIZE
    ===================================== */

    const birdLeft = bird.offsetLeft;

    const birdTop = birdY;

    const birdWidth = bird.offsetWidth;

    const birdHeight = bird.offsetHeight;


    /* =====================================
       GROUND
    ===================================== */

    const groundHeight = height * 0.18;

    const groundTop =
        height - groundHeight;


    if (
        birdTop + birdHeight >= groundTop
    ) {

        gameOver();

        return;
    }


    /* =====================================
       CEILING
    ===================================== */

    if (birdTop <= 0) {

        gameOver();

        return;
    }


    /* =====================================
       PIPE COLLISION
    ===================================== */

    const pipeWidth =
        pipeTop.offsetWidth;


    const pipeLeft =
        pipeX;


    const pipeRight =
        pipeX + pipeWidth;


    const birdRight =
        birdLeft + birdWidth;


    /* Horizontal collision */

    if (
        birdRight > pipeLeft &&
        birdLeft < pipeRight
    ) {

        const topPipeBottom =
            pipeTop.offsetHeight;


        const bottomPipeTop =
            height -
            pipeBottom.offsetHeight;


        /* Top pipe */

        if (
            birdTop <
            topPipeBottom
        ) {

            gameOver();

            return;
        }


        /* Bottom pipe */

        if (
            birdTop + birdHeight >
            bottomPipeTop
        ) {

            gameOver();

            return;
        }
    }
}


/* =========================================
   GAME OVER
========================================= */

function gameOver() {

    clearInterval(gameLoop);

    gameStarted = false;

    gameOverScreen.style.display =
        "block";
}


/* =========================================
   RESTART
========================================= */

function restartGame() {

    clearInterval(gameLoop);

    const {
        width,
        height
    } = getGameSize();


    gameStarted = false;

    score = 0;

    velocity = 0;

    birdY = height * 0.45;

    pipeX = width;


    bird.style.top =
        birdY + "px";


    pipeTop.style.left =
        pipeX + "px";


    pipeBottom.style.left =
        pipeX + "px";


    gameOverScreen.style.display =
        "none";


    randomPipe();

    updateScreen();
}


/* =========================================
   SPACEBAR
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            jump();
        }
    }
);


/* =========================================
   MOUSE
========================================= */

gameArea.addEventListener(
    "click",
    function () {

        jump();
    }
);


/* =========================================
   TOUCH
========================================= */

gameArea.addEventListener(
    "touchstart",
    function (event) {

        event.preventDefault();

        jump();
    },
    {
        passive: false
    }
);


/* =========================================
   WINDOW RESIZE
========================================= */

window.addEventListener(
    "resize",
    function () {

        if (!gameStarted) {

            const {
                height
            } = getGameSize();


            birdY =
                height * 0.45;


            bird.style.top =
                birdY + "px";
        }
    }
);


/* =========================================
   INITIAL STATE
========================================= */

const initialSize =
    getGameSize();


birdY =
    initialSize.height * 0.45;


pipeX =
    initialSize.width;


bird.style.top =
    birdY + "px";


pipeTop.style.left =
    pipeX + "px";


pipeBottom.style.left =
    pipeX + "px";


randomPipe();

updateScreen();