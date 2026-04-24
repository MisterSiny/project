let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];

const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

function createBoard() {
    boardElement.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("button");
        cell.classList.add("cell");

        if (board[i] === "X") cell.classList.add("x");
        if (board[i] === "O") cell.classList.add("o");

        cell.innerText = board[i];
        cell.onclick = () => makeMove(i);

        boardElement.appendChild(cell);
    }
}

function makeMove(index) {
    if (board[index] !== "") return;

    board[index] = currentPlayer;

    if (checkWinner()) {
        statusText.innerText = currentPlayer + " ניצח! 🎉";
        createBoard();
        return;
    }

    if (!board.includes("")) {
        statusText.innerText = "תיקו 🤝";
        createBoard();
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = "תור של " + currentPlayer;

    createBoard();
}

function checkWinner() {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of wins) {
        const [a, b, c] = combo;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return true;
        }
    }

    return false;
}

restartBtn.onclick = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    statusText.innerText = "תור של X";
    createBoard();
};

createBoard();