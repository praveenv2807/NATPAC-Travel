import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const initialTrafficData = [
  { time: "06:00", volume: 120 },
  { time: "09:00", volume: 980 },
  { time: "12:00", volume: 600 },
  { time: "15:00", volume: 800 },
  { time: "18:00", volume: 1100 },
  { time: "21:00", volume: 400 },
];

const incidentData = [
  { name: "Critical", value: 12, color: "#ef4444" },
  { name: "Active", value: 38, color: "#3b82f6" },
  { name: "Resolved", value: 50, color: "#22c55e" },
];

export default function Analytics() {
  const navigate = useNavigate();
  const [data, setData] = useState(initialTrafficData);

  // ✅ LIVE DATA SIMULATION ENGINE
  useEffect(() => {
    const interval = setInterval(() => {
      setData((currentData) =>
        currentData.map((item) => ({
          ...item,
          volume: Math.max(100, item.volume + (Math.random() * 40 - 20)),
        })),
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans pb-20">
      {/* 1. HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-blue-500 uppercase">
            System{" "}
            <span className="text-white font-light italic">Analytics</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">
              Processing Live Sensor Stream
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/10 text-[10px] font-bold tracking-widest transition-all"
        >
          ← EXIT TO COMMAND
        </button>
      </div>

      {/* 2. CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* TRAFFIC FLOW AREA CHART */}
        <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[40px] h-[450px] backdrop-blur-3xl shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 italic">
              Traffic Density Flow
            </h3>
            <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 uppercase">
              Live Update
            </span>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorLive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#3b82f6"
                strokeWidth={4}
                fill="url(#colorLive)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART: NETWORK HEALTH */}
        <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[40px] h-[450px] flex flex-col items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 italic mb-10 w-full">
            Infrastructure Health
          </h3>
          <ResponsiveContainer width="100%" height="70%">
            <PieChart>
              <Pie
                data={incidentData}
                innerRadius={80}
                outerRadius={110}
                paddingAngle={8}
                dataKey="value"
              >
                {incidentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-8 mt-4 w-full px-10">
            {incidentData.map((item) => (
              <div key={item.name} className="text-center">
                <p className="text-[9px] text-slate-500 font-bold uppercase">
                  {item.name}
                </p>
                <p className="text-lg font-black" style={{ color: item.color }}>
                  {item.value}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. LIVE DETAILS TABLE (With Map Linking) */}
      <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 backdrop-blur-3xl shadow-2xl">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-2 italic">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Raw Sensor Intelligence (Click Location to Map)
        </h3>

        {/* Table Headers */}
        <div className="grid grid-cols-4 border-b border-white/10 pb-4 mb-4 px-6 text-[9px] font-black uppercase tracking-widest text-slate-500">
          <span>Target District</span>
          <span>Traffic Volume</span>
          <span>Latency</span>
          <span>System Status</span>
        </div>

        {/* Table Rows */}
        <div className="space-y-3">
          {[
            {
              loc: "Trivandrum",
              pos: [8.5241, 76.9366],
              vol: "1,240 vph",
              lat: "12ms",
              status: "Optimal",
              color: "text-green-400",
            },
            {
              loc: "Kochi",
              pos: [9.9312, 76.2673],
              vol: "2,890 vph",
              lat: "45ms",
              status: "Heavy",
              color: "text-yellow-400",
            },
            {
              loc: "Kozhikode",
              pos: [11.2588, 75.7804],
              vol: "850 vph",
              lat: "18ms",
              status: "Optimal",
              color: "text-green-400",
            },
            {
              loc: "Palakkad",
              pos: [10.7867, 76.6547],
              vol: "150 vph",
              lat: "102ms",
              status: "Critical",
              color: "text-red-400",
            },
          ].map((row, i) => (
            <div
              key={i}
              onClick={() => {
                // Store the position in localStorage for the map to read
                localStorage.setItem("mapTarget", JSON.stringify(row.pos));
                navigate("/map");
              }}
              className="grid grid-cols-4 bg-white/5 p-5 rounded-3xl border border-white/5 items-center hover:border-blue-500/30 hover:bg-blue-500/10 cursor-pointer transition-all group active:scale-[0.98]"
            >
              <span className="text-sm font-bold group-hover:text-blue-400 transition-colors">
                {row.loc}
              </span>
              <span className="text-xs font-mono text-blue-400/80">
                {row.vol}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {row.lat}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black uppercase tracking-tighter ${row.color}`}
                >
                  ● {row.status}
                </span>
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
