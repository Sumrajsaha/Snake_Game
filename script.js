// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 9;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

let hiscore = localStorage.getItem("hiscore");
let hiscoreval = hiscore === null ? 0 : JSON.parse(hiscore);
localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
document.getElementById("hiscoreBox").innerHTML = "HiScore: " + hiscoreval;

const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");
const hiscoreBox = document.getElementById("hiscoreBox");
const startButton = document.getElementById("startButton");

// Function to start the game
function startGame() {
    // Show game elements and hide the button
    board.style.display = "grid";
    scoreBox.style.display = "block";
    hiscoreBox.style.display = "block";
    startButton.style.display = "none";

    // Reset game state
    inputDir = { x: 0, y: 0 };
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    scoreBox.innerHTML = "Score: " + score;
    musicSound.play();

    // Start the game loop
    window.requestAnimationFrame(main);
}

// Main game loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// Function to check collisions
function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x <= 0 || snake[0].x >= 18 || snake[0].y <= 0 || snake[0].y >= 18) {
        return true;
    }
    return false;
}

// Game Engine
function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        
        // Hide game elements and show Start button
        board.style.display = "none";
        scoreBox.style.display = "none";
        hiscoreBox.style.display = "none";
        startButton.style.display = "block";
        
        return;
    }

    // If snake eats food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });

        let a = 2;
        let b = 16;
        food = {
            x: Math.floor(a + (b - a) * Math.random()),
            y: Math.floor(a + (b - a) * Math.random())
        };
    }

    // Move snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Render snake and food
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Listen for Start Button Click
startButton.addEventListener("click", startGame);

// Listen for Keypress to Move Snake
window.addEventListener("keydown", (e) => {
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y === 0) {
                inputDir = { x: 0, y: -1 };
            }
            break;
        case "ArrowDown":
            if (inputDir.y === 0) {
                inputDir = { x: 0, y: 1 };
            }
            break;
        case "ArrowLeft":
            if (inputDir.x === 0) {
                inputDir = { x: -1, y: 0 };
            }
            break;
        case "ArrowRight":
            if (inputDir.x === 0) {
                inputDir = { x: 1, y: 0 };
            }
            break;
    }
});