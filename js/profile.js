import { auth, database } from './firebase-config.js';
import { get, ref } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const usernameEl = document.getElementById('username');
  const emailEl = document.getElementById('email');
  const historyEl = document.getElementById('history');
  const errorEl = document.getElementById('error');

  errorEl.style.display = 'none';

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      errorEl.textContent = 'User not authenticated. Please log in again.';
      errorEl.style.display = 'block';
      return;
    }

    try {
      // Log user UID for debugging
      console.log('User UID:', user.uid);

      // Fetch game history from live_scores
      historyEl.innerHTML = '';
      const games = ['pixel_painter', 'color_clash'];
      let historyItems = [];

      // Query live_scores/$game/$uid
      for (const game of games) {
        const scoresRef = ref(database, `live_scores/${game}/${user.uid}`);
        const scoresSnapshot = await get(scoresRef);
        console.log(`Live scores for live_scores/${game}/${user.uid}:`, scoresSnapshot.val());

        if (scoresSnapshot.exists()) {
          const scoreData = scoresSnapshot.val();
          console.log(`Score data for ${game}:`, scoreData);

          // Expect flat object: { score, timestamp, username }
          const score = scoreData.score ?? scoreData.value ?? null;
          const timestamp = scoreData.timestamp ?? scoreData.date ?? null;

          // Validate score and timestamp
          const parsedScore = typeof score === 'string' ? parseFloat(score) : score;
          if (parsedScore != null && !isNaN(parsedScore) && timestamp != null) {
            const date = new Date(
              typeof timestamp === 'number' ? timestamp : timestamp
            );
            if (!isNaN(date.getTime())) {
              historyItems.push({
                game: game.replace('_', ' '),
                score: parsedScore,
                date: date.toLocaleString(),
                timestamp: date.getTime()
              });
            } else {
              console.log('Invalid timestamp:', { score: parsedScore, timestamp });
            }
          } else {
            console.log('Invalid score or missing timestamp:', scoreData);
          }
        } else {
          console.log(`No data at live_scores/${game}/${user.uid}`);
        }
      }

      // Sort by timestamp (newest first)
      historyItems.sort((a, b) => b.timestamp - a.timestamp);

      // Display history
      if (historyItems.length > 0) {
        historyItems.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = `${item.game} - Score: ${item.score}, Date: ${item.date}`;
          historyEl.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = 'No game history yet';
        historyEl.appendChild(li);
      }

      // Fetch user data
      const userRef = ref(database, 'users/' + user.uid);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        usernameEl.textContent = `Username: ${userData.username || 'Not set'}`;
        emailEl.textContent = `Email: ${userData.email || user.email || 'Not set'}`;
      } else {
        usernameEl.textContent = 'Username: Not set';
        emailEl.textContent = `Email: ${user.email || 'Not set'}`;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      errorEl.textContent = 'Failed to load profile. Please try again.';
      errorEl.style.display = 'block';
    }
  });
});