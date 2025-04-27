import React, { useEffect, useState } from "react";
import axios from "axios";

function TradeHistory() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/trades/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrades(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trade history:", error);
        setLoading(false);
      }
    };

    fetchTradeHistory();
  }, []);

  return (
    <div className="card" style={{ width: "90%", maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2>Trade History</h2>

      {loading ? (
        <p>Loading trade history...</p>
      ) : trades.length > 0 ? (
        <table className="trade-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={index}>
                <td>{trade.symbol}</td>
                <td>{trade.trade_type}</td>
                <td>{trade.quantity}</td>
                <td>${parseFloat(trade.price).toFixed(2)}</td>
                <td>{new Date(trade.trade_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No trade history found.</p>
      )}
    </div>
  );
}

export default TradeHistory;
