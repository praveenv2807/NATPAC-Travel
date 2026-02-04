import React, { useState } from "react";

const DataEntry = () => {
  const [formData, setFormData] = useState({ source: "", destination: "" });

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">Trip Entry</h1>

      <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Source</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-black/30 text-white border border-gray-600"
            onChange={(e) =>
              setFormData({ ...formData, source: e.target.value })
            }
          />
        </div>

        <button className="w-full bg-blue-600 text-white font-bold py-3 rounded mt-4">
          Submit
        </button>
      </div>
    </div>
  );
};

export default DataEntry;
