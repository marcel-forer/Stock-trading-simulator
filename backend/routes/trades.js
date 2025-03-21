// backend/routes/trades.js
const express = require("express");
const pool = require("../db");
const router = express.Router();

// Execute a trade (Buy or Sell)
router.post("/execute", async (req, res) => {
  const { userId, stockSymbol, quantity, price, tradeType } = req.body;

  try {
    // Convert quantity and price to numbers (in case they're sent as strings)
    const qty = Number(quantity);
    const prc = parseFloat(price);

    const userResult = await pool.query("SELECT balance FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    let balance = parseFloat(userResult.rows[0].balance);
    const totalCost = qty * prc;

    // For a BUY trade, check for sufficient balance
    if (tradeType === "BUY" && balance < totalCost) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Insert the trade into the trades table, setting the current timestamp
    const newTradeResult = await pool.query(
      `INSERT INTO trades (user_id, stock_symbol, quantity, price, trade_type, trade_time) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *`,
      [userId, stockSymbol, qty, prc, tradeType]
    );

    // Update the user's balance based on the trade type
    if (tradeType === "BUY") {
      balance -= totalCost;
    } else {
      balance += totalCost; // For SELL trades, add the revenue to balance
    }

    await pool.query("UPDATE users SET balance = $1 WHERE id = $2", [balance, userId]);

    res.json({
      message: "Trade executed successfully",
      trade: newTradeResult.rows[0],
      newBalance: balance
    });
  } catch (error) {
    console.error("Trade execution error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch User Portfolio (Current Holdings)
router.get("/portfolio/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // Sum up the quantities: BUY adds, SELL subtracts.
    const holdingsResult = await pool.query(
      `SELECT stock_symbol, 
              SUM(CASE WHEN trade_type = 'BUY' THEN quantity ELSE -quantity END) AS total_quantity
       FROM trades 
       WHERE user_id = $1 
       GROUP BY stock_symbol 
       HAVING SUM(CASE WHEN trade_type = 'BUY' THEN quantity ELSE -quantity END) > 0`,
      [userId]
    );
    const balanceResult = await pool.query("SELECT balance FROM users WHERE id = $1", [userId]);
    const balance = balanceResult.rows.length > 0 ? balanceResult.rows[0].balance : 0;
    res.json({ portfolio: holdingsResult.rows, balance });
  } catch (error) {
    console.error("Portfolio fetching error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch User Trade History
router.get("/trade-history/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const historyResult = await pool.query(
      `SELECT stock_symbol, quantity, price, trade_type, trade_time 
       FROM trades 
       WHERE user_id = $1 
       ORDER BY trade_time DESC`,
      [userId]
    );
    res.json({ history: historyResult.rows });
  } catch (error) {
    console.error("Trade history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
