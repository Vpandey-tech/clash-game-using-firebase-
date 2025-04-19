import { auth, database } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { ref, set } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

const showError = (elementId, message) => {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => {
      errorEl.style.display = 'none';
    }, 3000);
  }
};

// Login
const loginBtn = document.getElementById('login');
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginBtn.disabled = true;

    if (!email || !password) {
      showError('error', 'Please fill in all fields.');
      loginBtn.disabled = false;
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'post-register.html';
    } catch (error) {
      console.error('Login error:', error);
      showError('error', error.message.includes('invalid-credential') ? 'Invalid email or password.' : 'Login failed. Please try again.');
      loginBtn.disabled = false;
    }
  });
}

// Registration
const registerBtn = document.getElementById('register-btn');
if (registerBtn) {
  registerBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const securityCode = document.getElementById('security-code').value;
    registerBtn.disabled = true;

    if (!username || !email || !password || !securityCode) {
      showError('error', 'Please fill in all fields.');
      registerBtn.disabled = false;
      return;
    }

    if (securityCode.length < 4 || securityCode.length > 6) {
      showError('error', 'Security code must be 4-6 characters.');
      registerBtn.disabled = false;
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await set(ref(database, 'users/' + user.uid), {
        username,
        email,
        securityCode,
        createdAt: Date.now()
      });
      window.location.href = 'post-register.html';
    } catch (error) {
      console.error('Registration error:', error);
      showError('error', error.message.includes('email-already-in-use') ? 'This email is already registered.' : 'Registration failed. Please try again.');
      registerBtn.disabled = false;
    }
  });
}

// Logout
export async function logout() {
  try {
    await auth.signOut();
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Logout error:', error);
  }
}