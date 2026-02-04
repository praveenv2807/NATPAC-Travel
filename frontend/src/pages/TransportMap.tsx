import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
  Polyline, // Added for road networks
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- KERALA ROAD NETWORK (Shown in Dark Mode) ---
const roadNetworks = [
  {
    name: "NH-66 Coastal",
    color: "#3b82f6",
    coords: [
      [12.6784, 74.8876],
      [12.0894, 75.1952],
      [11.2588, 75.7804],
      [10.5276, 76.2144],
      [9.9312, 76.2673],
      [9.4981, 76.3388],
      [8.5241, 76.9366],
    ] as [number, number][],
  },
  {
    name: "MC Road",
    color: "#a855f7",
    coords: [
      [8.5241, 76.9366],
      [9.1663, 76.7132],
      [9.5916, 76.5222],
      [10.1852, 76.3684],
    ] as [number, number][],
  },
  {
    name: "NH-544",
    color: "#22c55e",
    coords: [
      [9.9312, 76.2673],
      [10.5276, 76.2144],
      [10.7867, 76.6547],
    ] as [number, number][],
  },
];

function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  map.flyTo(center, zoom, { duration: 1.5 });
  return null;
}

export default function TransportMap() {
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const activeRole = localStorage.getItem("userRole") || "citizen";

  // ✅ NEW: TOGGLE STATE
  const [mapMode, setMapMode] = useState<"satellite" | "dark">("dark");

  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem("natpac_official_data");
    if (saved && saved !== "[]") {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 1,
        city: "Kochi",
        issue: "NH-66 Expansion",
        status: "Active",
        pos: [9.9312, 76.2673],
        color: "#f97316",
      },
    ];
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      localStorage.setItem("natpac_official_data", JSON.stringify(incidents));
    }
  }, [incidents]);

  const [newCity, setNewCity] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [newStatus, setNewStatus] = useState("Active");
  const [loading, setLoading] = useState(false);
  const [mapView, setMapView] = useState({
    center: [10.8505, 76.2711] as [number, number],
    zoom: 8,
  });

  const statusColors: Record<string, string> = {
    Critical: "#ef4444",
    Active: "#f97316",
    Warning: "#facc15",
    Resolved: "#22c55e",
  };

  const handleAddIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole !== "admin") return alert("Unauthorized");
    if (!newCity) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newCity)}`,
      );
      const data = await res.json();
      if (data?.[0]) {
        const finalPos: [number, number] = [
          parseFloat(data[0].lat),
          parseFloat(data[0].lon),
        ];
        setIncidents((prev: any) => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            city: newCity,
            issue: newIssue,
            status: newStatus,
            pos: finalPos,
            color: statusColors[newStatus],
          },
        ]);
        setMapView({ center: finalPos, zoom: 15 });
        setNewCity("");
        setNewIssue("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string | number) => {
    if (activeRole !== "admin") return;
    if (window.confirm("Remove record?")) {
      setIncidents((prev: any) => prev.filter((item: any) => item.id !== id));
    }
  };

  return (
    <div className="h-screen w-screen relative bg-[#050505] overflow-hidden font-sans text-white">
      {/* 1. HEADER WITH SLIDING TOGGLE */}
      <div className="absolute top-0 left-0 w-full z-[1002] bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 text-xs font-bold transition-all uppercase tracking-widest"
          >
            ← Dashboard
          </button>

          <div className="h-4 w-[1px] bg-white/20"></div>

          {/* ✅ THE SLIDE TOGGLE BUTTON */}
          <div
            className="relative flex items-center bg-white/5 p-1 rounded-full border border-white/10 w-44 h-9 cursor-pointer"
            onClick={() =>
              setMapMode(mapMode === "dark" ? "satellite" : "dark")
            }
          >
            <div
              className={`absolute top-1 bottom-1 w-[84px] bg-blue-600 rounded-full transition-all duration-300 ${mapMode === "dark" ? "translate-x-[86px]" : "translate-x-0"}`}
            />
            <span
              className={`relative z-10 flex-1 text-[9px] font-black uppercase text-center ${mapMode === "satellite" ? "text-white" : "text-slate-500"}`}
            >
              Satellite
            </span>
            <span
              className={`relative z-10 flex-1 text-[9px] font-black uppercase text-center ${mapMode === "dark" ? "text-white" : "text-slate-500"}`}
            >
              Dark Mode
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[9px] text-slate-500 uppercase tracking-widest">
            {activeRole} Session
          </p>
        </div>
      </div>

      {/* 2. SIDEBAR (Preserved) */}
      <div className="absolute top-24 left-6 z-[1001] w-80 flex flex-col gap-4">
        {activeRole === "admin" && (
          <div className="bg-slate-900/90 backdrop-blur-2xl p-6 rounded-3xl border border-blue-500/30">
            <h2 className="text-sm font-bold mb-4 text-blue-400 uppercase italic">
              Incident Entry
            </h2>
            <form onSubmit={handleAddIncident} className="space-y-3">
              <input
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Location Name..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500"
              />
              <input
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                placeholder="Issue Details..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500"
              />
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white"
              >
                <option value="Critical">🔴 Critical Alert</option>
                <option value="Active">🟠 Active Project</option>
                <option value="Warning">🟡 Warning Zone</option>
                <option value="Resolved">🟢 Operations Normal</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                {loading ? "Geolocating..." : "Push Update"}
              </button>
            </form>
          </div>
        )}

        <div className="bg-slate-900/90 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 flex flex-col max-h-[45vh] overflow-hidden">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">
            Live Reports Feed
          </h3>
          <div
            className="overflow-y-auto space-y-3 pr-2"
            style={{ scrollbarWidth: "none" }}
          >
            {incidents.map((node: any) => (
              <div
                key={node.id}
                onClick={() => setMapView({ center: node.pos, zoom: 15 })}
                className="group p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:border-blue-500/50 transition-all relative"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{
                      backgroundColor: node.color,
                      boxShadow: `0 0 10px ${node.color}`,
                    }}
                  ></div>
                  <span className="text-xs font-bold">{node.city}</span>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  "{node.issue || "No additional data."}"
                </p>
                {activeRole === "admin" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(node.id);
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500/10 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px]"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MAP ENGINE */}
      <MapContainer
        center={mapView.center}
        zoom={mapView.zoom}
        zoomControl={false}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <MapController center={mapView.center} zoom={mapView.zoom} />

        {/* ✅ DYNAMIC TILE LAYER */}
        {mapMode === "satellite" ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri"
          />
        ) : (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; Carto"
          />
        )}

        {/* ✅ NEON ROUTES: Only visible in Dark Mode */}
        {mapMode === "dark" &&
          roadNetworks.map((route, idx) => (
            <Polyline
              key={idx}
              positions={route.coords}
              pathOptions={{
                color: route.color,
                weight: 3,
                opacity: 0.7,
                dashArray: "8, 12",
              }}
            />
          ))}

        {incidents.map((node: any) => {
          const pulseIcon = L.divIcon({
            className: "beast-marker",
            html: `<div style="position: relative; display: flex; align-items: center; justify-content: center;">
                    <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background-color: ${node.color}; opacity: 0.6; animation: marker-pulse-animation 2s infinite; z-index: 1;"></div>
                    <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${node.color}; border: 2px solid white; z-index: 2;"></div>
                  </div>
                  <style>@keyframes marker-pulse-animation { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }</style>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          });

          return (
            <React.Fragment key={node.id}>
              <Circle
                center={node.pos}
                pathOptions={{
                  color: node.color,
                  fillColor: node.color,
                  fillOpacity: 0.1,
                }}
                radius={800}
              />
              <Marker position={node.pos} icon={pulseIcon}>
                <Popup>
                  <div className="text-slate-900 p-2 font-sans min-w-[120px]">
                    <b className="text-sm font-black uppercase block border-b border-slate-200 mb-1">
                      {node.city}
                    </b>
                    <span
                      className="text-[9px] font-bold uppercase"
                      style={{ color: node.color }}
                    >
                      {node.status}
                    </span>
                    <p className="text-xs mt-1 text-slate-600 italic font-bold">
                      "{node.issue}"
                    </p>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
