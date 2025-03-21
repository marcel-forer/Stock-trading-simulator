// frontend/src/pages/trade.jsx
import React, { useState } from 'react';
import axios from 'axios';

function Trade() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [tradeType, setTradeType] = useState('BUY');
  const [message, setMessage] = useState('');
  const userId = 1; // Replace with actual authenticated user ID

  const handleTrade = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/trades/execute', {
        userId,
        stockSymbol,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        tradeType,
      });
      setMessage(res.data.message);
    } catch (error) {
      console.error("Trade error:", error);
      setMessage("Trade failed");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Execute a Trade</h1>
      <div className="card">
      <form onSubmit={handleTrade}>
        <div>
          <label>Stock Symbol:</label>
          <input type="text" value={stockSymbol} onChange={e => setStockSymbol(e.target.value)} required />
        </div>
        <div>
          <label>Quantity:</label>
          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Trade Type:</label>
          <select value={tradeType} onChange={e => setTradeType(e.target.value)}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
        <button type="submit">Execute</button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
}

export default Trade;
