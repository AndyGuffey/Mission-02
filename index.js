const express = require("express");
const app = express();

app.use(express.json());

//* ==================
//* = Import Routers =
//* ==================

const route1 = require("./routes/route1");
const route2 = require("./routes/route2");
const route3 = require("./routes/route3");
const route4 = require("./routes/route4");

//* ==============
//* = Use Routes =
//* ==============

app.use("/route1", route1);
app.use("/route2", route2);
app.use("/route3", route3);
app.use("/route4", route4);

// Confirm base endpoint has been hit
app.get("/", (req, res) => {
  res.send("Mission-02 base endpoint hit! 🎯");
});

// Set Port
// Export the app for Supertest; start server only when run directly
const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`Server is running http://localhost:${PORT}`)
  );
}
// const PORT = 4000;
// app.listen(PORT, () =>
//   console.log(`Server is running http://localhost:${PORT}`)
// );

module.exports = app;               // for testing purposes