import { auth, database } from './firebase-config.js';
import { ref, set, onValue, get } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { logout } from './auth.js';

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
let score = 0;
let timeLeft = 30;
let timerInterval;
const correctSound = new Audio('sounds/correct.mp3');
const incorrectSound = new Audio('sounds/incorrect.mp3');

const colorName = document.getElementById('color-name');
const colorGrid = document.getElementById('color-grid');
const timer = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const finalScore = document.getElementById('final-score');
const playAgain = document.getElementById('play-again');
const leaderboard = document.getElementById('leaderboard');
const livePlayers = document.getElementById('live-players');

function generateRound() {
  const correctColor = colors[Math.floor(Math.random() * colors.length)];
  const gridColors = [correctColor];
  while (gridColors.length < 8) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (!gridColors.includes(color)) gridColors.push(color);
  }
  gridColors.sort(() => Math.random() - 0.5);
  colorName.textContent = correctColor;
  colorGrid.innerHTML = '';
  gridColors.forEach(color => {
    const tile = document.createElement('div');
    tile.classList.add('color-tile');
    tile.style.backgroundColor = color;
    tile.addEventListener('click', () => handleTileClick(color, correctColor));
    colorGrid.appendChild(tile);
  });
}

function handleTileClick(selectedColor, correctColor) {
  const tiles = document.querySelectorAll('.color-tile');
  if (selectedColor === correctColor) {
    score += 10;
    correctSound.play().catch(e => console.error('Sound error:', e));
  } else {
    score = Math.max(0, score - 5);
    incorrectSound.play().catch(e => console.error('Sound error:', e));
    tiles.forEach(tile => {
      if (tile.style.backgroundColor === selectedColor) {
        tile.classList.add('shake');
        setTimeout(() => tile.classList.remove('shake'), 500);
      }
    });
  }
  scoreDisplay.textContent = `Score: ${score}`;
  updateLiveScore();
  generateRound();
}

function startGame() {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = `Score: ${score}`;
  finalScore.style.display = 'none';
  playAgain.style.display = 'none';
  colorGrid.style.pointerEvents = 'auto';
  generateRound();
  timer.style.width = '100%';
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    timer.style.width = `${(timeLeft / 30) * 100}%`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      colorGrid.style.pointerEvents = 'none';
      finalScore.textContent = `Final Score: ${score}`;
      finalScore.style.display = 'block';
      playAgain.style.display = 'inline-block';
      updateHighScore();
    }
  }, 100);
  updateLiveScore();
}

function updateHighScore() {
  const user = auth.currentUser;
  if (!user) return;
  const scoreRef = ref(database, `scores/color_clash/${user.uid}`);
  get(scoreRef).then(snapshot => {
    const data = snapshot.val();
    const highScore = data ? Math.max(data.highScore || 0, score) : score;
    set(scoreRef, {
      username: user.email.split('@')[0],
      highScore,
      lastScore: score
    });
  });
}

function updateLiveScore() {
  const user = auth.currentUser;
  if (!user) return;
  set(ref(database, `live_scores/color_clash/${user.uid}`), {
    username: user.email.split('@')[0],
    score,
    timestamp: Date.now()
  });
}

function updateLeaderboard() {
  const scoresRef = ref(database, 'scores/color_clash');
  onValue(scoresRef, snapshot => {
    const scores = [];
    snapshot.forEach(child => {
      const data = child.val();
      scores.push({ username: data.username, highScore: data.highScore });
    });
    scores.sort((a, b) => b.highScore - a.highScore);
    leaderboard.innerHTML = scores.slice(0, 5).map(s => `<li>${s.username}: ${s.highScore}</li>`).join('');
  });
}

function updateLivePlayers() {
  const liveRef = ref(database, 'live_scores/color_clash');
  onValue(liveRef, snapshot => {
    const players = [];
    snapshot.forEach(child => {
      const data = child.val();
      if (Date.now() - data.timestamp < 60000) {
        players.push({ username: data.username, score: data.score });
      }
    });
    livePlayers.innerHTML = players.map(p => `<li>${p.username}: ${p.score}</li>`).join('');
  });
}

window.logout = logout;

auth.onAuthStateChanged(user => {
  if (user) {
    startGame();
    updateLeaderboard();
    updateLivePlayers();
  } else {
    window.location.href = 'login.html';
  }
});