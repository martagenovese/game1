const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 400;

const ballRadius = 10;
const squareSize = 40;
const grid = [];

const balls = [
    { x: 80, y: 60, dx: 3, dy: 1, color: 'white', borderColor: 'black', leftHalf: true },
    { x: 340, y: 110, dx: -1, dy: -3, color: 'black', borderColor: 'white', leftHalf: false }
];

// Initialize the grid with alternating colors
for (let x = 0; x < canvas.width; x += squareSize) {
    const row = [];
    for (let y = 0; y < canvas.height; y += squareSize) {
        row.push((x / squareSize + y / squareSize) % 2 === 0 ? 'black' : 'white');
    }
    grid.push(row);
}

function drawGrid() {
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            ctx.fillStyle = grid[x][y];
            ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
        }
    }
}

function drawBalls() {
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.strokeStyle = ball.borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    });
}

function changeSpeed(ballIndex, delta) {
    const speedElement = document.getElementById(`speed${ballIndex + 1}`);
    let speed = parseFloat(speedElement.textContent);
    speed = Math.max(0.5, speed + delta); // Ensure speed doesn't go below 0.5
    if (speed > 5) speed = 5; // Ensure speed doesn't go above 10
    speedElement.textContent = speed.toFixed(1);
    balls[ballIndex].dx = speed * Math.sign(balls[ballIndex].dx);
    balls[ballIndex].dy = speed * Math.sign(balls[ballIndex].dy);
}

function updateBalls() {
    balls.forEach(ball => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Bounce off walls
        if (ball.x + ballRadius > canvas.width || ball.x - ballRadius < 0) {
            ball.dx *= -1;
        }
        if (ball.y + ballRadius > canvas.height || ball.y - ballRadius < 0) {
            ball.dy *= -1;
        }

        // Ensure balls stay in their respective halves
        if (ball.color === 'white' && ball.x + ballRadius > canvas.width / 2) {
            ball.dx *= -1;
            ball.x = canvas.width / 2 - ballRadius;
        } else if (ball.color === 'black' && ball.x - ballRadius < canvas.width / 2) {
            ball.dx *= -1;
            ball.x = canvas.width / 2 + ballRadius;
        }

        // Change square color based on the ball's color
        const gridX = Math.floor(ball.x / squareSize);
        const gridY = Math.floor(ball.y / squareSize);
        if (grid[gridX][gridY] !== ball.color) {
            grid[gridX][gridY] = ball.color;
        }
    });

    // Check if the white ball has completed its half
    let whiteHalfComplete = true;
    for (let x = 0; x < grid.length / 2; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            if (grid[x][y] !== 'white') {
                whiteHalfComplete = false;
                break;
            }
        }
        if (!whiteHalfComplete) break;
    }

    // Check if the black ball has completed its half
    let blackHalfComplete = true;
    for (let x = grid.length / 2; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            if (grid[x][y] !== 'black') {
                blackHalfComplete = false;
                break;
            }
        }
        if (!blackHalfComplete) break;
    }

    if (whiteHalfComplete) {
        alert('The white ball has completed its half. Game over!');
        return false;
    } else if (blackHalfComplete) {
        alert('The black ball has completed its half. Game over!');
        return false;
    }

    return true;
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    updateBalls();
    drawBalls();
    if (updateBalls()) {
        requestAnimationFrame(gameLoop);
    }
}

// Start the game
gameLoop();