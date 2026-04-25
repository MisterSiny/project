const suits = ["♥", "♦", "♣", "♠"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

let deck = [];
let tableau = [];
let stock = [];
let waste = [];
let foundations = {};
let history = [];

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let i = 0; i < values.length; i++) {
            deck.push({
                suit,
                value: values[i],
                index: i,
                color: (suit === "♥" || suit === "♦") ? "red" : "black",
                hidden: false
            });
        }
    }
}

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function saveState() {
    history.push(JSON.stringify({ tableau, stock, waste, foundations }));
}

function undo() {
    if (!history.length) return;
    const prev = JSON.parse(history.pop());
    tableau = prev.tableau;
    stock = prev.stock;
    waste = prev.waste;
    foundations = prev.foundations;
    render();
}

function initGame() {
    createDeck();
    shuffle(deck);

    tableau = [[], [], [], [], [], [], []];
    stock = [...deck];
    waste = [];
    foundations = { "♥": [], "♦": [], "♣": [], "♠": [] };
    history = [];

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            const card = stock.pop();
            card.hidden = j !== i;
            tableau[i].push(card);
        }
    }

    render();
}

function drawFromStock() {
    saveState();

    if (!stock.length) {
        stock = waste.reverse();
        waste = [];
        render();
        return;
    }

    const card = stock.pop();
    card.hidden = false;
    waste.push(card);

    render();
}

function canPlace(card, target) {
    if (!target) return card.value === "K";
    return card.color !== target.color && card.index === target.index - 1;
}

function canFoundation(card) {
    const pile = foundations[card.suit];
    if (!pile.length) return card.value === "A";
    return card.index === pile[pile.length - 1].index + 1;
}

function createCard(card) {
    const el = document.createElement("div");
    el.className = "card";
    if (card.color === "red") el.classList.add("red");
    if (card.hidden) el.classList.add("hidden");
    else el.textContent = card.value + card.suit;

    el.card = card;

    el.draggable = !card.hidden;

    el.addEventListener("dragstart", () => {
        window.dragStack = getStack(card);
        el.classList.add("dragging");
    });

    el.addEventListener("dragend", () => {
        el.classList.remove("dragging");
        window.dragStack = null;
    });

    el.onclick = () => {
        if (card.hidden) {
            card.hidden = false;
            render();
        } else {
            autoMove(card);
        }
    };

    return el;
}

function getStack(card) {
    for (let col of tableau) {
        const i = col.indexOf(card);
        if (i !== -1) {
            return col.slice(i);
        }
    }
    if (waste.includes(card)) return [card];
}

function removeStack(stack) {
    tableau.forEach(col => {
        const i = col.indexOf(stack[0]);
        if (i !== -1) col.splice(i);
    });

    waste = waste.filter(c => c !== stack[0]);
}

function autoMove(card) {
    if (canFoundation(card)) {
        saveState();
        removeStack([card]);
        foundations[card.suit].push(card);
        render();
    }
}

function render() {
    const tEl = document.getElementById("tableau");
    const sEl = document.getElementById("stock");
    const wEl = document.getElementById("waste");

    tEl.innerHTML = "";
    sEl.innerHTML = "";
    wEl.innerHTML = "";

    sEl.textContent = stock.length ? "🂠" : "";
    sEl.onclick = drawFromStock;

    if (waste.length) {
        wEl.appendChild(createCard(waste[waste.length - 1]));
    }

    tableau.forEach(col => {
        const colEl = document.createElement("div");
        colEl.className = "column";

        col.forEach(card => {
            colEl.appendChild(createCard(card));
        });

        colEl.addEventListener("dragover", e => e.preventDefault());

        colEl.addEventListener("drop", () => {
            const stack = window.dragStack;
            if (!stack) return;

            const target = col[col.length - 1];

            if (canPlace(stack[0], target)) {
                saveState();
                removeStack(stack);
                col.push(...stack);
                render();
            }
        });

        tEl.appendChild(colEl);
    });

    document.querySelectorAll(".foundation").forEach(f => {
        const suit = f.dataset.suit;
        f.innerHTML = "";
        const pile = foundations[suit];

        if (pile.length) {
            f.appendChild(createCard(pile[pile.length - 1]));
        }

        f.addEventListener("dragover", e => e.preventDefault());

        f.addEventListener("drop", () => {
            const stack = window.dragStack;
            if (!stack || stack.length > 1) return;

            const card = stack[0];

            if (canFoundation(card)) {
                saveState();
                removeStack(stack);
                foundations[card.suit].push(card);
                render();
            }
        });
    });
}

initGame();