const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");

// @route   POST /api/trips
// @desc    Save a new trip
router.post("/", async (req, res) => {
  try {
    const newTrip = new Trip(req.body);
    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @route   GET /api/trips
// @desc    Get all trip logs
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
