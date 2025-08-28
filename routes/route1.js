const express = require("express");
const router = express.Router();

// GET /route1 - confirm endpoint
router.get("/", (req, res) => {
  res.send("Route #1 hit!");
});

router.post("/", (req, res) => {
  // Get model and year from the request body
  const { model, year } = req.body;

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
