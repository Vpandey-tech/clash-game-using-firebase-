Color Clash Game
Color Clash is an engaging, real-time, multiplayer web game built with HTML, JavaScript, and Firebase. Players test their speed and accuracy by matching displayed color names to corresponding tiles in a 4x2 grid within a 30-second time limit. Correct matches earn 10 points, while incorrect ones deduct 5 points, with a minimum score of 0. The game integrates Firebase Authentication for secure user management, Firebase Realtime Database for live score updates, and Firebase Hosting for global accessibility. Enhanced with sound effects and a shake animation for incorrect clicks, Color Clash offers a vibrant, interactive experience suitable for learning web development, cloud computing, and real-time database integration.
Table of Contents

Features
Technologies Used
Project Structure
Setup Instructions
Prerequisites
Installation
Firebase Configuration


Running Locally
Deploying to Firebase Hosting
How to Play
Testing Sound and Shake Effects
Firebase Database Structure
Security Rules
Troubleshooting
Future Enhancements
Contributing
License
Contact

Features

Secure Authentication: Register and log in using Firebase Authentication with email and password.
Real-Time Multiplayer: Live score updates synced across players via Firebase Realtime Database.
Core Gameplay:
Match color names (e.g., “Red”) to tiles in a 4x2 grid within 30 seconds.
Scoring: +10 points for correct clicks, -5 points for incorrect clicks (minimum 0).
Dynamic timer with a visual progress bar.


Sound Effects: Audio feedback with correct.mp3 for correct clicks and incorrect.mp3 for incorrect clicks.
Shake Animation: Tiles shake for 0.5 seconds on incorrect clicks, enhancing visual feedback.
Leaderboard: Displays the top 5 high scores globally.
Live Players: Shows real-time scores of active players.
Responsive Design: Built with vanilla CSS for a colorful, user-friendly interface on desktop and mobile.
Cloud Deployment: Hosted on Firebase Hosting for scalability and low-latency access.

Technologies Used

Frontend:
HTML5: Structures pages (index.html, login.html, game.html).
JavaScript (ES6 Modules): Handles game logic, Firebase integration, and dynamic updates (game.js, auth.js, logout.js).
Vanilla CSS: Provides styling, animations (e.g., shake effect), and responsive layouts.


Backend:
Firebase Authentication: Manages user registration and login.
Firebase Realtime Database: Stores and syncs scores in real time.
Firebase Hosting: Serves static files globally.


Development Tools:
Node.js (>=20.0.0): Powers Firebase CLI and local server.
Firebase CLI (>=14.2.0): Initializes and deploys the project.
Lite-Server: Runs a local development server.
Git: Version control with GitHub for source code management.



Project Structure
color-clash-game/
├── index.html          # Entry point, redirects to login.html
├── login.html          # Authentication page for login and registration
├── game.html           # Main game interface with shake animation CSS
├── js/
│   ├── firebase-config.js  # Firebase project configuration
│   ├── auth.js            # User authentication logic
│   ├── game.js            # Game mechanics, sound, and shake effects
│   ├── logout.js          # Logout functionality
├── sounds/
│   ├── correct.mp3        # Audio for correct tile clicks
│   ├── incorrect.mp3      # Audio for incorrect tile clicks
├── README.md              # Project documentation (this file)
├── package.json           # Node.js dependencies and scripts
├── bs-config.json         # Lite-Server configuration
├── firebase.json          # Firebase Hosting configuration
├── .firebaserc            # Firebase project settings

Setup Instructions
Prerequisites

Node.js: Version >=20.0.0. Install from nodejs.org.
Firebase Account: Create an account at firebase.google.com.
Git: Installed for cloning the repository. Download from git-scm.com.
Text Editor: VS Code or similar for editing code.

Installation

Clone the Repository:
git clone https://github.com/Vpandey-tech/clash-game-using-firebase-.git
cd color-clash-game


Install Dependencies:

Install project dependencies (e.g., lite-server):npm install


Install Firebase CLI globally:npm install -g firebase-tools




Authenticate with Firebase:
firebase login


Follow the browser prompt to log in to your Firebase account.



Firebase Configuration

Create a Firebase Project:

Visit the Firebase Console.
Click “Add project,” name it (e.g., colorclashgame), and enable Analytics (optional).


Enable Firebase Services:

Authentication: In the Authentication tab, enable the Email/Password provider.
Realtime Database: Create a database in test mode (secure with rules later).
Hosting: Set up via CLI during deployment.


Configure firebase-config.js:

In the Firebase Console, go to Project Settings > General > Your apps > Add app > Web.
Copy the Firebase configuration object.
Update js/firebase-config.js:export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};




Add Sound Files (if missing):

Download royalty-free correct.mp3 and incorrect.mp3 from Freesound.org.
Place in the sounds/ folder:sounds/
├── correct.mp3
├── incorrect.mp3





Running Locally

Start the Local Server:
npm start


Opens http://localhost:3000, redirecting to login.html.


Test the Game:

Register or log in.
Play the game, checking sound effects, shake animation, leaderboard, and live player scores.
Open Developer Tools (F12 > Console) to monitor for errors.



Deploying to Firebase Hosting

Initialize Firebase Hosting (if not already done):
firebase init hosting


Select your Firebase project (colorclashgame).
Set the public directory to . (root).
Answer N to “Configure as a single-page app” unless redirect rules are needed.


Deploy:
firebase deploy --only hosting


Deploys to https://colorclashgame-d55a3.web.app.


Verify Deployment:

Open the hosted URL and test all features.
Clear browser cache (Ctrl+Shift+R) if updates don’t appear immediately.



How to Play

Access the Game:

Navigate to https://colorclashgame-d55a3.web.app or http://localhost:3000 (local).
Register or log in using an email and password.


Gameplay:

A color name (e.g., “Red”) appears with an 8-tile grid (4x2).
Click the tile matching the color name within 30 seconds.
Correct Click: +10 points, plays correct.mp3.
Incorrect Click: -5 points, plays incorrect.mp3, tile shakes for 0.5 seconds.
Game ends after 30 seconds, displaying the final score.


Additional Features:

Leaderboard: View top 5 high scores.
Live Players: See real-time scores of other players.
Replay: Click “Play Again” to start a new game.
Logout: Exit to login.html.



Testing Sound and Shake Effects
To verify the sound effects and shake animation:

Local Testing:

Run npm start and access http://localhost:3000.
Log in and start a game.
Shake Effect:
Click an incorrect tile (e.g., blue when “Red” is shown).
Expected: Tile shakes left-right for 0.5 seconds (~10px movement).


Sound Effects:
Correct click: correct.mp3 plays.
Incorrect click: incorrect.mp3 plays.


Check console (F12 > Console) for errors (e.g., “Error playing sound”).


Hosted Testing:

Open https://colorclashgame-d55a3.web.app.
Repeat the above tests.
Use incognito mode or clear cache if effects don’t appear.


Debugging:

No Shake:
Check game.html for:.shake {
  animation: shake 0.5s;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
}


Check game.js for:tiles.forEach(tile => {
  if (tile.style.backgroundColor === selectedColor) {
    tile.classList.add('shake');
    setTimeout(() => tile.classList.remove('shake'), 500);
  }
});


Ensure tiles have class="color-tile".


No Sound:
Verify sounds/correct.mp3 and sounds/incorrect.mp3 exist.
Check browser audio permissions.
Test with .wav files if .mp3 fails.





Firebase Database Structure
The Firebase Realtime Database stores:

users/{userId}: User data (username, email).
scores/{userId}: High and last scores for leaderboard.
live_scores/{userId}: Real-time scores during gameplay.

Example:
{
  "users": {
    "uid123": {
      "username": "player1",
      "email": "player1@example.com"
    }
  },
  "scores": {
    "uid123": {
      "username": "player1",
      "highScore": 60,
      "lastScore": 40
    }
  },
  "live_scores": {
    "uid123": {
      "username": "player1",
      "score": 30,
      "timestamp": 1698765432100
    }
  }
}

Security Rules
Firebase Realtime Database security rules ensure data integrity:
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth.uid === $uid",
        ".write": "auth.uid === $uid"
      }
    },
    "scores": {
      ".read": true,
      "$uid": {
        ".write": "auth.uid === $uid"
      }
    },
    "live_scores": {
      ".read": true,
      "$uid": {
        ".write": "auth.uid === $uid"
      }
    }
  }
}


Users can read/write their own data.
Scores and live scores are publicly readable, writable only by the user.

Troubleshooting



Issue
Solution



Git Push Rejection
Run git pull origin main, resolve conflicts, then git push.


Firebase Deployment Fails
Verify Node.js >=20.0.0, Firebase CLI >=14.2.0, run firebase login.


No Shake Effect
Check CSS in game.html, JavaScript in game.js, inspect tile elements.


No Sound
Confirm sounds/ files, check console for errors, test browser audio.


Login Issues
Verify firebase-config.js and Authentication settings in Firebase Console.


Future Enhancements

Add background music with a mute toggle.
Implement game rooms for private multiplayer sessions.
Introduce difficulty levels (e.g., shorter timer, larger grid).
Integrate Firebase Analytics for player insights.
Support offline play with cached assets.

Contributing
To contribute:

Fork the repository.
Create a feature branch: git checkout -b feature-name.
Commit changes: git commit -m "Add feature".
Push: git push origin feature-name.
Open a pull request on GitHub.

License
This project is licensed under the MIT License. See LICENSE for details.
Contact

Author: Vpandey-tech
GitHub: Vpandey-tech
Issues: Report bugs or suggestions via GitHub Issues

