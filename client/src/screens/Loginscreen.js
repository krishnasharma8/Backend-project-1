import React, { useState } from 'react';
import Loader from '../components/Loader';
import Error from "../components/Error";
import axios from 'axios';

function Loginscreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Initialize as null

    async function Login() {
        const user = {
            email,
            password,
        };

        try {
            setLoading(true);
            const result = await axios.post('/api/users/login', user);
            setLoading(false);
            localStorage.setItem('currentUser', JSON.stringify(result.data)); // Use result.data
            window.location.href = '/home';
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError('Invalid Credentials'); // Set an error message
        }
    }

    return (
        <div>
            {loading && <Loader />}
            <div className='row justify-content-center mt-5'>
                <div className='col-md-5 mt-5'>
                    {error && <Error message={error} />}
                    <div className='bs'>
                        <h1>Login</h1>
                        <input
                            type='email'
                            className='form-control'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type='password' // Changed to 'password'
                            className='form-control'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className='btn btn-primary mt-3' onClick={Login}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loginscreen;