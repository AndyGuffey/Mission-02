/**
 * Route 2 – Claim History → Risk Rating
 *
 * This router exposes a POST endpoint that accepts:
 *   { "claim_history": "<free text>" }
 * and responds with:
 *   { "risk_rating": <1..5> }
 *
 * Note: index.js mounts this router at `/route2`,
 * so the full path is: POST /route2/api/v1/risk-rating
 */

const express = require("express");
const { riskRating } = require("../services/riskRating");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Route #2 hit!");
});

// Business endpoint: convert text to a risk rating.
router.post("/api/v1/risk-rating", (req, res) => {
  try {
    // 1) Pull the user's text out of the JSON body
    const { claim_history } = req.body || {};
    // 2) Let the service calculate the score (may throw on bad input)
    const rating = riskRating(claim_history);
    // 3) Return the result as JSON
    res.json({ risk_rating: rating });
  } catch (err) {
    // Map known validation error to a 400 so the client understands what to fix
    if (err.code === "INVALID_INPUT") {
      return res.status(400).json({ error: err.message });
    }
    // Anything else is unexpected → 500
    console.error("API2 error:", err);
    res.status(500).json({ error: "internal error" });
  }
});


module.exports = router;
