'use strict';

const player = document.getElementById('player');
const block = document.getElementById('block');
const game = document.getElementById('game');
const scoreSpan = document.getElementById('score');
const bestScoreSpan = document.getElementById('bestScore');

let currentScore = 0;
let running = false;
let detectingScoreUp = false;
let blockSpeed = 0;

function onKeyDown(e) {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        onUserInput();
    }
}

function setBlockSpeed(ms) {
    blockSpeed = ms;
    block.style.animation = `block ${ms}ms linear infinite`;
}

function stopBlock() {
    block.style.animation = 'none';
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
    const playerRect = player.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();

    return (
        playerRect.right >= blockRect.left &&
        playerRect.left <= blockRect.right &&
        playerRect.bottom >= blockRect.top &&
        playerRect.top <= blockRect.bottom
    );
}

function isBlockLeft() {
    const blockRect = block.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();
    return blockRect.left <= (gameRect.left + gameRect.right) / 2;
}

function isBlockCompletelyLeft() {
    const blockRect = block.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

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
        stopBlock();
    } else if (detectingScoreUp && isBlockCompletelyLeft()) {
        scoreUp();
    }
    if (running) {
        requestAnimationFrame(gameLoop);
    }
}

function jump() {
    if (player.classList.contains('animate')) {
        return;
    }
    player.classList.add('animate');
    setTimeout(() => {
        player.classList.remove('animate');
    }, 300);
}

function updateScore() {
    scoreSpan.textContent = String(currentScore);
    const stored = localStorage.getItem('bestScore');
    const bestScore = stored ? Number(stored) : 0;
    if (currentScore > bestScore) {
        localStorage.setItem('bestScore', String(currentScore));
        bestScoreSpan.textContent = String(currentScore);
    } else {
        bestScoreSpan.textContent = String(bestScore);
    }
}

window.addEventListener('keydown', onKeyDown);
// Use pointerdown to support mouse, touch, and pen
window.addEventListener('pointerdown', onUserInput, { passive: true });

// If the window loses focus, stop the run to avoid unintended progress
window.addEventListener('blur', () => {
    if (running) {
        running = false;
        stopBlock();
    }
});

updateScore();