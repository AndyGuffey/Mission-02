const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Route #2 hit!");
});

module.exports = router;
