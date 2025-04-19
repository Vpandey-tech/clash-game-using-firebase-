import { auth, database } from './firebase-config.js';
import { ref, set, onValue, get } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { logout } from './auth.js';

let score = 0;
let timeLeft = 40; // Changed to 40 seconds
let timerInterval;
let pattern = [];
let playerGrid = [];
let lockedTiles = []; // Track locked tiles
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
const correctSound = new Audio('sounds/correct.mp3');
const incorrectSound = new Audio('sounds/incorrect.mp3');

const patternGrid = document.getElementById('pattern-grid');
const playerGridEl = document.getElementById('player-grid');
const timer = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const finalScore = document.getElementById('final-score');
const playAgain = document.getElementById('play-again');
const leaderboard = document.getElementById('leaderboard');
const livePlayers = document.getElementById('live-players');

// Convert RGB to Hex for consistent color comparison
function rgbToHex(rgb) {
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return rgb;
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toLowerCase();
}

function generatePattern() {
  pattern = [];
  for (let i = 0; i < 16; i++) {
    pattern.push(colors[Math.floor(Math.random() * colors.length)]);
  }
}

function renderGrid(gridEl, gridData, clickable = false) {
  gridEl.innerHTML = '';
  gridData.forEach((color, i) => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    if (lockedTiles[i]) tile.classList.add('locked'); // Apply locked class
    tile.style.backgroundColor = color;
    if (clickable && !lockedTiles[i]) {
      tile.addEventListener('click', () => handleTileClick(i));
    }
    gridEl.appendChild(tile);
  });
}

function handleTileClick(index) {
  if (lockedTiles[index]) return; // Skip if tile is locked
  const tile = playerGridEl.children[index];
  // Get current color index, cycle to next color
  let currentColor = playerGrid[index] || '#ccc';
  let currentIndex = colors.indexOf(currentColor);
  if (currentIndex === -1) currentIndex = colors.length - 1; // Handle initial gray
  const nextIndex = (currentIndex + 1) % colors.length;
  const newColor = colors[nextIndex];

  // Update player grid and DOM
  playerGrid[index] = newColor;
  tile.style.backgroundColor = newColor;

  // Compare with pattern
  if (newColor === pattern[index]) {
    score += 15;
    correctSound.play().catch(e => console.error('Sound error:', e));
    lockedTiles[index] = true; // Lock the tile
    tile.classList.add('locked'); // Apply locked styling
    if (playerGrid.every((c, i) => c === pattern[i]) && timeLeft > 20) { // Updated to 20 seconds
      score += 50;
      endGame();
    }
  } else {
    score = Math.max(0, score - 5);
    incorrectSound.play().catch(e => console.error('Sound error:', e));
    tile.classList.add('fade');
    setTimeout(() => tile.classList.remove('fade'), 500);
  }
  scoreDisplay.textContent = `Score: ${score}`;
  updateLiveScore();
}

function startGame() {
  score = 0;
  timeLeft = 40; // Changed to 40 seconds
  scoreDisplay.textContent = `Score: ${score}`;
  finalScore.style.display = 'none';
  playAgain.style.display = 'none';
  playerGridEl.style.pointerEvents = 'auto';
  playerGridEl.style.display = 'none'; // Ensure player grid is hidden
  // Reset pattern grid styles to grid
  patternGrid.style.display = 'grid';
  patternGrid.style.alignItems = '';
  patternGrid.style.justifyContent = '';
  patternGrid.style.height = '';
  generatePattern();
  playerGrid = Array(16).fill('#ccc');
  lockedTiles = Array(16).fill(false); // Reset locked tiles
  renderGrid(patternGrid, pattern);
  setTimeout(() => {
    patternGrid.innerHTML = '<p class="pattern-message">Recreate the pattern!</p>';
    patternGrid.style.display = 'flex';
    patternGrid.style.alignItems = 'center';
    patternGrid.style.justifyContent = 'center';
    patternGrid.style.height = '100%';
    playerGridEl.style.display = 'grid'; // Show player grid
    renderGrid(playerGridEl, playerGrid, true);
  }, 3000);
  timer.style.width = '100%';
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    timer.style.width = `${(timeLeft / 40) * 100}%`; // Updated for 40 seconds
    if (timeLeft <= 0) endGame();
  }, 100);
  updateLiveScore();
}

function endGame() {
  clearInterval(timerInterval);
  playerGridEl.style.pointerEvents = 'none';
  finalScore.textContent = `Final Score: ${score}`;
  finalScore.style.display = 'block';
  playAgain.style.display = 'inline-block';
  patternGrid.style.display = 'none';
  updateHighScore();
}

function updateHighScore() {
  const user = auth.currentUser;
  if (!user) return;
  const scoreRef = ref(database, `scores/pixel_painter/${user.uid}`);
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
  set(ref(database, `live_scores/pixel_painter/${user.uid}`), {
    username: user.email.split('@')[0],
    score,
    timestamp: Date.now()
  });
}

function updateLeaderboard() {
  const scoresRef = ref(database, 'scores/pixel_painter');
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
  const liveRef = ref(database, 'live_scores/pixel_painter');
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

// Add event listener for Play Again button
playAgain.addEventListener('click', startGame);

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