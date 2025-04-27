// backend/routes/trades.js
const express = require("express");
const pool = require("../db");
const authenticateUser = require("../middleware/authMiddleware");
const router = express.Router();

// Execute a trade (Buy or Sell)
router.post("/execute", authenticateUser, async (req, res) => { // Apply middleware
  const { stockSymbol, quantity, price, tradeType } = req.body;
  const userId = req.user.userId; // Extract userId from token

  try {
    const qty = Number(quantity);
    const prc = parseFloat(price);
    if (qty <= 0 || prc <= 0) return res.status(400).json({ error: "Invalid trade values." });

    const userResult = await pool.query("SELECT balance FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: "User not found" });

    let balance = parseFloat(userResult.rows[0].balance);
    const totalCost = qty * prc;

    if (tradeType === "BUY" && balance < totalCost) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Check stock holdings before allowing a sell
    if (tradeType === "SELL") {
      const holdingResult = await pool.query(
        `SELECT SUM(CASE WHEN trade_type = 'BUY' THEN quantity ELSE -quantity END) AS total_quantity
         FROM trades WHERE user_id = $1 AND stock_symbol = $2 GROUP BY stock_symbol`,
        [userId, stockSymbol]
      );
      const totalHeld = holdingResult.rows.length ? holdingResult.rows[0].total_quantity : 0;
      if (totalHeld < qty) {
        return res.status(400).json({ error: "Not enough stocks to sell." });
      }
    }

    const newTradeResult = await pool.query(
      `INSERT INTO trades (user_id, stock_symbol, quantity, price, trade_type, trade_time) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *`,
      [userId, stockSymbol, qty, prc, tradeType]
    );

    balance = tradeType === "BUY" ? balance - totalCost : balance + totalCost;
    await pool.query("UPDATE users SET balance = $1 WHERE id = $2", [balance, userId]);

    res.json({ message: "Trade executed", trade: newTradeResult.rows[0], newBalance: balance });
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
// Fetch User Trade History
router.get('/history', authenticateUser, async (req, res) => {
  try {
      const userId  = req.user.userId; // Get user ID from authentication middleware
      const result = await pool.query(
          `SELECT stock_symbol, quantity, price, trade_type, trade_time 
            FROM trades 
            WHERE user_id = $1 
            ORDER BY trade_time DESC`,
          [userId]
      );
      res.json(result.rows);
  } catch (error) {
      console.error("Error fetching trade history:", error);
      res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
