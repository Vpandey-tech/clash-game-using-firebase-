import { auth, database } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { ref, set } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// Toggle between login and register forms
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggleRegister = document.getElementById('toggle-register');
const toggleLogin = document.getElementById('toggle-login');

toggleRegister.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
});

toggleLogin.addEventListener('click', () => {
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
});

// Login functionality
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    loginError.textContent = 'Please fill in all fields.';
    loginError.classList.remove('hidden');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'game.html';
  } catch (error) {
    loginError.textContent = error.message;
    loginError.classList.remove('hidden');
  }
});

// Register functionality
const registerBtn = document.getElementById('register-btn');
const registerError = document.getElementById('register-error');

registerBtn.addEventListener('click', async () => {
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  if (!username || !email || !password) {
    registerError.textContent = 'Please fill in all fields.';
    registerError.classList.remove('hidden');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user details in Realtime Database
    await set(ref(database, 'users/' + user.uid), {
      username: username,
      email: email
    });

    window.location.href = 'game.html';
  } catch (error) {
    registerError.textContent = error.message;
    registerError.classList.remove('hidden');
  }
});