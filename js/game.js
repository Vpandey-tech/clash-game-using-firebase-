import { auth, database } from './firebase-config.js';
import { ref, set, onValue, get, update } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// Game variables
let score = 0;
let timeLeft = 30;
let timerInterval;
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const gridSize = 8;

// Audio elements
const correctSound = new Audio('sounds/correct.mp3');
const incorrectSound = new Audio('sounds/incorrect.mp3');

// DOM elements
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const timerProgress = document.getElementById('timer-progress');
const colorNameDisplay = document.getElementById('color-name');
const colorGrid = document.getElementById('color-grid');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const replayBtn = document.getElementById('replay-btn');
const leaderboardList = document.getElementById('leaderboard');
const livePlayersList = document.getElementById('live-players');
const gameError = document.getElementById('game-error');

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    startGame(user);
    loadLeaderboard();
    loadLivePlayers();
  }
});

// Start the game
function startGame(user) {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  timerProgress.style.width = '100%';
  gameOverScreen.style.display = 'none';
  gameError.style.display = 'none';
  updateLiveScore(user, score);
  generateRound();
  startTimer(user);
}

// Generate a new round
function generateRound() {
  colorGrid.innerHTML = '';
  const correctColor = colors[Math.floor(Math.random() * colors.length)];
  const correctIndex = Math.floor(Math.random() * gridSize);
  colorNameDisplay.textContent = correctColor;

  for (let i = 0; i < gridSize; i++) {
    const tile = document.createElement('div');
    tile.className = 'color-tile';
    const tileColor = i === correctIndex ? correctColor : getRandomColor();
    tile.style.backgroundColor = tileColor;
    tile.addEventListener('click', () => handleTileClick(tileColor, correctColor, auth.currentUser));
    colorGrid.appendChild(tile);
  }
}

// Get a random color
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Handle tile click
function handleTileClick(selectedColor, correctColor, user) {
  const tiles = document.querySelectorAll('.color-tile');
  if (selectedColor === correctColor) {
    score += 10;
    correctSound.play().catch((error) => {
      console.error('Error playing correct sound:', error);
    });
  } else {
    score = Math.max(0, score - 5);
    incorrectSound.play().catch((error) => {
      console.error('Error playing incorrect sound:', error);
    });
    tiles.forEach(tile => {
      if (tile.style.backgroundColor === selectedColor) {
        tile.classList.add('shake');
        setTimeout(() => tile.classList.remove('shake'), 500);
      }
    });
  }
  scoreDisplay.textContent = score;
  updateLiveScore(user, score);
  generateRound();
}

// Update live score in Firebase
function updateLiveScore(user, score) {
  const liveScoreRef = ref(database, `live_scores/${user.uid}`);
  set(liveScoreRef, {
    username: user.displayName || user.email.split('@')[0],
    score: score,
    timestamp: Date.now()
  }).catch((error) => {
    gameError.textContent = 'Error updating score: ' + error.message;
    gameError.style.display = 'block';
  });
}

// Start the 30-second timer
function startTimer(user) {
  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    timerDisplay.textContent = Math.ceil(timeLeft);
    timerProgress.style.width = `${(timeLeft / 30) * 100}%`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(user);
    }
  }, 100);
}

// End the game
function endGame(user) {
  gameOverScreen.style.display = 'block';
  finalScoreDisplay.textContent = score;
  colorGrid.innerHTML = '';
  saveScore(user, score);
  const liveScoreRef = ref(database, `live_scores/${user.uid}`);
  set(liveScoreRef, null);
}

// Save final score to Firebase
function saveScore(user, score) {
  const userRef = ref(database, `scores/${user.uid}`);
  get(userRef).then((snapshot) => {
    const data = snapshot.val();
    const highScore = data ? Math.max(data.highScore || 0, score) : score;
    set(userRef, {
      username: user.displayName || user.email.split('@')[0],
      highScore: highScore,
      lastScore: score
    }).catch((error) => {
      gameError.textContent = 'Error saving score: ' + error.message;
      gameError.style.display = 'block';
    });
  });
}

// Load leaderboard
function loadLeaderboard() {
  const scoresRef = ref(database, 'scores');
  onValue(scoresRef, (snapshot) => {
    leaderboardList.innerHTML = '';
    const data = snapshot.val();
    if (data) {
      const scores = Object.entries(data)
        .map(([uid, { username, highScore }]) => ({ username, highScore }))
        .sort((a, b) => b.highScore - a.highScore)
        .slice(0, 5);
      scores.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.username}: ${entry.highScore}`;
        leaderboardList.appendChild(li);
      });
    }
  }, (error) => {
    gameError.textContent = 'Error loading leaderboard: ' + error.message;
    gameError.style.display = 'block';
  });
}

// Load live players' scores
function loadLivePlayers() {
  const liveScoresRef = ref(database, 'live_scores');
  onValue(liveScoresRef, (snapshot) => {
    livePlayersList.innerHTML = '';
    const data = snapshot.val();
    if (data) {
      const liveScores = Object.entries(data)
        .map(([uid, { username, score }]) => ({ username, score }))
        .sort((a, b) => b.score - a.score);
      liveScores.forEach((entry) => {
        const li = document.createElement('li');
        li.textContent = `${entry.username}: ${entry.score}`;
        livePlayersList.appendChild(li);
      });
    }
  }, (error) => {
    gameError.textContent = 'Error loading live players: ' + error.message;
    gameError.style.display = 'block';
  });
}

// Replay game
replayBtn.addEventListener('click', () => {
  startGame(auth.currentUser);
});