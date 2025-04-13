let player1Wins = 0;
let player2Wins = 0;

let player1WinsDisplay;
let player2WinsDisplay;
let player1NameDisplay;
let player2NameDisplay;

let boxes = document.querySelectorAll(".box");
let turn = "X";
let isGameOver = false;
let isAgainstAI = false;
let aiName = "wigoGPT";
let playerName = "You";

const urlParams = new URLSearchParams(window.location.search);
const player1Name = urlParams.get('player1');
const player2Name = urlParams.get('player2');
const aiParam = urlParams.get('ai');

document.addEventListener('DOMContentLoaded', () => {
    player1WinsDisplay = document.getElementById("player1Wins");
    player2WinsDisplay = document.getElementById("player2Wins");
    player1NameDisplay = document.getElementById("player1NameDisplay");
    player2NameDisplay = document.getElementById("player2NameDisplay");

    if (player1Name) {
        player1NameDisplay.innerText = `${player1Name} (X)`;
        playerName = player1Name;
    }
    if (player2Name) {
        player2NameDisplay.innerText = `${player2Name} (O)`;
        aiName = player2Name;
    }
    if (aiParam === 'true') {
        isAgainstAI = true;
        if (turn === 'O') {
            setTimeout(playAI, 500);
        }
    }

    boxes.forEach(e =>{
        e.innerHTML = "";
        e.addEventListener("click", () => {
            if (!isGameOver && e.innerHTML === "") {
                e.innerHTML = turn;
                cheakWin();
                cheakDraw();
                changeTurn();
                if (isAgainstAI && !isGameOver && turn === "O") {
                    setTimeout(playAI, 500);
                }
            }
        });
    });

    document.querySelector("#play-again").addEventListener("click", resetGame);
});

function changeTurn(){
    if(turn === "X"){
        turn = "O";
        document.querySelector(".bg").style.left = "85px";
    } else {
        turn = "X";
        document.querySelector(".bg").style.left = "0";
    }
}

function cheakWin(){
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for(let i = 0; i < winConditions.length; i++){
        let v0 = boxes[winConditions[i][0]].innerHTML;
        let v1 = boxes[winConditions[i][1]].innerHTML;
        let v2 = boxes[winConditions[i][2]].innerHTML;

        if(v0 != "" && v0 === v1 && v0 === v2){
            isGameOver = true;
            document.querySelector("#results").innerHTML = `${turn === "X" ? player1Name : player2Name} wins!`;
            document.querySelector("#play-again").style.display = "inline";

            for(let j = 0; j < 3; j++){
                boxes[winConditions[i][j]].style.backgroundColor = "#08D9D6";
                boxes[winConditions[i][j]].style.color = "#000";
            }

            updateScore();
            return;
        }
    }
}

function cheakDraw(){
    if(!isGameOver){
        let isDraw = true;
        boxes.forEach(e =>{
            if(e.innerHTML === "") isDraw = false;
        });

        if(isDraw){
            isGameOver = true;
            document.querySelector("#results").innerHTML = "Draw!";
            document.querySelector("#play-again").style.display = "inline";
        }
    }
}

function resetGame(){
    isGameOver = false;
    turn = "X";
    document.querySelector(".bg").style.left = "0";
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(e =>{
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff";
    });
    if (isAgainstAI && turn === "O") {
        setTimeout(playAI, 500);
    }
}

function updateScore(){
    let player1WinsDisplay = document.getElementById("player1Wins");
    let player2WinsDisplay = document.getElementById("player2Wins");

    if(turn === "X"){
        player1Wins++;
        player1WinsDisplay.innerText = `Wins: ${player1Wins}`;
        player1WinsDisplay.classList.add("win-effect");
        setTimeout(() => {
            player1WinsDisplay.classList.remove("win-effect");
        }, 500); // نفس مدة التأثير في الـ CSS
    } else {
        player2Wins++;
        player2WinsDisplay.innerText = `Wins: ${player2Wins}`;
        player2WinsDisplay.classList.add("win-effect");
        setTimeout(() => {
            player2WinsDisplay.classList.remove("win-effect");
        }, 500); // نفس مدة التأثير في الـ CSS
    }
}

function playAI() {
    if (!isGameOver) {
        let bestMove;
        let bestScore = -Infinity;

        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].innerHTML === "") {
                boxes[i].innerHTML = "O";
                let score = minimax(boxes, 0, false);
                boxes[i].innerHTML = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        if (bestMove !== undefined) {
            boxes[bestMove].innerHTML = "O";
            cheakWin();
            cheakDraw();
            changeTurn();
        }
    }
}

function minimax(board, depth, isMaximizing) {
    let scores = {
        X: -1,
        O: 1,
        draw: 0
    };

    let winner = cheakMinimaxWin(board);
    if (winner) {
        return scores[winner];
    }
    if (cheakMinimaxDraw(board)) {
        return scores.draw;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i].innerHTML === "") {
                board[i].innerHTML = "O";
                let score = minimax(board, depth + 1, false);
                board[i].innerHTML = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i].innerHTML === "") {
                board[i].innerHTML = "X";
                let score = minimax(board, depth + 1, true);
                board[i].innerHTML = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function cheakMinimaxWin(board) {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < winConditions.length; i++) {
        let a = board[winConditions[i][0]].innerHTML;
        let b = board[winConditions[i][1]].innerHTML;
        let c = board[winConditions[i][2]].innerHTML;
        if (a !== "" && a === b && a === c) {
            return a;
        }
    }
    return null;
}

function cheakMinimaxDraw(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i].innerHTML === "") {
            return false;
        }
    }
    return true;
}

