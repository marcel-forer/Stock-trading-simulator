// frontend/src/pages/portfolio.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);
  const userId = 1; // Replace with actual authenticated user ID

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/trades/portfolio/${userId}`);
        setPortfolio(res.data.portfolio);
        setBalance(res.data.balance);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };
    fetchPortfolio();
  }, [userId]);

  return (
    <div className="container">
      <h1 className="page-title">My Portfolio</h1>
      <div className="card">
      <h2>Balance: <span style={{ color: '#007bff' }}>${balance}</span></h2>
      <ul>
        {portfolio.length > 0 ? (
          portfolio.map((stock, index) => (
            <li key={index}>
                <strong>{stock.stock_symbol}:</strong> {stock.total_quantity} shares
              </li>
          ))
        ) : (
          <p>No holdings</p>
        )}
      </ul>
      </div>
    </div>
  );
}

export default Portfolio;
