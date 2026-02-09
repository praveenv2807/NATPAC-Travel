const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// 1. Import Routes
const tripRoutes = require("./routes/tripRoutes");

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json()); // Essential for reading data sent from your React app

// 3. Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ NATPAC NoSQL Cloud Connected"))
  .catch((err) => console.error("❌ Connection Error:", err));

// 4. Connect Trip Routes
// All your trip-related URLs will now start with /api/trips
app.use("/api/trips", tripRoutes);

// 5. Test Route
app.get("/", (req, res) => {
  res.send("NATPAC Backend is running successfully!");
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
