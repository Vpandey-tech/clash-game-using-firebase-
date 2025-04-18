Color Clash
Color Clash is an engaging, multiplayer web-based game where players test their color recognition skills under a 30-second timer. Built with HTML, JavaScript, Firebase, and styled with Tailwind CSS (via CDN), the game features user authentication, real-time multiplayer score tracking, a leaderboard, and a vibrant UI with animations. Deployed on Firebase Hosting, it offers a seamless experience for players to compete globally.
Features

User Authentication: Secure login and registration using Firebase Authentication.
Gameplay: Match the displayed color name to the correct tile within 30 seconds (+10 points for correct, -5 for incorrect).
Real-Time Multiplayer: Live player scores displayed in real-time using Firebase Realtime Database.
Leaderboard: Top 5 high scores globally, updated in real-time.
Responsive Design: Sleek UI with Tailwind CSS, featuring gradient backgrounds, hover animations, and a timer progress bar.
Optional Enhancements:
Sound effects for correct/incorrect clicks.
Shake animation for incorrect tile selections.


Firebase Integration: Handles user data, scores, and live updates securely.
Deployment: Hosted on Firebase Hosting for fast, scalable access.

Demo
Play the game live at: https://colorclashgame-d55a3.web.app
Project Structure
color-clash-game/
├── index.html          # Redirects to login.html
├── login.html          # Login and registration page
├── game.html           # Main game interface
├── js/
│   ├── firebase-config.js  # Firebase configuration
│   ├── auth.js            # Authentication logic
│   ├── game.js            # Game logic and Firebase Realtime Database
│   ├── logout.js          # Logout functionality
├── package.json           # Node.js dependencies and scripts
├── firebase.json          # Firebase Hosting configuration
├── .firebaserc            # Firebase project settings
├── README.md              # Project documentation

Prerequisites
To run or deploy the project, ensure you have:

Node.js: Version >=20.0.0 (LTS recommended, e.g., 20.17.0).
npm: Version >=10.0.0 (included with Node.js).
Firebase Account: For Authentication and Realtime Database.
Firebase CLI: Version >=14.2.0 for deployment.
Git: For cloning the repository.

Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/color-clash-game.git
cd color-clash-game

2. Install Dependencies
Install the required Node.js packages for local development:
npm install

3. Configure Firebase

Create a Firebase project at Firebase Console.
Enable Authentication (Email/Password provider).
Enable Realtime Database and set the following rules: { "rules": { "users": { "$uid": { ".read": "auth.uid === $uid", ".write": "auth.uid === $uid" } }, "scores": { ".read": true, "$uid": { ".write": "auth.uid === $uid" } }, "live_scores": { ".read": true, "$uid": { ".write": "auth.uid === $uid" } } } }

Testing
Local Testing
Run npm start and test:
Login/Registration: Register and log in.
Gameplay: Match colors, verify scoring and timer.
Multiplayer: Use two browsers to test live score updates.
Logout: Redirects to login.html.
UI: Confirm gradients, animations, and responsiveness.
Sounds/Animations (if added): Verify audio and shake effects.
Hosted Testing
Test at the deployed URL:
Verify all features work as locally.
Check Firebase Console for user and score data.
Test on multiple devices (desktop, mobile).
Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.
Please ensure your code follows the project’s style and includes tests where applicable.

License
This project is licensed under the MIT License. See the  file for details.

Acknowledgments
Firebase for Authentication and Realtime Database.
Tailwind CSS for responsive styling.
Lite-server for local development.
Freesound.org for optional sound effects.
Contact
For questions or feedback, reach out via GitHub Issues or email at your-email@example.com.
</xaiArtifact>

Notes on the README
Placeholder Image: Replace https://via.placeholder.com/800x400.png?text=Color+Clash+Gameplay with a real screenshot of your game. You can take a screenshot of the game.html page during gameplay and upload it to the repository (e.g., screenshots/gameplay.png).
GitHub Repository: Update https://github.com/your-username/color-clash-game with your actual repository URL after pushing the project.
Firebase Config: Remind users to replace the placeholder firebaseConfig in firebase-config.js with their own Firebase project credentials.
License File: Create a LICENSE file in the repository with the MIT License text if you choose that license:
text

Copy
MIT License

Copyright (c) 2025 vivek pandey

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
Contact Info: Replace your-email@example.com with your actual contact email or remove the section if not needed.
Optional Features: The README mentions sound effects and shake animation as optional, reflecting your ability to add them before deployment.
