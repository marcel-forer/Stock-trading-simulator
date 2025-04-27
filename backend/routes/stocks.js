// backend/routes/stocks.js
const express = require('express');


const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const stocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];

// Fetch sample stocks data from API
router.get('/sample', async (req, res) => {
  try {
    const stockData = await Promise.all(
      stocks.map(async (symbol) => {
        try {
          const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
              function: 'TIME_SERIES_DAILY',
              symbol,
              outputsize: 'compact',
              apikey: process.env.ALPHA_VANTAGE_API_KEY,
            },
          });

          const timeSeries = response.data['Time Series (Daily)'];
          if (!timeSeries) {
            throw new Error(`No data for ${symbol}`);
          }

          // Extract last 10 days of data
          const chartData = Object.entries(timeSeries)
            .slice(0, 10) // Get the last 10 entries
            .map(([time, data]) => ({
              time,
              price: parseFloat(data['4. close']), // Closing price
            }))
            .reverse(); // Ensure oldest date is first

          return {
            symbol,
            price: chartData.length > 0 ? chartData[chartData.length - 1].price : 0,
            chartData,
          };
        } catch (err) {
          console.error(`Error fetching data for ${symbol}:`, err.message);
          return { symbol, price: 0, chartData: [] };
        }
      })
    );

    res.json(stockData);
  } catch (error) {
    console.error('Error fetching sample stocks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Fetch historical stock data from Alpha Vantage
router.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;

  // Validate stock symbol format
  if (!/^[A-Z]{1,5}$/.test(symbol)) {
    return res.status(400).json({ error: "Invalid stock symbol format." });
  }

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: 'compact',
        apikey: process.env.ALPHA_VANTAGE_API_KEY,
      },
    });

    // Handle API errors and rate limits
    if (response.data['Error Message']) {
      return res.status(400).json({ error: 'Invalid stock symbol.' });
    }
    if (response.data['Note']) {
      return res.status(429).json({ error: 'API rate limit reached. Try again later.' });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data." });
  }

  
});

  // Fetch sample stocks from Alpha Vantage
router.get('/sample', async (req, res) => {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    // Fetch data for each stock
    const stockData = await Promise.all(
      stocks.map(async (symbol) => {
        const response = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'TIME_SERIES_DAILY',
            symbol,
            outputsize: 'compact',
            apikey: apiKey,
          },
        });

        const timeSeries = response.data['Time Series (Daily)'];
        if (!timeSeries) {
          return { symbol, price: 0, chartData: [] };
        }

        const chartData = Object.entries(timeSeries)
          .slice(0, 10) // Get last 10 days
          .map(([date, values]) => ({
            time: date,
            price: parseFloat(values['4. close']),
          }))
          .reverse();

        return {
          symbol,
          price: chartData.length > 0 ? chartData[chartData.length - 1].price : 0,
          chartData,
        };
      })
    );

    res.json(stockData);
  } catch (error) {
    console.error('Error fetching sample stocks:', error);
    res.status(500).json({ error: 'Failed to fetch stock data.' });
  }
});

module.exports = router;
