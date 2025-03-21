// backend/routes/stocks.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Fetch historical stock data from Alpha Vantage
router.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: 'compact', // 'compact' returns the last 100 data points; use 'full' for full-length
        apikey: process.env.ALPHA_VANTAGE_API_KEY,
      },
    });

    // Check if the API returned an error or a rate-limit note
    if (response.data['Error Message'] || response.data['Note']) {
      return res.status(400).json({ error: 'Invalid symbol or API rate limit reached.' });
    }
    
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching historical stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

module.exports = router;
