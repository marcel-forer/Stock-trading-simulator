// frontend/src/pages/trade.jsx
import React, { useState } from 'react';
import axios from 'axios';

function Trade() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [latestPrice, setLatestPrice] = useState(null);
  const [tradeType, setTradeType] = useState('BUY');
  const [message, setMessage] = useState('');

  // Fetch the latest stock price
  const fetchLatestPrice = async () => {
    if (!stockSymbol) {
      setMessage("Please enter a stock symbol first.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("Unauthorized: No token found. Please log in.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/stocks/${stockSymbol}`, {
        headers: { Authorization: `Bearer ${token}` }
,
      });

      const timeSeries = res.data["Time Series (Daily)"];

      if (!timeSeries) {
        setMessage("Invalid stock symbol or API limit reached.");
        return;
      }

      // Get the most recent date from the response
      const latestDate = Object.keys(timeSeries)[0];
      const price = timeSeries[latestDate]["4. close"]; // Get latest closing price

      setLatestPrice(parseFloat(price)); // Update state with fetched price
      setMessage(`Latest price for ${stockSymbol}: $${price}`);
    } catch (error) {
      console.error("Error fetching stock price:", error);
      setMessage("Failed to fetch stock price.");
    }
  };

  // Execute trade
  const handleTrade = async (e) => {
    e.preventDefault();

    if (!latestPrice) {
      setMessage("Please fetch the stock price before trading.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("Unauthorized: No token found. Please log in.");
      return;
    }

    // Decode userId from token
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const userId = payload.userId; 

    try {
      const res = await axios.post(
        'http://localhost:5000/trades/execute',
        {
          userId, // Include userId
          stockSymbol,
          quantity: parseInt(quantity),
          price: latestPrice, // Use fetched price instead of user input
          tradeType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
    } catch (error) {
      console.error("Trade error:", error);
      setMessage("Trade failed.");
    }
  };


  return (
    <>
      <div className="card">
        <h1 className="page-title">Execute a Trade</h1>
        <form onSubmit={handleTrade}>
          <div>
            <label>Stock Symbol:</label>
            <input
              type="text"
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
              required
            />
            <button type="button" onClick={fetchLatestPrice}>
              Fetch Latest Price
            </button>
          </div>

          {latestPrice && <p>Latest Price: <strong>${latestPrice}</strong></p>}

          <div>
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Trade Type:</label>
            <select value={tradeType} onChange={(e) => setTradeType(e.target.value)}>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>

          <button type="submit">Execute</button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </>
  );
}

export default Trade;
