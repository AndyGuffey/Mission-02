const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Route #4 hit!");
});

module.exports = router;
