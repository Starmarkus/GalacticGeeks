// JavaScript source code
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import getFirestore
import {  signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"; // Import authentication functions
import { getAuth } from "firebase/auth";



// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCXGnKdWdVmi2Z98DCZSYKV_nHx9zH7xRg", // Replace with your API key
    authDomain: "system-galacticgeeks.firebaseapp.com",
    databaseURL: "https://system-galacticgeeks-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "system-galacticgeeks",
    storageBucket: "system-galacticgeeks.appspot.com",  // Corrected storageBucket format
    messagingSenderId: "835850762785",
    appId: "1:835850762785:web:d2e42efe2422dac089c160",
    measurementId: "G-5S4L5M5GG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Firebase Authentication



// *** SERVER-SIDE CODE (Node.js with Firebase Admin SDK) - This part is for your backend ***
//  Important: This part is designed to run on your server (Node.js).  It's not meant to run in the client's browser directly.

// const admin = require('firebase-admin');  //  Admin SDK is not needed when using Firebase client SDK (as above)
const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors'); // Import CORS to enable cross-origin requests

const port = 5000; // Or whatever port you prefer
const router = express.Router();


app.use(cors()); // Enable CORS for all origins (for development - restrict in production)
app.use(express.json()); // Middleware to parse JSON request bodies
// Initialize Firebase Admin SDK  (Removed: This is not needed when using firebase/app and firebase/firestore in the client-side code, which is what the first part of the code is doing.)
// admin.initializeApp({
//     credential: admin.credential.applicationDefault(), // Use your service account
//     databaseURL: 'https://system-galacticgeeks-default-rtdb.europe-west1.firebasedatabase.app' // Replace with your database URL
// });

// // Create a Firestore instance
// const db = admin.firestore(); //  This is replaced by const db = getFirestore(app) in the client-side



// **  SERVER-SIDE ROUTES (API Endpoints) -  These handle register and login requests **

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // 1. Check if user already exists (client-side handles this now with createUserWithEmailAndPassword)
        const userRef = db.collection('users').doc(email);
        const userSnap = await userRef.get();
        if (userSnap.exists) {
          return res.status(400).json({ error: 'User already exists' }); // Send error back to client.
        }


        // 2. Hash the password (bcrypt is not needed on client-side)
        const hashedPassword = await bcrypt.hash(password, 10);


        await userRef.set({
            name,
            email,
            password: hashedPassword, // Store the hashed password
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: 'Server error during registration' });  // More descriptive error
    }
});


// Login endpoint (Server-Side)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
         const userRef = db.collection('users').doc(email);
        const userSnap = await userRef.get();


        if (!userSnap.exists) {
           return res.status(404).json({ error: 'User not found' });
        }
        const user = userSnap.data(); // Get the user data
        const hashedPassword = user.password;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
           return res.status(401).json({ error: 'Invalid credentials' });
        }


        // 3.  Sign in the user using Firebase Auth (Client-Side)

        res.status(200).json({ message: 'Login successful' }); // Return a success message
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Server error during login' }); // More descriptive error
    }
});


app.use('/api/auth', router); // Mount the router at the '/api/auth' path


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});



//  CLIENT-SIDE CODE (React/JavaScript in the browser) - Moved User Class logic out

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

// // Change into User class  (Removed: This is not needed and moved to server-side)
// (async () => {
//     const newUser = new User('John Doe', 'john.doe@example.com', 'password123');
//     await newUser.save();
//     console.log('User saved to Firestore');
// })();
