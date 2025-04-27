// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/register', { username, password });
      if (res.data) {
        alert("Registration successful. Please log in.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="page-title">Register</h1>
        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
