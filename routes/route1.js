const express = require("express");
const router = express.Router();

// GET /route1 - confirm endpoint
router.get("/", (req, res) => {
  res.send("Route #1 hit!");
});

router.post("/", (req, res) => {
  // Get model and year from the request body
  const { model, year } = req.body;
  // -----------------------
  // -- Validation Checks --
  // -----------------------

  // Check if model is empty string
  if (model === "") {
    return res.status(400).json({ error: "Model cannot be empty " });
  }
  // Check if year is not provided
  if (year === undefined) {
    return res.status(400).json({ error: "Year is required" });
  }
  // Check if year is negative
  if (year < 0) {
    return res.status(400).json({ error: "Year must be a positive number" });
  }
  // Check if year is a number
  if (typeof year !== "number") {
    return res.status(400).json({ error: "Year must be a number" });
  }
  // Check if model is a string
  if (typeof model !== "string") {
    return res.status(400).json({ error: "Model must be a string" });
  }
  // ----------------------------------------------------------------------------

  // get the sum of letter positions
  let letterSum = 0; // Initial letter sum always set to zero

  if (model) {
    // Loop through each letter in the model
    for (let i = 0; i < model.length; i++) {
      const char = model[i].toUpperCase();
      // Check if it is a letter (A-Z)
      if (char >= "A" && char <= "Z") {
        // Convert to position (A=1, B=2, ... Z=26)
        const position = char.charCodeAt(0) - 64;
        letterSum += position;
      }
      // Igonore spaces and non-letter characters
    }
  }
  // Calculate the final value: (letter sum X 100) + year
  const suggestedValue = letterSum * 100 + year;

  // Return Result
  res.status(200).json({ suggestedValue: suggestedValue.toString() });
});

module.exports = router;
