const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("currentScore");
const highScoreDisplay = document.getElementById("highScore");

const tileSize = 20;
let score = 0;
let highScore = localStorage.getItem("pacmanHighScore") || 0;
highScoreDisplay.innerText = highScore;

// מפת המבוך: 1 = קיר, 0 = נקודה
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let pacman = { x: 9, y: 13, dir: "STAY", nextDir: "STAY" };
let ghost = { x: 9, y: 7 };

function isWall(x, y) {
    if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) return true;
    return map[y][x] === 1;
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") pacman.nextDir = "UP";
    if (e.key === "ArrowDown") pacman.nextDir = "DOWN";
    if (e.key === "ArrowLeft") pacman.nextDir = "LEFT";
    if (e.key === "ArrowRight") pacman.nextDir = "RIGHT";
});

function update() {
    // ניסיון שינוי כיוון
    let tryX = pacman.x, tryY = pacman.y;
    if (pacman.nextDir === "UP") tryY--;
    if (pacman.nextDir === "DOWN") tryY++;
    if (pacman.nextDir === "LEFT") tryX--;
    if (pacman.nextDir === "RIGHT") tryX++;

    if (!isWall(tryX, tryY)) {
        pacman.dir = pacman.nextDir;
    }

    // תנועה של פקמן
    let nextX = pacman.x, nextY = pacman.y;
    if (pacman.dir === "UP") nextY--;
    if (pacman.dir === "DOWN") nextY++;
    if (pacman.dir === "LEFT") nextX--;
    if (pacman.dir === "RIGHT") nextX++;

    if (!isWall(nextX, nextY)) {
        pacman.x = nextX;
        pacman.y = nextY;
    }

    // בדיקה אם פקמן אכל נקודה
    if (map[pacman.y][pacman.x] === 0) {
        map[pacman.y][pacman.x] = 2; // מסמן כ"אכול"
        score += 10;
        scoreDisplay.innerText = score;
    }

    // תנועת רוח (בכל כמה פריימים)
    if (frameCount % 2 === 0) {
        if (ghost.x < pacman.x && !isWall(ghost.x + 1, ghost.y)) ghost.x++;
        else if (ghost.x > pacman.x && !isWall(ghost.x - 1, ghost.y)) ghost.x--;
        else if (ghost.y < pacman.y && !isWall(ghost.y, ghost.y + 1)) ghost.y++;
        else if (ghost.y > pacman.y && !isWall(ghost.y, ghost.y - 1)) ghost.y--;
    }

    // בדיקת התנגשות ברוח
    if (pacman.x === ghost.x && pacman.y === ghost.y) {
        gameOver();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ציור המפה (קירות ונקודות)
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
                ctx.fillStyle = "#1919a6";
                ctx.shadowBlur = 8;
                ctx.shadowColor = "#1919a6";
                ctx.fillRect(x * tileSize + 2, y * tileSize + 2, tileSize - 4, tileSize - 4);
                ctx.shadowBlur = 0;
            } else if (map[y][x] === 0) {
                ctx.fillStyle = "#ffb8ae";
                ctx.beginPath();
                ctx.arc(x * tileSize + 10, y * tileSize + 10, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // פקמן
    ctx.fillStyle = "#ffff00";
    ctx.beginPath();
    ctx.arc(pacman.x * tileSize + 10, pacman.y * tileSize + 10, 8, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x * tileSize + 10, pacman.y * tileSize + 10);
    ctx.fill();

    // רוח
    ctx.fillStyle = "#ff0000";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "red";
    ctx.fillRect(ghost.x * tileSize + 3, ghost.y * tileSize + 3, 14, 14);
    ctx.shadowBlur = 0;
}

let frameCount = 0;
function gameLoop() {
    frameCount++;
    if (frameCount % 10 === 0) {
        update();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

function gameOver() {
    if (score > highScore) {
        localStorage.setItem("pacmanHighScore", score);
        alert("שיא חדש! " + score);
    } else {
        alert("הפסדת! הניקוד שלך: " + score);
    }
    location.reload();
}

gameLoop();