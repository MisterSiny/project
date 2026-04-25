const boardSize = 5;
let board = [];

function generateBoard() {
    const boardElement = document.getElementById("bingoBoard");
    const status = document.getElementById("status");

    boardElement.innerHTML = "";
    status.innerHTML = "";

    board = [];

    let numbers = Array.from({ length: 75 }, (_, i) => i + 1);

    // ערבוב מספרים
    numbers.sort(() => Math.random() - 0.5);

    let index = 0;

    for (let i = 0; i < boardSize; i++) {
        board[i] = [];

        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            const num = numbers[index++];
            board[i][j] = { value: num, marked: false };

            cell.textContent = num;

            cell.addEventListener("click", () => {
                board[i][j].marked = !board[i][j].marked;
                cell.classList.toggle("marked");

                checkBingo();
            });

            boardElement.appendChild(cell);
        }
    }
}

function checkBingo() {
    let bingo = false;

    // שורות
    for (let i = 0; i < boardSize; i++) {
        if (board[i].every(cell => cell.marked)) {
            bingo = true;
        }
    }

    // עמודות
    for (let j = 0; j < boardSize; j++) {
        let column = true;
        for (let i = 0; i < boardSize; i++) {
            if (!board[i][j].marked) column = false;
        }
        if (column) bingo = true;
    }

    // אלכסונים
    let diag1 = true;
    let diag2 = true;

    for (let i = 0; i < boardSize; i++) {
        if (!board[i][i].marked) diag1 = false;
        if (!board[i][boardSize - i - 1].marked) diag2 = false;
    }

    if (diag1 || diag2) bingo = true;

    if (bingo) {
        document.getElementById("status").innerHTML = "🎉 בינגו!";
    }
}

// יצירת לוח בהתחלה
generateBoard();