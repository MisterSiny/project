const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreVal");

const box = 20; // גודל כל ריבוע במשחק
let score = 0;
let gameSpeed = 100;

// הגדרת הנחש - מתחיל באמצע הלוח
let snake = [{ x: 10 * box, y: 10 * box }];

// הגדרת האוכל
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let d; // כיוון התנועה

// זיהוי לחיצות על המקלדת
document.addEventListener("keydown", direction);

function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if (event.keyCode == 38 && d != "DOWN") d = "UP";
    else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if (event.keyCode == 40 && d != "UP") d = "DOWN";
}

// פונקציה לבדיקת התנגשות בעצמו
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

// הפונקציה המרכזית שמציירת את המשחק
function draw() {
    // ניקוי הקנבס בכל פריים
    ctx.fillStyle = "#0f3460";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ציור הנחש
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#00d2ff" : "#e94560"; // ראש כחול, גוף אדום
        ctx.strokeStyle = "#1a1a2e";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // ציור האוכל
    ctx.fillStyle = "#4cd137";
    ctx.fillRect(food.x, food.y, box, box);

    // מיקום הראש הנוכחי
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // לאיזה כיוון להזיז את הראש
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // האם הנחש אכל את האוכל?
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        // הסרת הזנב (כדי ליצור תנועה)
        snake.pop();
    }

    // יצירת ראש חדש
    let newHead = { x: snakeX, y: snakeY };

    // בדיקת פסילה (קירות או התנגשות עצמית)
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert("המשחק נגמר! הניקוד שלך: " + score);
        location.reload(); // רענון הדף להתחלה מחדש
    }

    snake.unshift(newHead);
}

// הרצת הלוגיקה כל 100 מילישניות
let game = setInterval(draw, gameSpeed);