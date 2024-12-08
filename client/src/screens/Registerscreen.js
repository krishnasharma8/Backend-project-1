
import React, { useState } from 'react';
import axios from 'axios';
import Success from '../components/Success';
import Loader from '../components/Loader';
import Error from "../components/Error";

function Registerscreen() {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [cpassword, setcpassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [adminPassword, setAdminPassword] = useState(''); // Admin password field
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  async function register() {
    // Reset error state
    setError('');

    // Validate passwords
    if (password !== cpassword) {
      setError('Passwords do not match');
      return;
    }

    const user = {
      name,
      email,
      password,
      role,
      adminPassword: role === 'admin' ? adminPassword : undefined, // Include adminPassword only if role is admin
    };

    try {
      setLoading(true);
      await axios.post('/api/users/register', user);
      setLoading(false);
      setSuccess(true);

      // Reset form fields
      setname('');
      setemail('');
      setpassword('');
      setcpassword('');
      setAdminPassword('');
      setRole('user');
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  }

  return (
    <div>
      {loading && <Loader />}
      {error && <Error message={error} />}
      {success && <Success message="Registration Successful" />}

      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          <div className="bs">
            <h1>Register</h1>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={cpassword}
              onChange={(e) => setcpassword(e.target.value)}
            />
            <select
              className="form-control mt-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {role === 'admin' && (
              <input
                type="password"
                className="form-control mt-3"
                placeholder="Admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            )}
            <button className="btn btn-primary mt-3" onClick={register}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registerscreen;
