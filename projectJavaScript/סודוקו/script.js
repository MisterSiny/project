const boardElement = document.getElementById('board');
let solution = [];

// יצירת לוח ריק
function createEmptyBoard() {
    boardElement.innerHTML = '';

    for (let i = 0; i < 81; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = 9;
        input.classList.add('cell');

        boardElement.appendChild(input);
    }
}

// יצירת משחק חדש
function generateSudoku() {
    createEmptyBoard();
    solution = generateFullSolution();

    const cells = document.querySelectorAll('.cell');

    solution.forEach((num, i) => {
        if (Math.random() < 0.4) {
            cells[i].value = num;
            cells[i].disabled = true;
        }
    });
}

// בדיקה אם הפתרון נכון
function checkSolution() {
    const cells = document.querySelectorAll('.cell');
    let correct = true;

    cells.forEach((cell, i) => {
        if (parseInt(cell.value) !== solution[i]) {
            cell.style.background = '#ffcccc';
            correct = false;
        } else {
            cell.style.background = '#ccffcc';
        }
    });

    if (correct) alert('ניצחת! 🎉');
}

// יצירת פתרון סודוקו מלא
function generateFullSolution() {
    const board = new Array(81).fill(0);

    function isValid(num, pos) {
        const row = Math.floor(pos / 9);
        const col = pos % 9;

        for (let i = 0; i < 9; i++) {
            if (board[row * 9 + i] === num) return false;
            if (board[i * 9 + col] === num) return false;
        }

        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (board[(boxRow + r) * 9 + (boxCol + c)] === num) return false;
            }
        }

        return true;
    }

    function solve(pos = 0) {
        if (pos === 81) return true;

        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

        for (let num of nums) {
            if (isValid(num, pos)) {
                board[pos] = num;
                if (solve(pos + 1)) return true;
                board[pos] = 0;
            }
        }

        return false;
    }

    solve();
    return board;
}

// התחלה
createEmptyBoard();