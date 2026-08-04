import React, { useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [formData, setFormData] = useState({
    userId: "user1",
    roadCondition: "the is uneven in turnings and there no barrigaurds",
    origin: "Coimbatore",
    destination: "Trichy",
    startTime: "2026-08-04T10:00:00",
    endTime: "2026-08-04T14:00:00",
    travelMode: "Two Wheeler",
    purpose: "Social",
    tripNumber: 321,
    travelers: 2,
    cost: 750,
    frequency: "Occasional",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sends payload to active Spring Boot backend on port 8082
      await axios.post("http://localhost:8082/api/trips", formData);

      alert("✅ Trip Chain Successfully Uploaded to NATPAC Ecosystem!");
    } catch (error) {
      console.error("Error saving trip:", error);
      alert(
        "❌ Failed to save trip to PostgreSQL. Check if Spring Boot port 8082 is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950/40 p-6 flex justify-center items-center text-white">
      <div className="w-full max-w-xl bg-emerald-900/20 backdrop-blur-md p-6 rounded-3xl border border-emerald-500/20 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Box */}
          <div className="border-2 border-dashed border-emerald-500/30 rounded-2xl p-6 text-center text-xs tracking-wider text-emerald-300 bg-emerald-950/20 cursor-pointer">
            UPLOAD TRIP PHOTO / ROAD CONDITION
          </div>

          {/* Road Description Textarea */}
          <textarea
            className="w-full p-4 rounded-xl bg-black/40 border border-emerald-500/20 text-emerald-100 text-sm focus:outline-none focus:border-emerald-400"
            rows={3}
            value={formData.roadCondition}
            onChange={(e) =>
              setFormData({ ...formData, roadCondition: e.target.value })
            }
            placeholder="Describe road condition..."
          />

          {/* Location Auto Detect Button */}
          <button
            type="button"
            className="w-full py-2.5 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs tracking-wide hover:bg-emerald-600/40 transition-colors"
          >
            ⚡ AUTO-DETECT CURRENT LOCATION
          </button>

          {/* Origin & Destination Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-emerald-400 font-bold tracking-wider mb-1">
                TRIP #{formData.tripNumber} ORIGIN
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-white text-sm"
                value={formData.origin}
                onChange={(e) =>
                  setFormData({ ...formData, origin: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-emerald-400 font-bold tracking-wider mb-1">
                DESTINATION DETAILS
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-white text-sm"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Start & End Times */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-white text-sm"
              value="10:00 AM"
              readOnly
            />
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-white text-sm"
              value="2:00 PM"
              readOnly
            />
          </div>

          {/* Travel Mode, Purpose, Distance */}
          <div className="grid grid-cols-3 gap-3">
            <select
              className="w-full p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-white text-xs"
              value={formData.travelMode}
              onChange={(e) =>
                setFormData({ ...formData, travelMode: e.target.value })
              }
            >
              <option value="Two Wheeler">🏍 Two Wheeler</option>
              <option value="Car/Taxi">🚗 Car/Taxi</option>
              <option value="Bus">🚌 Bus</option>
            </select>

            <select
              className="w-full p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-white text-xs"
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
            >
              <option value="Social">Social</option>
              <option value="Work">Work</option>
              <option value="Education">Education</option>
            </select>

            <input
              type="number"
              className="w-full p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-white text-sm text-center"
              value={formData.tripNumber}
              onChange={(e) =>
                setFormData({ ...formData, tripNumber: Number(e.target.value) })
              }
            />
          </div>

          {/* Travelers, Cost, Frequency */}
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              className="w-full p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-white text-sm text-center"
              value={formData.travelers}
              onChange={(e) =>
                setFormData({ ...formData, travelers: Number(e.target.value) })
              }
            />
            <input
              type="number"
              className="w-full p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-white text-sm text-center"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: Number(e.target.value) })
              }
            />
            <select
              className="w-full p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-white text-xs"
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
            >
              <option value="Occasional">Occasional</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 rounded-2xl bg-emerald-400 text-black font-extrabold text-xs tracking-widest hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
          >
            {loading ? "SAVING..." : "SYNC WITH NATPAC ECOSYSTEM"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
