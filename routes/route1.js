const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Route #1 hit!");
});

module.exports = router;
