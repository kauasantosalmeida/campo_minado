// Variável para controlar a visibilidade do pop-up de ajuda
let popupVisivel = false;


// Função para mostrar e esconder o pop-up
function mostrarPopup() {
    const popup = document.getElementById("popup");
    
    if (popupVisivel) {
        popup.style.display = "none";
        popupVisivel = false;
    } else {
        popup.style.display = "block";
        popupVisivel = true;
    }
}

// Código do Campo Minado
var board = [];
var rows = 8;
var columns = 8;
var minesCount = 5;
var minesLocation = [];
var tilesClicked = 0;
var flagEnabled = false;
var gameOver = false;

window.onload = function() {
    startGame();
}

// Função para definir as minas no tabuleiro
function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random()* rows);  
        let c = Math.floor(Math.random()* columns); 
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

// Função para iniciar o jogo
function startGame(){
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    for (let r = 0; r < rows; r++){
        let row = [];
        for (let c = 0; c < columns; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);    
    }
}

// Função para ativar/desativar a bandeira
function setFlag() {
    if (flagEnabled){
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

// Função para clicar nas células do tabuleiro
function clickTile() {
    if (gameOver || this.classList.contains("tile-checked")){
        return;
    }

    let tile = this;
    if (flagEnabled){
        if (tile.innerText == ""){
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩"){
            tile.innerText = "";   
        }
        return;
    }

    if (minesLocation.includes(tile.id)){
        gameOver = true;
        reveaMines();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

// Função para revelar as minas quando o jogo termina
function reveaMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++){
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

// Função para verificar as células vizinhas de uma mina
function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return; 
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    minesFound += checkTile(r - 1, c - 1);
    minesFound += checkTile(r - 1, c);
    minesFound += checkTile(r - 1, c + 1);

    minesFound += checkTile(r, c - 1);
    minesFound += checkTile(r, c + 1);

    minesFound += checkTile(r + 1, c - 1);
    minesFound += checkTile(r + 1, c);
    minesFound += checkTile(r + 1, c + 1);

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    } else {
        checkMine(r - 1, c - 1);
        checkMine(r - 1, c);
        checkMine(r - 1, c + 1);

        checkMine(r, c - 1);
        checkMine(r, c + 1);

        checkMine(r + 1, c - 1);
        checkMine(r + 1, c);
        checkMine(r + 1, c + 1);
    }

    if (tilesClicked === rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}

// Função para verificar se há mina nas células vizinhas
function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

function resetPage() {
  location.reload();  // Recarrega a página
}
