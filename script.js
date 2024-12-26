const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

const ballRadius = 10;
const squareSize = 40;
const grid = [];

const balls = [
    { x: 80, y: 60, dx: 5, dy: 3, color: 'white', borderColor: 'black', leftHalf: true },
    { x: 340, y: 110, dx: -3, dy: -5, color: 'black', borderColor: 'white', leftHalf: false }
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
    if (speed > 10) speed = 10; // Ensure speed doesn't go above 10
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

        // Change square color based on the ball's color
        const gridX = Math.floor(ball.x / squareSize);
        const gridY = Math.floor(ball.y / squareSize);
        if (grid[gridX][gridY] !== ball.color) {
            grid[gridX][gridY] = ball.color;
        }
    });

    // Check for collisions between balls
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const dx = balls[j].x - balls[i].x;
            const dy = balls[j].y - balls[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ballRadius * 2) {
                // Bounce in opposite directions
                const tempDx = balls[i].dx;
                const tempDy = balls[i].dy;
                balls[i].dx = balls[j].dx;
                balls[i].dy = balls[j].dy;
                balls[j].dx = tempDx;
                balls[j].dy = tempDy;

                // Move balls apart to avoid overlap
                const overlap = ballRadius * 2 - distance;
                const moveX = overlap * (dx / distance) / 2;
                const moveY = overlap * (dy / distance) / 2;
                balls[i].x -= moveX;
                balls[i].y -= moveY;
                balls[j].x += moveX;
                balls[j].y += moveY;

                speedElement1 = document.getElementById('speed1');
                tmp = speedElement1.textContent;
                speedElement2 = document.getElementById('speed2');
                speedElement1.textContent = speedElement2.textContent;
                speedElement2.textContent = tmp;                
            }
        }
    }

        // Check if the grid is one color
        const firstColor = grid[0][0];
        let isOneColor = true;
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                if (grid[x][y] !== firstColor) {
                    isOneColor = false;
                    break;
                }
            }
            if (!isOneColor) break;
        }
    
        if (isOneColor) {
            alert('The grid is now one color. Game over!');
            return;
        }
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    updateBalls();
    drawBalls();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();