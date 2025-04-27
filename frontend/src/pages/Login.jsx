// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId); // Store userId for portfolio fetching
      console.log('Token and userId stored in localStorage:', res.data.token, res.data.userId);
      navigate('/explore'); // Redirect to Explore page after successful login
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    
      
      <div className="card">
        <h1 className="page-title">Login</h1>
          <form onSubmit={handleLogin}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required
              style={{ marginBottom: '10px', padding: '10px', width: '100%', fontSize: '1rem' }}  
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button type="submit">Login</button>
          </form>
      </div>
    
  );
}

export default Login;
