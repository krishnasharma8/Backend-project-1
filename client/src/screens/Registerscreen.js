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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success,setsuccess]=useState();
  async function register() {
    if (password === cpassword) {
      const user = {
        name,
        email,
        password,
        cpassword,
      };

      try {
        setLoading(true);
        const result = await axios.post('/api/users/register', user);
        setLoading(false)
        setsuccess(true)
        setname('')
        setemail('')
        setpassword('')
        setcpassword('')
      } catch (error) {
        console.log(error); 
        setLoading(false)
        setError(true)
      }
    } else {
      alert('Passwords do not match');
    }
  }

  return (
   
    <div>
      {loading && (<Loader/>)}
      {error && (<Error/>)}
  
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
        {success && (<Success message="Registration Success"/>)}
          <div className="bs">
            <h1>Register</h1>
            <input
              type="text"
              className="form-control"
              placeholder="name"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            <input
              type="email"
              className="form-control"
              placeholder="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="confirm password"
              value={cpassword}
              onChange={(e) => setcpassword(e.target.value)}
            />
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
