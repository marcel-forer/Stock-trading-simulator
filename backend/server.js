console.log("Starting server...");

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const tradeRoutes = require('./routes/trades');
const stockRoutes = require('./routes/stocks');



const app = express();
app.use(cors());
app.use(helmet()); // Enables security headers
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/trades', tradeRoutes);
app.use('/stocks', stockRoutes);




// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
