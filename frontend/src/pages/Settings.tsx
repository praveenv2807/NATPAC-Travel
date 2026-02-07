import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate(); // Hook for navigation
  const [activeTab, setActiveTab] = useState("general");
  const [ecoWeights, setEcoWeights] = useState({
    publicTransport: 1.5,
    walking: 2.0,
    carpooling: 1.2,
    privateVehicle: 0.5,
  });

  const [systemConfig, setSystemConfig] = useState({
    autoGpsSync: true,
    offlineMode: true,
    dataRetention: "90 Days",
  });

  return (
    <div className="min-h-screen bg-[#020502] text-white p-8 font-sans relative">
      {/* Background styling to match your dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-transparent pointer-events-none"></div>

      <header className="relative z-10 mb-10 flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">
            System <span className="text-emerald-500">Authority</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/40">
            Configuration Terminal • PS 25082
          </p>
        </div>

        {/* --- BACK TO DASHBOARD BUTTON --- */}
        <button
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300"
        >
          <span className="text-emerald-500 group-hover:-translate-x-1 transition-transform">
            ⬅
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Back to Dashboard
          </span>
        </button>
      </header>

      <div className="relative z-10 flex flex-col md:flex-row gap-10">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full text-left p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "general"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "text-white/40 hover:bg-white/5"
            }`}
          >
            ⚙️ General Config
          </button>
          <button
            onClick={() => setActiveTab("eco")}
            className={`w-full text-left p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "eco"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "text-white/40 hover:bg-white/5"
            }`}
          >
            🍃 Eco-Weighting
          </button>
          <button className="w-full text-left p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5">
            🔒 Security & API
          </button>

          <div className="pt-10">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] px-4">
              System Status
            </p>
            <div className="mt-4 px-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-500/60 uppercase">
                Encrypted Connection
              </span>
            </div>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-black/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] shadow-2xl">
          {activeTab === "general" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-bold text-emerald-100">
                Core Logistics
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <SettingToggle
                  label="Automatic GPS Verification"
                  desc="Enforce location cross-referencing for every trip entry."
                  enabled={systemConfig.autoGpsSync}
                />
                <SettingToggle
                  label="Offline-First Collection"
                  desc="Store logs locally when NATPAC server is unreachable."
                  enabled={systemConfig.offlineMode}
                />
              </div>

              <div className="pt-6 border-t border-white/5">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-4">
                  Data Retention Policy
                </label>
                <select className="bg-white/5 border border-white/10 p-4 rounded-2xl w-full text-xs outline-none focus:border-emerald-500/50 transition-all text-white">
                  <option className="bg-zinc-900">30 Days</option>
                  <option className="bg-zinc-900">90 Days (Recommended)</option>
                  <option className="bg-zinc-900">Permanent Archive</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-bold text-emerald-100">
                Eco-Score Parameters
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Adjust the multipliers used to calculate the sustainability
                index for Kerala transport nodes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WeightInput
                  label="Public Transport"
                  value={ecoWeights.publicTransport}
                />
                <WeightInput
                  label="Walking/Cycling"
                  value={ecoWeights.walking}
                />
                <WeightInput label="Carpooling" value={ecoWeights.carpooling} />
                <WeightInput
                  label="Private Petrol/Diesel"
                  value={ecoWeights.privateVehicle}
                />
              </div>

              <button className="mt-8 bg-emerald-600 hover:bg-emerald-500 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                Recalculate Entire Dataset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-components
function SettingToggle({ label, desc, enabled }: any) {
  return (
    <div className="flex justify-between items-center p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all group">
      <div>
        <p className="font-bold text-sm text-white/90">{label}</p>
        <p className="text-[10px] text-white/30 mt-1">{desc}</p>
      </div>
      <div
        className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
          enabled ? "bg-emerald-600" : "bg-white/10"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
            enabled ? "right-1" : "left-1"
          }`}
        ></div>
      </div>
    </div>
  );
}

function WeightInput({ label, value }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
        {label}
      </label>
      <input
        type="number"
        step="0.1"
        defaultValue={value}
        className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all text-white"
      />
    </div>
  );
}
