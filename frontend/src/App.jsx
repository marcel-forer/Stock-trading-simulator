// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Trade from "./pages/Trade";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul>
          <li><Link to="/">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/portfolio">Portfolio</Link></li>
          <li><Link to="/trade">Trade</Link></li>
        </ul>
      </nav>

      {/* Main Content Container */}
      <div className="container">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/portfolio" 
            element={
              <PrivateRoute>
                <Portfolio />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/trade" 
            element={
              <PrivateRoute>
                <Trade />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
