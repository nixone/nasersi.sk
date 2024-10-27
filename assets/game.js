var player = document.getElementById("player");
var block = document.getElementById("block");
var game = document.getElementById("game");
var currentScore = 0;
var running = false;
var collisionEvent = new Event("collision");
var scoreUpEvent = new Event("scoreUp");

function onKeyDown() {
    if (event.code === "Space" && event.target === document.body) {
        onUserInput();
    }
}

function onUserInput() {
    if (!running) {
        running = true;
        currentScore = 0;
        block.style.animation = "block 1s infinite linear";
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

function isBlockCompletelyLeft() {
    var blockRect = block.getBoundingClientRect();
    var gameRect = game.getBoundingClientRect();
}

function gameLoop() {
    if (isPlayerCollidingWithBlock()) {
        player.dispatchEvent(collisionEvent);
    } else if (isBlockCompletelyLeft()) {
        player.dispatchEvent(scoreUpEvent);
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

player.addEventListener("collision", function (event) {
    running = false;
    block.style.animation = "none";
});

player.addEventListener("scoreUp", function (event) {
    currentScore++;
    updateScore();
});

function updateScore() {
    var scoreSpan = document.getElementById("score");
    scoreSpan.textContent = currentScore;
}

document.addEventListener("keydown", onKeyDown);
document.addEventListener("mousedown", onUserInput);
