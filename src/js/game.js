let gridSize = 16;
let mineCount = Math.floor(gridSize * gridSize * 0.15);
let grid = [];
let revealed = [];
let flagged = [];
let gameOver = false;
let score = 0;
let firstClick = true;
let difficulty = 'medium';

function setDifficulty() {
    difficulty = document.getElementById('difficulty').value;
    initGame();
}

function getDifficultyMultiplier() {
    switch (difficulty) {
        case 'easy': return 0.1;
        case 'medium': return 0.15;
        case 'hard': return 0.2;
        default: return 0.15;
    }
}

function setGridSize(size) {
    gridSize = size;
    initGame();
}

function setCustomGridSize() {
    const customSize = document.getElementById('custom-size').value;
    if (customSize >= 4 && customSize <= 50) {
        setGridSize(parseInt(customSize));
    } else {
        showNotification('Please enter a size between 4 and 50.');
    }
}

function initGame() {
    gameOver = false;
    firstClick = true;
    grid = [];
    revealed = [];
    flagged = [];
    score = 0;
    updateScore();

    mineCount = Math.floor(gridSize * gridSize * getDifficultyMultiplier());
    updateMinesLeft();

    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        revealed[i] = [];
        flagged[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = 0;
            revealed[i][j] = false;
            flagged[i][j] = false;
        }
    }

    renderGrid();
}

function placeMines(excludeRow, excludeCol) {
    for (let i = 0; i < mineCount; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * gridSize);
            y = Math.floor(Math.random() * gridSize);
        } while (grid[x][y] === -1 || (x === excludeRow && y === excludeCol));
        grid[x][y] = -1;

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (x + dx >= 0 && x + dx < gridSize && y + dy >= 0 && y + dy < gridSize && grid[x + dx][y + dy] !== -1) {
                    grid[x + dx][y + dy]++;
                }
            }
        }
    }
}

function renderGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${gridSize}, auto)`;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => revealCell(i, j));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagCell(i, j);
            });
            gridElement.appendChild(cell);
        }
    }
}

function revealCell(row, col) {
    if (gameOver || revealed[row][col] || flagged[row][col]) return;

    if (firstClick) {
        firstClick = false;
        placeMines(row, col);
    }

    revealed[row][col] = true;
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add('revealed');

    if (grid[row][col] === -1) {
        gameOver = true;
        cell.classList.add('mine');
        cell.textContent = '💣';
        revealAllMines();
        endGame(false);
    } else {
        if (grid[row][col] > 0) {
            cell.textContent = grid[row][col];
            score++;
        } else {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (row + dx >= 0 && row + dx < gridSize && col + dy >= 0 && col + dy < gridSize && !revealed[row + dx][col + dy]) {
                        revealCell(row + dx, col + dy);
                    }
                }
            }
        }
        updateScore();
    }

    checkWinCondition();
}

function revealAllMines() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === -1) {
                const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                cell.classList.add('revealed', 'mine');
                cell.textContent = '💣';
            }
        }
    }
}

function flagCell(row, col) {
    if (gameOver || revealed[row][col]) return;

    flagged[row][col] = !flagged[row][col];
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.textContent = flagged[row][col] ? '🚩' : '';
    if (flagged[row][col] && grid[row][col] === -1) {
        score++;
        updateScore();
    } else if (!flagged[row][col] && grid[row][col] === -1) {
        score--;
        updateScore();
    }
    updateMinesLeft();
    checkWinCondition();
}

function updateMinesLeft() {
    const flaggedCount = flagged.flat().filter(Boolean).length;
    document.getElementById('mines-left').textContent = `Mines: ${mineCount - flaggedCount}`;
}

function checkWinCondition() {
    let revealedCount = 0;
    let correctFlagCount = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (revealed[i][j]) revealedCount++;
            if (flagged[i][j] && grid[i][j] === -1) correctFlagCount++;
        }
    }

    if (revealedCount === gridSize * gridSize - mineCount || correctFlagCount === mineCount) {
        continueGame();
    }
}

function continueGame() {
    mineCount = Math.floor(mineCount * 1.2);
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = 0;
            revealed[i][j] = false;
            flagged[i][j] = false;
        }
    }

    for (let i = 0; i < mineCount; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * gridSize);
            y = Math.floor(Math.random() * gridSize);
        } while (grid[x][y] === -1);
        grid[x][y] = -1;

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (x + dx >= 0 && x + dx < gridSize && y + dy >= 0 && y + dy < gridSize && grid[x + dx][y + dy] !== -1) {
                    grid[x + dx][y + dy]++;
                }
            }
        }
    }

    renderGrid();
    updateMinesLeft();
    showNotification('Level cleared! Continuing with increased difficulty...');
}

function endGame(won) {
    gameOver = true;

    if (won) {
        showNotification(`Congratulations! You won with a score of ${score}. Starting a new game...`);
    } else {
        showNotification(`Game Over! Your final score is ${score}. Starting a new game...`);
    }
    saveScore();
    setTimeout(initGame, 3000);
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

