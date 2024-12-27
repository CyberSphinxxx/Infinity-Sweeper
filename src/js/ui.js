function setTheme(theme) {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('infinitySweeperTheme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.theme-btn.${theme}`).classList.add('active');
}

function toggleLeaderboard() {
    const leaderboardSection = document.querySelector('.leaderboard-section');
    const gameSection = document.querySelector('.game-section');
    const container = document.querySelector('.container');
    const toggleButton = document.querySelector('.toggle-leaderboard');

    leaderboardVisible = !leaderboardVisible;

    if (leaderboardVisible) {
        leaderboardSection.style.display = 'block';
        gameSection.style.flex = '1.5';
        container.style.justifyContent = 'space-between';
        toggleButton.textContent = 'Hide Leaderboard';
    } else {
        leaderboardSection.style.display = 'none';
        gameSection.style.flex = '1';
        container.style.justifyContent = 'center';
        toggleButton.textContent = 'Show Leaderboard';
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

