const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

const ballRadius = 10;
let squareSize = 40;
let grid = [];

const balls = [
    { x: 80, y: 60, dx: 3, dy: 1, color: 'white', borderColor: 'black', leftHalf: true },
    { x: 340, y: 110, dx: -1, dy: -3, color: 'black', borderColor: 'white', leftHalf: false }
];

// Initialize the grid with alternating colors
function initializeGrid() {
    grid = [];
    for (let x = 0; x < canvas.width; x += squareSize) {
        const row = [];
        for (let y = 0; y < canvas.height; y += squareSize) {
            row.push((x / squareSize + y / squareSize) % 2 === 0 ? 'black' : 'white');
        }
        grid.push(row);
    }
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

// Create an audio context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playNote() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1); // Play for 0.1 seconds
}

function updateBalls() {
    balls.forEach(ball => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Bounce off walls
        if (ball.x + ballRadius > canvas.width || ball.x - ballRadius < 0 ) {
            ball.dx *= -1;
            playNote();
        }
        if (ball.y + ballRadius > canvas.height || ball.y - ballRadius < 0) {
            ball.dy *= -1;
            playNote();
        }

        // stay in their half
        if (ball.leftHalf && ball.x > canvas.width / 2) {
            ball.dx *= -1;
            playNote();
        }
        if (!ball.leftHalf && ball.x < canvas.width / 2) {
            ball.dx *= -1;
            playNote();
        }

        // Change square color based on the ball's color
        const gridX = Math.floor(ball.x / squareSize);
        const gridY = Math.floor(ball.y / squareSize);
        if (grid[gridX][gridY] !== ball.color) {
            grid[gridX][gridY] = ball.color;
        }
    });
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    updateBalls();
    drawBalls();
    requestAnimationFrame(gameLoop);
}

// Initialize the grid and start the game
initializeGrid();
gameLoop();

// Handle square size change
document.getElementById('squareSize').addEventListener('input', (event) => {
    squareSize = parseInt(event.target.value);
    initializeGrid();
});