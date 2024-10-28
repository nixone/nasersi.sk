var player = document.getElementById("player");
var block = document.getElementById("block");
var game = document.getElementById("game");
var currentScore = 0;
var running = false;
var detectingScoreUp = false;
var blockSpeed = 0;

function onKeyDown() {
    if (event.code === "Space" && event.target === document.body) {
        onUserInput();
    }
}

function setBlockSpeed(ms) {
    blockSpeed = ms;
    block.style.animation = "block " + ms + "ms linear infinite";
}

function stopBlock() {
    block.style.animation = "none";
}

function onUserInput() {
    if (!running) {
        setBlockSpeed(1000);
        running = true;
        currentScore = 0;
        updateScore();
        gameLoop();
        jump();
    } else {
        jump();
    }
}

function isPlayerCollidingWithBlock() {
    var playerRect = player.getBoundingClientRect();
    var blockRect = block.getBoundingClientRect();

    return  playerRect.right >= blockRect.left &&
            playerRect.left <= blockRect.right &&
            playerRect.bottom >= blockRect.top &&
            playerRect.top <= blockRect.bottom;
}

function isBlockLeft() {
    var blockRect = block.getBoundingClientRect();
    var gameRect = game.getBoundingClientRect();
    return blockRect.left <= (gameRect.left + gameRect.right) / 2;
}

function isBlockCompletelyLeft() {
    var blockRect = block.getBoundingClientRect();
    var gameRect = game.getBoundingClientRect();

    return blockRect.left <= gameRect.left;
}

function scoreUp() {
    currentScore++;
    detectingScoreUp = false;
    updateScore();
}

function gameLoop() {
    if (!isBlockLeft() && !detectingScoreUp) {
        detectingScoreUp = true;
    }
    if (isPlayerCollidingWithBlock()) {
        running = false;
        block.style.animation = "none";
    } else if (detectingScoreUp && isBlockCompletelyLeft()) {
        scoreUp();

    }
    if (running) {
        requestAnimationFrame(gameLoop);
    }
}

function jump() {
    if (player.classList.contains("animate")) {
        return;
    }
    player.classList.add("animate");
    setTimeout(function () {
        player.classList.remove("animate");
    }, 300);
}

function updateScore() {
    var scoreSpan = document.getElementById("score");
    scoreSpan.textContent = currentScore;
    var bestScore = localStorage.getItem("bestScore");
    if (!bestScore || currentScore > bestScore) {
        localStorage.setItem("bestScore", currentScore);
    }
    document.getElementById("bestScore").textContent = localStorage.getItem("bestScore");
}

document.addEventListener("keydown", onKeyDown);
document.addEventListener("mousedown", onUserInput);
updateScore();