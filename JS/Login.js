
import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) { // Accept onLogin as a prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the page from refreshing on form submission

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            localStorage.setItem('token', data.token); // Store JWT in localStorage
            setMessage('Login Successful');
            onLogin(); // Call onLogin to inform the App component of the login status
        } catch (error) {
            setMessage('Login failed. Check your credentials.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type='submit'>Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default Login;