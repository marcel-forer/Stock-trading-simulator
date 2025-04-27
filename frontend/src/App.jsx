// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Explore from "./pages/Explore";
import Trade from "./pages/Trade";
import PrivateRoute from "./PrivateRoute";
import TradeHistory from "./pages/TradeHistory"; // Import TradeHistory component


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
          <li><Link to="/explore">Explore</Link></li>
          <li><a href="/trade-history">Trade History</a></li>


        </ul>
      </nav>

      {/* Main Content Container */}
      
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
          <Route 
            path="/explore" 
            element={
              <PrivateRoute>
                <Explore />
              </PrivateRoute> 
            }
          />
          <Route 
            path="/trade-history" 
            element={
              <PrivateRoute>
                <TradeHistory />
              </PrivateRoute>
            }
          />
          
        </Routes>
      
    </Router>
  );
}

export default App;
