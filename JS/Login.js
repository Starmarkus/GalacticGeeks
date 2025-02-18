
// Frontend (React) - Firebase Configuration and Login Component
// --- Firebase Configuration (Client-Side) ---
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // Import auth functions
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import Firestore functions

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXGnKdWdVmi2Z98DCZSYKV_nHx9zH7xRg", // Replace with your API key
    authDomain: "system-galacticgeeks.firebaseapp.com",
    databaseURL: "https://system-galacticgeeks-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "system-galacticgeeks",
    storageBucket: "system-galacticgeeks.appspot.com", // Corrected storageBucket format
    messagingSenderId: "835850762785",
    appId: "1:835850762785:web:d2e42efe2422dac089c160",
    measurementId: "G-5S4L5M5GG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);  // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore


// --- Login Component (React) ---
import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) { // Accept onLogin as a prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // New: Add registering state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        if (isRegistering) {
            await handleRegister();
        } else {
            await handleLogin();
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // If login is successful, you'll get userCredential.user

            setMessage('Login Successful');
            onLogin(userCredential.user); // Pass the user object to onLogin
        } catch (error) {
            console.error('Login error:', error);
            setMessage(error.message); // Firebase Authentication errors are more descriptive
        } finally {
            setIsLoading(false);
        }
    };

     const handleRegister = async () => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            if (userCredential.user) {
                await setDoc(doc(db, "users", email), { // Using email as document ID
                    name: email.split('@')[0], // Example: Use part of the email as a default name or ask for a name separately
                    email: email,
                    // password: userCredential.user.password  // DO NOT STORE PASSWORD
                });
            }
            setMessage('Registration Successful');
            onLogin(userCredential.user); // Pass user data to onLogin
        } catch (error) {
            console.error('Registration error:', error);
            setMessage(error.message); // Firebase Authentication errors
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
                <button type='submit' disabled={isLoading}>
                    {isLoading ? (isRegistering ? 'Registering...' : 'Logging in...') : (isRegistering ? 'Register' : 'Login')}
                </button>
            </form>
            <p>{message}</p>
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Login Instead' : 'Register Instead'}
            </button>
        </div>
    );
}

export default Login;

// --- Backend (Node.js/Express -  This part is for your backend (unmodified in this example) ---
// This code is for the backend server (Node.js) and is NOT client-side javascript

// Backend (Node.js with Express) - Login route (no changes needed, but included for context)
// This code is for the backend server (Node.js) and is NOT client-side javascript
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const userRef = db.collection('users').doc(email);
//         const userSnap = await userRef.get();
//         if (!userSnap.exists) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const user = userSnap.data();
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

//         const token = jwt.sign({ userId: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

//  --- Old Code (Removed - Not Needed with Firebase Authentication)---
// const admin = require('firebase-admin');
// const bcrypt = require('bcryptjs');
// // Initialize Firebase Admin SDK
// admin.initializeApp({
//     credential: admin.credential.applicationDefault(), // Use your service account

//     databaseURL: 'https://your-project-id.firebaseio.com'// Change to your database URL
// });
// const db = admin.firestore();
// class User {
//     constructor(name, email, password) {
//         this.name = name;
//         this.email = email;
//         this.password = password;
//     }
//     async save() {
//         if (this.password) {
//             this.password = await bcrypt.hash(this.password, 10);
//         }
//         const userRef = db.collection('users').doc(this.email);
//         await userRef.set({
//             name: this.name,
//             email: this.email,
//             password: this.password,
//         });
//     }
// }
// (async () => {
//     const newUser = new User('John Doe', 'john.doe@example.com', 'password123');
//     await newUser.save();
//     console.log('User saved to Firestore');
// })();