import React, { useState } from 'react';
import { fetchStockData } from '../api';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function Dashboard() {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    setError(null); // Clear previous errors
    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      const response = await fetchStockData(symbol, token);
      setData(response.data);

      // Process the Alpha Vantage data to create an array for the chart.
      const timeSeries = response.data["Time Series (Daily)"];
      if (timeSeries) {
        const processedData = Object.keys(timeSeries).map((date) => ({
          date,
          close: parseFloat(timeSeries[date]["4. close"])
        }));
        processedData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setChartData(processedData);
      }
    } catch (err) {
      console.error("Error fetching stock data:", err);
      setError("Failed to fetch data. Please check the stock symbol and try again.");
      setData(null);
      setChartData([]);
    }
  };

  return (
    <>
      <div className="card" style={{ maxWidth: '800px' }}>
        <h1 className="page-title">The <span style={{ color: 'var(--primary-color)' }}>Trader</span></h1>
        <input 
          type="text" 
          placeholder="Enter stock symbol (e.g., SCOM.NR)" 
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)} 
          style={{ marginBottom: '10px', padding: '10px', width: '100%', fontSize: '1rem' }} 
        />
        <button onClick={handleFetch}>Get Data</button>
        {error && <p className="error">{error}</p>}
        {chartData.length > 0 && (
          <div style={{ width: '50vw', height: '70vh', margin: '30px auto', paddingTop: '20px' }}>
            <h2>Stock Trend Chart</h2>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" tickFormatter={(tick) => tick.substring(5)} />
                <YAxis domain={['dataMin', 'dataMax']} />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="var(--primary-color)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
