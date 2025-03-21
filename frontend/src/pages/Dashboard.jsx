import { useState } from 'react';
import { fetchStockData } from '../api';

function Dashboard() {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    setError(null); // Clear previous error messages
    try {
      const response = await fetchStockData(symbol);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching stock data:", err);
      setError("Failed to fetch data. Please check the stock symbol and try again.");
      setData(null);
    }
  };

  return (
    <div className = "container">
      <h1 className="page-title">The <span>Trader</span></h1>
      <div className="card" style={{ maxWidth: '500px' }}>
      <input 
        type="text" 
        placeholder="Enter stock symbol (e.g., SCOM.NR)" 
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)} 
      />
      <button onClick={handleFetch}>Get Data</button>
      {error && <p className="error">{error}</p>}
      {data && (
        <div>
          <h2>Historical Data</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      </div>
    </div>
  );
}

export default Dashboard;
