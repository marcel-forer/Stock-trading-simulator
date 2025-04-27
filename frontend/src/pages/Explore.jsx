import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function Explore() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/stocks/sample`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStocks(response.data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError("Failed to load stock data. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // Navigate to Trade page with selected stock
  const handleStockClick = (stockSymbol) => {
    navigate(`/trade?stock=${stockSymbol}`);
  };

  return (
    <div className="card" style={{ width: "90%", maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <h1 className="page-title">Welcome to Trading!</h1>
      <h2>Explore These Stocks</h2>

      {loading ? (
        <p>Loading stocks...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          {stocks.length > 0 ? (
            stocks.map((stock, index) => {
              const chartData = stock.chartData || [];

              return (
                <div
                  key={index}
                  className="stock-card"
                  style={{
                    background: "var(--container-bg)",
                    padding: "15px",
                    borderRadius: "8px",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                  onClick={() => handleStockClick(stock.symbol)}
                >
                  <h3>{stock.symbol}</h3>
                  <p>Price: ${parseFloat(stock.price).toFixed(2)}</p>

                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p>No chart data available</p>
                  )}
                </div>
              );
            })
          ) : (
            <p>No stocks available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Explore;
