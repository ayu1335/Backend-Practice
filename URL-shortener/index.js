const express = require('express');
const connectDB = require('./connect');
const URL = require('./models/url');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware 
app.use(express.json());

// Routes
app.use("/api/url", require("./routes/url"));
app.get("/:shortID", async (req, res) => {
  try {
    const { shortID } = req.params;

    const entry = await URL.findOneAndUpdate(
      { shortID },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true } // optional: returns updated doc
    );

    if (!entry) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    return res.redirect(entry.redirectURL);
  } catch (err) {
    console.error("Error during redirect:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


// Connect DB and start server
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`URL Shortener service running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error("DB connection failed:", err.message);
  });
