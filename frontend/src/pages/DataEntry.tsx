import React, { useState } from "react";
import axios from "axios"; // 1. Import Axios

const DataEntry = () => {
  // 2. Update state to match your MongoDB Schema
  const [formData, setFormData] = useState({
    driverName: "",
    vehicleNumber: "",
    startKM: "",
    endKM: "",
    purpose: ""
  });

  // 3. Create the Submit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Sends data to your running backend on port 5000
      await axios.post("http://localhost:5000/api/trips", formData);
      alert("✅ Trip Data Saved to NATPAC Cloud!");
      
      // Optional: Clear form after success
      setFormData({ driverName: "", vehicleNumber: "", startKM: "", endKM: "", purpose: "" });
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("❌ Failed to save. Ensure backend is running (node server.js)");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">Trip Entry</h1>

      <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
        {/* Driver Name */}
        <div>
          <label className="block text-gray-300 mb-2">Driver Name</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-black/30 text-white border border-gray-600"
            value={formData.driverName}
            onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
            required
          />
        </div>

        {/* Vehicle Number */}
        <div>
          <label className="block text-gray-300 mb-2">Vehicle Number</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-black/30 text-white border border-gray-600"
            value={formData.vehicleNumber}
            onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
            required
          />
        </div>

        {/* KM Readings */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-300 mb-2">Start KM</label>
            <input
              type="number"
              className="w-full p-3 rounded bg-black/30 text-white border border-gray-600"
              value={formData.startKM}
              onChange={(e) => setFormData({ ...formData, startKM: e.target.value })}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-300 mb-2">End KM</label>
            <input
              type="number"
              className="w-full p-3 rounded bg-black/30 text-white border border-gray-600"
              value={formData.endKM}
              onChange={(e) => setFormData({ ...formData, endKM: e.target.value })}
              required
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded mt-4 transition-colors">
          Submit Trip
        </button>
      </form>
    </div>
  );
};

export default DataEntry;