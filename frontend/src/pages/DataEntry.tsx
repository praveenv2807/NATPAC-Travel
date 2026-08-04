import React, { useState } from "react";
import axios from "axios";

const DataEntry = () => {
  // Updated state to match your PostgreSQL 'trips' table columns
  const [formData, setFormData] = useState({
    userId: "user1",
    origin: "",
    destination: "",
    purpose: "",
    startTime: "",
    tripNumber: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Updated Port to 8082 (Spring Boot Backend)
      await axios.post("http://localhost:8082/api/trips", formData);

      alert("✅ Trip Data Saved to PostgreSQL Database!");

      // Clear form on success
      setFormData({
        userId: "user1",
        origin: "",
        destination: "",
        purpose: "",
        startTime: "",
        tripNumber: 1,
      });
    } catch (error) {
      console.error("Error saving trip:", error);
      alert(
        "❌ Failed to save. Check VS Code terminal to ensure Spring Boot (port 8082) is running.",
      );
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">Trip Entry</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4"
      >
        {/* Origin */}
        <div>
          <label className="block text-gray-300 mb-2">Origin</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-black/30 text-white border border-gray-600"
            value={formData.origin}
            onChange={(e) =>
              setFormData({ ...formData, origin: e.target.value })
            }
            required
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-gray-300 mb-2">Destination</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-black/30 text-white border border-gray-600"
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
            required
          />
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-gray-300 mb-2">Purpose</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-black/30 text-white border border-gray-600"
            value={formData.purpose}
            onChange={(e) =>
              setFormData({ ...formData, purpose: e.target.value })
            }
            required
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-gray-300 mb-2">Start Time</label>
          <input
            type="datetime-local"
            className="w-full p-3 rounded bg-black/30 text-white border border-gray-600"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded mt-4 transition-colors"
        >
          SYNC WITH NATPAC ECOSYSTEM
        </button>
      </form>
    </div>
  );
};

export default DataEntry;
