const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Fetch historical stock data
router.get('/:symbol', async (req, res) => {
    const { symbol } = req.params;
    try {
        const response = await axios.get(`https://www.alphavantage.co/query`, {
            params: {
                function: 'TIME_SERIES_DAILY',
                symbol,
                apikey: process.env.ALPHA_VANTAGE_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

module.exports = router;
