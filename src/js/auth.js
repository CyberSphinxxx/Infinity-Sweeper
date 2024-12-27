let currentUser = null;
let leaderboardVisible = true;

function toggleAuthForm() {
    document.getElementById('login-form').style.display = 
        document.getElementById('login-form').style.display === 'none' ? 'block' : 'none';
    document.getElementById('register-form').style.display = 
        document.getElementById('register-form').style.display === 'none' ? 'block' : 'none';
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const users = JSON.parse(localStorage.getItem('infinitySweeperUsers') || '{}');
    
    if (users[username] && users[username].password === password) {
        currentUser = username;
        document.getElementById('login-register').style.display = 'none';
        document.getElementById('username-display').textContent = `Welcome, ${username}!`;
        updateLeaderboard();
        initGame();
    } else {
        showNotification('Invalid username or password');
    }
}

function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const users = JSON.parse(localStorage.getItem('infinitySweeperUsers') || '{}');
    
    if (users[username]) {
        showNotification('Username already exists');
    } else {
        users[username] = { password: password, scores: [] };
        localStorage.setItem('infinitySweeperUsers', JSON.stringify(users));
        showNotification('Registration successful. You can now log in.');
        toggleAuthForm();
    }
}

function logout() {
    currentUser = null;
    document.getElementById('login-register').style.display = 'flex';
    document.getElementById('username-display').textContent = '';
    updateLeaderboard();
}

function saveScore() {
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('infinitySweeperUsers') || '{}');
        if (!users[currentUser].scores) {
            users[currentUser].scores = [];
        }
        users[currentUser].scores.push({
            score: score,
            gridSize: gridSize,
            difficulty: difficulty
        });
        localStorage.setItem('infinitySweeperUsers', JSON.stringify(users));
        updateLeaderboard();
    }
}

function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    
    const users = JSON.parse(localStorage.getItem('infinitySweeperUsers') || '{}');
    const scores = [];
    const sortBy = document.getElementById('leaderboard-sort').value;
    
    for (const username in users) {
        const userScores = users[username].scores;
        if (userScores && userScores.length > 0) {
            let relevantScore;
            switch (sortBy) {
                case 'highScore':
                    relevantScore = Math.max(...userScores.map(s => s.score));
                    break;
                case 'avgScore':
                    relevantScore = userScores.reduce((sum, s) => sum + s.score, 0) / userScores.length;
                    break;
                case 'gamesPlayed':
                    relevantScore = userScores.length;
                    break;
            }
            scores.push({ username, score: relevantScore });
        }
    }
    
    scores.sort((a, b) => b.score - a.score);
    
    scores.slice(0, 10).forEach((score, index) => {
        const li = document.createElement('div');
        li.className = 'leaderboard-item';
        li.innerHTML = `
            <span class="leaderboard-rank">#${index + 1}</span>
            <span class="leaderboard-name">${score.username}</span>
            <span class="leaderboard-score">${Math.round(score.score)}</span>
        `;
        leaderboardList.appendChild(li);
    });
}

function playWithoutAccount() {
    currentUser = null;
    document.getElementById('login-register').style.display = 'none';
    document.getElementById('username-display').textContent = 'Guest';
    initGame();
}

