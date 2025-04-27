import React, { useEffect, useState } from 'react';
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

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [error, setError] = useState(null); // Track authentication errors

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Retrieve JWT token
        console.log('Token from localStorage:', token);

        if (!token) {
          setError("Unauthorized: No token found. Please log in.");
          return;
        }

        // Fetch the portfolio data
        const userId = localStorage.getItem('userId'); // Store userId during login
        console.log('User ID from localStorage:', userId);
        const res = await axios.get(`http://localhost:5000/trades/portfolio/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
        });


        // Log the response from the portfolio API
        console.log('Portfolio API response:', res.data);

        setPortfolio(res.data.portfolio);
        setBalance(res.data.balance);

        // Fetch historical data for each stock owned
        const stockPromises = res.data.portfolio.map(stock =>
          axios.get(`http://localhost:5000/stocks/${stock.stock_symbol}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

        const stockResponses = await Promise.all(stockPromises);
        const stockHistory = {};

        stockResponses.forEach((response, index) => {
          const timeSeries = response.data["Time Series (Daily)"];
          if (timeSeries) {
            const processedData = Object.keys(timeSeries).map((date) => ({
              date,
              close: parseFloat(timeSeries[date]["4. close"])
            })).sort((a, b) => new Date(a.date) - new Date(b.date));

            stockHistory[res.data.portfolio[index].stock_symbol] = processedData;
          }
        });

        setStockData(stockHistory);
        setSelectedStock(res.data.portfolio.length > 0 ? res.data.portfolio[0].stock_symbol : null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching portfolio or stock data:", error);
        
        // Log error details
        if (error.response) {
          console.error("API error response:", error.response.data);
          setError(`Error: ${error.response.data.message || "Failed to load portfolio. Please try again."}`);
        } else {
          setError("Failed to load portfolio. Please try again.");
        }

        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <>
      <div className="card" style={{ width: "90%", maxWidth: "1200px", margin: "auto", padding: "20px" }}>
        <h1 className="page-title">My Portfolio</h1>
        <h2>Balance: <span style={{ color: "var(--primary-color)" }}>${Number(balance || 0).toFixed(2)}</span></h2>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p style={{ textAlign: "center", fontSize: "18px" }}>Loading portfolio data...</p>
        ) : (
          <>
            {portfolio.length > 0 ? (
              <>
                <h3>Stock Holdings</h3>
                <ul style={{ padding: 0, listStyle: "none" }}>
                  {portfolio.map((stock, index) => (
                    <li key={index} style={{ cursor: "pointer", marginBottom: "10px" }} 
                        onClick={() => setSelectedStock(stock.stock_symbol)}>
                      <strong>{stock.stock_symbol}:</strong> {stock.total_quantity} shares
                    </li>
                  ))}
                </ul>

                {selectedStock && stockData[selectedStock] && (
                  <div style={{
                    width: "100%",
                    background: "var(--container-bg)",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.15)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}>
                    <h3 style={{ textAlign: "center", marginBottom: "10px" }}>{selectedStock} Trend</h3>
                    <div style={{ width: '100%', height: '70vh', marginTop: '20px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stockData[selectedStock]}>
                          <CartesianGrid stroke="#ccc" />
                          <XAxis dataKey="date" tickFormatter={(tick) => tick.substring(5)} />
                          <YAxis domain={['dataMin', 'dataMax']} />
                          <Tooltip />
                          <Line type="monotone" dataKey="close" stroke="var(--primary-color)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p style={{ textAlign: "center", fontSize: "18px" }}>No holdings</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Portfolio;
