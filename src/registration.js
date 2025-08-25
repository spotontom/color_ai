import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ4pKgh_cewr2f4A5IiL5Y-W6BRsM1fB0",
  authDomain: "paint-changer.firebaseapp.com",
  projectId: "paint-changer",
  storageBucket: "paint-changer.appspot.com", // Fixed URL from React version
  messagingSenderId: "283803864978",
  appId: "1:283803864978:web:ab52319ef2d07623c8fb4b",
  measurementId: "G-B0R9H8PSQL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to remove any existing overlay before opening a new one
function removeExistingOverlay() {
  const existingOverlay = document.getElementById("overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }
}

// Function to show registration overlay
export function showRegistrationOverlay() {
  removeExistingOverlay(); // Remove any existing overlay

  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50";
  
  overlay.innerHTML = `
  <form id="register-form" class="form">
    <p class="title">Register</p>
    <p class="message">Sign up now and get full access to our app.</p>
    
      <div id="error-container" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" style="display: none;"></div>
    <div class="flex">
      <label>
        <input required placeholder="" type="text" id="firstname" class="input">
        <span>Firstname</span>
      </label>
      <label>
        <input required placeholder="" type="text" id="lastname" class="input">
        <span>Lastname</span>
      </label>
    </div>
    
    <label>
      <input required placeholder="" type="email" id="email" class="input">
      <span>Email</span>
    </label>
    
    <label>
      <input required placeholder="" type="password" id="password" class="input">
      <span>Password</span>
    </label>
    
    <label>
      <input required placeholder="" type="password" id="confirm-password" class="input">
      <span>Confirm password</span>
    </label>
    
    <button id="submit" type="submit" class="submit">Submit</button>
    <p class="signin">Already have an account? <a href="#" id="signin-btn">Signin</a></p>
  </form>
`;
  
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.classList.add("active");
  }, 100);
  

  
  // Event listener for registration submit
  document.getElementById("register-form")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const firstName = document.getElementById("firstname")?.value;
    const lastName = document.getElementById("lastname")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirm-password")?.value;
    
    const errors = [];
    if (!firstName || !lastName) errors.push("Please enter your full name");
    if (!email) errors.push("Please enter your email");
    if (password.length < 6) errors.push("Password must be at least 6 characters");
    if (password !== confirmPassword) errors.push("Passwords do not match");

    const errorContainer = document.getElementById("error-container");
    if (errors.length > 0) {
      errorContainer.style.display = "block";
      errorContainer.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
      return;
    } else {
      errorContainer.style.display = "none";
    }

    const submitButton = document.getElementById("submit");
    submitButton.textContent = "Registering...";
    submitButton.disabled = true;

    try {
      // First create the authentication user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Then create the user document with the same UID (important!)
      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        firstName,
        lastName,
        email,
        tokens: 1, // Start with 1 token as in the React version
        createdAt: new Date(),
      });

      console.log("User registered successfully with 1 token");
      
      // Close the overlay
      closeOverlay();
    } catch (error) {
      console.error("Registration error:", error);
      errorContainer.style.display = "block";
      errorContainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
      submitButton.textContent = "Submit";
      submitButton.disabled = false;
    }
  });

  // Event listener for Sign-in button
  document.getElementById("signin-btn")?.addEventListener("click", function (event) {
    event.preventDefault();
    showSignInOverlay();
  });
}

// Function to show sign-in overlay
function showSignInOverlay() {
  removeExistingOverlay(); // Remove any existing overlay
  
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50";
  
  overlay.innerHTML = `
    <form id="signin-form" class="form">
      <p class="title">Sign In</p>
      <p class="message">Welcome back! Please sign in to continue.</p>
      
      <div id="signin-error-container" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" style="display: none;"></div>
      
      <label>
        <input required placeholder="" type="email" id="signin-email" class="input">
        <span>Email</span>
      </label>
      
      <label>
        <input required placeholder="" type="password" id="signin-password" class="input">
        <span>Password</span>
      </label>
      
      <button id="signin-submit" type="submit" class="submit">Sign In</button>
      <p class="signin">Don't have an account? <a href="#" id="signup-btn">Sign up</a></p>
    </form>
  `;

  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.classList.add("active");
  }, 100);

  // Event listener for sign-in submit
  document.getElementById("signin-form")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("signin-email")?.value;
    const password = document.getElementById("signin-password")?.value;
    
    const errorContainer = document.getElementById("signin-error-container");
    if (!email || !password) {
      errorContainer.style.display = "block";
      errorContainer.innerHTML = "<p>Please enter both email and password</p>";
      return;
    } else {
      errorContainer.style.display = "none";
    }

    const submitButton = document.getElementById("signin-submit");
    submitButton.textContent = "Signing in...";
    submitButton.disabled = true;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully");
      closeOverlay();
    } catch (error) {
      console.error("Sign in error:", error);
      errorContainer.style.display = "block";
      errorContainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
      submitButton.textContent = "Sign In";
      submitButton.disabled = false;
    }
  });

  // Event listener for going back to registration
  document.getElementById("signup-btn")?.addEventListener("click", function (event) {
    event.preventDefault();
    showRegistrationOverlay();
  });
}

// Function to close overlay
export function closeOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.classList.remove("active");
    setTimeout(() => {
      removeExistingOverlay();
    }, 300);
  }
}

// Export for global access if needed
window.closeOverlay = closeOverlay;