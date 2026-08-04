import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  // 1. SECURITY & DATA PRESERVATION
  const userRole = localStorage.getItem("userRole") || "guest";
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString(),
  );

  // Default state matching every column in the PostgreSQL schema
  const getDefaultTripState = () => ({
    userId: "user1",
    tripNumber: Math.floor(1000 + Math.random() * 9000),
    tripDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    origin: "",
    destination: "",
    originLat: "",
    originLng: "",
    destinationLat: "",
    destinationLng: "",
    startTime: "08:00",
    endTime: "09:00",
    mode: "🚌 Bus (KSRTC)",
    purpose: "💼 Work/Commute",
    frequency: "🔄 Daily",
    distance: "",
    companions: "0",
    cost: "",
    description: "",
    image: null as File | null,
  });

  // 2. STATE
  const [showTravelDiary, setShowTravelDiary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [tripLog, setTripLog] = useState(getDefaultTripState());

  // Clock Sync
  useEffect(() => {
    const timer = setInterval(
      () => setCurrentTime(new Date().toLocaleTimeString()),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  // GATEKEEPER
  if (!userRole) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Helper to remove emojis from string inputs before sending to Spring Boot
  const cleanString = (str: string) =>
    str
      .replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{1F900}-\u{1F9FF}]/gu,
        "",
      )
      .trim();

  // Automatic Location Detection for Origin Coordinates via Browser GPS
  const handleAutoDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          const now = new Date();
          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");

          setTripLog((prev) => ({
            ...prev,
            originLat: lat,
            originLng: lng,
            startTime: `${hours}:${minutes}`,
          }));
          alert("🛰️ Current Origin Lat/Lng & Start Time Detected!");
        },
        (error) => alert("Geolocation error: " + error.message),
      );
    }
  };

  // RELIABLE DESTINATION GEOCODING VIA OPENSTREETMAP NOMINATIM
  const geocodeDestination = async (destinationName: string) => {
    if (!destinationName.trim()) return;

    setIsGeocoding(true);
    try {
      // Add regional context if not specified to help OSM locate places accurately
      const searchQuery = destinationName.toLowerCase().includes("india")
        ? destinationName
        : `${destinationName}, Tamil Nadu, India`;

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: searchQuery,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "NATPAC_Survey_App/1.0",
          },
        },
      );

      if (response.data && response.data.length > 0) {
        const firstResult = response.data[0];
        setTripLog((prev) => ({
          ...prev,
          destinationLat: parseFloat(firstResult.lat).toFixed(6),
          destinationLng: parseFloat(firstResult.lon).toFixed(6),
        }));
      } else {
        alert(
          `⚠️ Could not auto-detect Lat/Lng for "${destinationName}". Please enter coordinates manually.`,
        );
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  // POST REQUEST MATCHING EXACT POSTGRESQL SCHEMA
  const handleTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Exact field alignment with PostgreSQL database table
    const payload = {
      userId: cleanString(tripLog.userId),
      tripNumber: Number(tripLog.tripNumber),
      origin: cleanString(tripLog.origin),
      destination: cleanString(tripLog.destination),
      purpose: cleanString(tripLog.purpose),
      mode: cleanString(tripLog.mode), // DB: mode
      frequency: cleanString(tripLog.frequency),

      // Double precision & Integer DB types
      companions: Number(tripLog.companions) || 0, // DB: companions
      cost: parseFloat(tripLog.cost) || 0.0, // DB: cost
      distance: parseFloat(tripLog.distance) || 0.0, // DB: distance
      originLat: tripLog.originLat ? parseFloat(tripLog.originLat) : null,
      originLng: tripLog.originLng ? parseFloat(tripLog.originLng) : null,
      destinationLat: tripLog.destinationLat
        ? parseFloat(tripLog.destinationLat)
        : null,
      destinationLng: tripLog.destinationLng
        ? parseFloat(tripLog.destinationLng)
        : null,

      // Timestamp without time zone strings
      startTime: tripLog.startTime
        ? `${tripLog.tripDate}T${tripLog.startTime}:00`
        : new Date().toISOString(),
      endTime: tripLog.endTime
        ? `${tripLog.tripDate}T${tripLog.endTime}:00`
        : new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:8085/api/trips", payload);
      alert("✅ Trip Data Successfully Saved to PostgreSQL Database!");

      setTripLog(getDefaultTripState());
      setShowTravelDiary(false);
    } catch (error) {
      console.error("Error submitting trip to Spring Boot:", error);
      alert(
        "❌ Failed to save trip. Check DevTools Console / Network tab for backend errors.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden bg-[url('https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center font-sans relative">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px]"></div>

      {/* --- NATPAC TRAVEL DIARY MODAL --- */}
      {showTravelDiary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-all"
            onClick={() => setShowTravelDiary(false)}
          >
            <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-xl"></div>
          </div>

          <div className="relative w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-y-auto max-h-[95vh] text-emerald-50">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-black tracking-tighter text-emerald-100 flex items-center gap-3">
                  🍃 Trip Entry
                </h3>
                <p className="text-[10px] text-emerald-300/60 font-black uppercase tracking-[0.3em] mt-1">
                  NATPAC Eco-Planning • PS 25082
                </p>
              </div>
              <button
                onClick={() => setShowTravelDiary(false)}
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTripSubmit} className="space-y-4">
              {/* IMAGE UPLOAD */}
              <div className="group relative w-full h-24 border-2 border-dashed border-white/20 rounded-[1.5rem] flex flex-col items-center justify-center hover:border-emerald-400/50 transition-all cursor-pointer bg-black/10 overflow-hidden">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) =>
                    setTripLog({
                      ...tripLog,
                      image: e.target.files ? e.target.files[0] : null,
                    })
                  }
                />
                <span className="text-2xl mb-1">📸</span>
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-200/50 text-center px-4">
                  {tripLog.image
                    ? `Selected: ${tripLog.image.name}`
                    : "Upload Trip Photo / Road Condition"}
                </p>
              </div>

              {/* TRIP DATE */}
              <div>
                <label className="text-[9px] font-black text-emerald-300/40 uppercase px-2 mb-1 block">
                  Trip Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-white/5 border border-white/10 p-3.5 rounded-2xl text-xs outline-none focus:bg-white/10 text-white cursor-pointer"
                  value={tripLog.tripDate}
                  onChange={(e) =>
                    setTripLog({ ...tripLog, tripDate: e.target.value })
                  }
                />
              </div>

              {/* ORIGIN SECTION WITH GPS AUTO-DETECT */}
              <div className="space-y-2 bg-black/20 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-emerald-300/60 uppercase">
                    Trip #{tripLog.tripNumber} Origin Details
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoDetect}
                    className="bg-emerald-600/30 border border-emerald-500/40 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-300 hover:bg-emerald-600/50 transition-all"
                  >
                    🛰️ Auto-Detect GPS
                  </button>
                </div>
                <input
                  required
                  placeholder="Origin Name (e.g. Coimbatore Junction)"
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none text-white"
                  value={tripLog.origin}
                  onChange={(e) =>
                    setTripLog({ ...tripLog, origin: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Origin Lat (e.g. 11.0168)"
                    type="number"
                    step="any"
                    className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none text-white"
                    value={tripLog.originLat}
                    onChange={(e) =>
                      setTripLog({ ...tripLog, originLat: e.target.value })
                    }
                  />
                  <input
                    placeholder="Origin Lng (e.g. 76.9558)"
                    type="number"
                    step="any"
                    className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none text-white"
                    value={tripLog.originLng}
                    onChange={(e) =>
                      setTripLog({ ...tripLog, originLng: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* DESTINATION SECTION WITH AUTO & MANUAL GEOCODING */}
              <div className="space-y-2 bg-black/20 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-emerald-300/60 uppercase">
                    Destination Details
                  </label>
                  <button
                    type="button"
                    disabled={isGeocoding}
                    onClick={() => geocodeDestination(tripLog.destination)}
                    className="bg-blue-600/30 border border-blue-500/40 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-blue-300 hover:bg-blue-600/50 transition-all disabled:opacity-50"
                  >
                    {isGeocoding ? "🔍 Searching..." : "🔍 Fetch Lat/Lng"}
                  </button>
                </div>
                <input
                  required
                  placeholder="Destination Name (e.g. Trichy Central)"
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none text-white"
                  value={tripLog.destination}
                  onChange={(e) =>
                    setTripLog({ ...tripLog, destination: e.target.value })
                  }
                  onBlur={(e) => geocodeDestination(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Dest Lat (Auto-filled)"
                    type="number"
                    step="any"
                    className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none text-white opacity-90"
                    value={tripLog.destinationLat}
                    onChange={(e) =>
                      setTripLog({ ...tripLog, destinationLat: e.target.value })
                    }
                  />
                  <input
                    placeholder="Dest Lng (Auto-filled)"
                    type="number"
                    step="any"
                    className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none text-white opacity-90"
                    value={tripLog.destinationLng}
                    onChange={(e) =>
                      setTripLog({ ...tripLog, destinationLng: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* START & END TIME */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-emerald-300/40 uppercase px-2 mb-1 block">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none text-white cursor-pointer"
                    value={tripLog.startTime}
                    onChange={(e) =>
                      setTripLog({ ...tripLog, startTime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-emerald-300/40 uppercase px-2 mb-1 block">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none text-white cursor-pointer"
                    value={tripLog.endTime}
                    onChange={(e) =>
                      setTripLog({ ...tripLog, endTime: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* MODE, PURPOSE & DISTANCE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  className="bg-black/30 border border-white/10 p-3 rounded-xl text-[10px] font-bold outline-none text-white cursor-pointer"
                  value={tripLog.mode}
                  onChange={(e) =>
                    setTripLog({ ...tripLog, mode: e.target.value })
                  }
                >
                  <option className="bg-emerald-900" value="🚌 Bus (KSRTC)">
                    🚌 Bus (KSRTC)
                  </option>
                  <option className="bg-emerald-900" value="🚆 Train">
                    🚆 Train
                  </option>
                  <option className="bg-emerald-900" value="🚇 Metro">
                    🚇 Metro
                  </option>
                  <option className="bg-emerald-900" value="🚗 Car/Taxi">
                    🚗 Car/Taxi
                  </option>
                  <option
                    className="bg-emerald-900"
                    value="🏍️ Bike/Two-Wheeler"
                  >
                    🏍️ Bike/Two-Wheeler
                  </option>
                  <option className="bg-emerald-900" value="🚶 Walking/Foot">
                    🚶 Walking/Foot
                  </option>
                </select>

                <select
                  className="bg-black/30 border border-white/10 p-3 rounded-xl text-[10px] font-bold outline-none text-white cursor-pointer"
                  value={tripLog.purpose}
                  onChange={(e) =>
                    setTripLog({ ...tripLog, purpose: e.target.value })
                  }
                >
                  <option className="bg-emerald-900" value="💼 Work/Commute">
                    💼 Work/Commute
                  </option>
                  <option className="bg-emerald-900" value="🎓 Education">
                    🎓 Education
                  </option>
                  <option
                    className="bg-emerald-900"
                    value="🛒 Shopping/Personal"
                  >
                    🛒 Shopping/Personal
                  </option>
                  <option className="bg-emerald-900" value="🎉 Social/Leisure">
                    🎉 Social/Leisure
                  </option>
                </select>

                <input
                  placeholder="Distance (km)"
                  type="number"
                  step="any"
                  className="bg-black/30 border border-white/10 p-3 rounded-xl text-xs outline-none text-white"
                  value={tripLog.distance}
                  onChange={(e) =>
                    setTripLog({ ...tripLog, distance: e.target.value })
                  }
                />
              </div>

              {/* COMPANIONS, COST & FREQUENCY */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  placeholder="Companions"
                  type="number"
                  className="bg-black/30 border border-white/10 p-3 rounded-xl text-xs outline-none text-white"
                  value={tripLog.companions}
                  onChange={(e) =>
                    setTripLog({ ...tripLog, companions: e.target.value })
                  }
                />
                <input
                  placeholder="Cost (₹)"
                  type="number"
                  step="any"
                  className="bg-black/30 border border-white/10 p-3 rounded-xl text-xs outline-none text-white"
                  value={tripLog.cost}
                  onChange={(e) =>
                    setTripLog({ ...tripLog, cost: e.target.value })
                  }
                />

                <select
                  className="bg-black/30 border border-white/10 p-3 rounded-xl text-[10px] font-bold outline-none text-white cursor-pointer"
                  value={tripLog.frequency}
                  onChange={(e) =>
                    setTripLog({ ...tripLog, frequency: e.target.value })
                  }
                >
                  <option className="bg-emerald-900" value="🔄 Daily">
                    🔄 Daily
                  </option>
                  <option className="bg-emerald-900" value="📅 Weekly">
                    📅 Weekly
                  </option>
                  <option className="bg-emerald-900" value="✈️ Occasional">
                    ✈️ Occasional
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] text-white"
              >
                {isSubmitting ? "SYNCING..." : "Sync with NATPAC Ecosystem"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between relative z-10 hidden md:flex">
        <div>
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              NATPAC
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  userRole === "admin"
                    ? "bg-purple-500 shadow-[0_0_8px_purple]"
                    : "bg-blue-500 shadow-[0_0_8px_cyan]"
                }`}
              ></span>
              <p className="text-[10px] text-blue-200/50 uppercase tracking-[0.2em] font-black">
                {userRole === "admin" ? "Admin Command" : "Public Portal"}
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 opacity-50">
              Modules
            </p>
            <NavItem icon="📝" text="Field Surveys" active />
            <NavItem
              icon="🗺️"
              text="GIS Planning"
              onClick={() => navigate("/map")}
            />
            <NavItem
              icon="📂"
              text="Projects"
              onClick={() => navigate("/projects")}
            />

            {userRole === "admin" && (
              <div className="pt-6 animate-in fade-in duration-700">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 opacity-50">
                  System Authority
                </p>
                <NavItem
                  icon="📊"
                  text="Analytics"
                  onClick={() => navigate("/analytics")}
                />
                <NavItem
                  icon="⚙️"
                  text="Settings"
                  onClick={() => navigate("/settings")}
                />
                <NavItem icon="👥" text="User Mgmt" />
              </div>
            )}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400/70 hover:text-red-400 transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-red-500/20 p-3 rounded-xl hover:bg-red-500/10"
        >
          <span>🛑</span> End Session
        </button>
      </aside>

      {/* --- MAIN COMMAND CENTER --- */}
      <main className="flex-1 p-8 relative z-10 overflow-y-auto">
        <header className="flex justify-between items-end mb-10 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
              Operations <span className="text-blue-500">Overview</span>
            </h2>
            <p className="text-blue-200/40 text-xs mt-2 font-bold uppercase tracking-widest">
              Authorization Level:{" "}
              <span className="text-cyan-400">{userRole}</span>
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-3xl font-mono font-black text-white/90">
              {currentTime}
            </p>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">
              System Synchronized
            </p>
          </div>
        </header>

        {userRole === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-in slide-in-from-top-4 duration-500">
            <StatCard
              title="Captured Trips"
              value="1,204"
              icon="FC"
              color="text-green-400"
            />
            <StatCard
              title="Active Surveyors"
              value="48"
              icon="👷"
              color="text-yellow-400"
            />
            <StatCard
              title="Data Nodes"
              value="1.2M"
              icon="💾"
              color="text-blue-400"
            />
            <StatCard
              title="System Health"
              value="100%"
              icon="🛡️"
              color="text-cyan-400"
            />
          </div>
        )}

        <h3 className="text-sm font-black text-white/60 mb-8 flex items-center gap-3 uppercase tracking-[0.2em]">
          <span className="w-8 h-[2px] bg-blue-600"></span> Deployment Modules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ModuleCard
            title="Traffic Survey"
            role="Field Team"
            desc="Capture trip information including origin/destination, mode, and purpose (PS 25082)."
            icon="📝"
            bg="from-blue-900/40 to-black/40"
            btnText="Launch Survey Form"
            onClick={() => setShowTravelDiary(true)}
          />

          <ModuleCard
            title="GIS Planning"
            role="Planners"
            desc="View integrated geospatial layers and infrastructure mapping."
            icon="🗺️"
            bg="from-purple-900/40 to-black/40"
            btnText="View Live Map"
            onClick={() => navigate("/map")}
          />

          <ModuleCard
            title="Analytics"
            role="Management"
            desc="Review trip chains, cost analysis, and planning reports for NATPAC."
            icon="📊"
            bg="from-cyan-900/40 to-black/40"
            btnText={userRole === "admin" ? "Open Analytics" : "Request Access"}
            onClick={() => userRole === "admin" && navigate("/analytics")}
          />
        </div>
      </main>
    </div>
  );
}

// --- REUSABLE UI COMPONENTS ---
function NavItem({ icon, text, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
        active
          ? "bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          : "hover:bg-white/5 text-gray-400 hover:text-white"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-black text-[10px] uppercase tracking-widest">
        {text}
      </span>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-between group hover:border-blue-500/50 transition-all">
      <div>
        <p className="text-gray-500 text-[9px] uppercase tracking-widest font-black mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-black text-white">{value}</h3>
      </div>
      <span
        className={`text-2xl ${color} bg-white/5 p-4 rounded-xl group-hover:scale-110 transition-transform`}
      >
        {icon}
      </span>
    </div>
  );
}

function ModuleCard({ title, desc, icon, bg, role, btnText, onClick }: any) {
  return (
    <div
      className={`group relative p-[1px] rounded-3xl bg-gradient-to-br ${bg} border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all duration-500`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative p-8 h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <span className="text-4xl p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
            {icon}
          </span>
          <span className="text-[8px] font-black uppercase tracking-widest py-1.5 px-3 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
            {role}
          </span>
        </div>
        <h4 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tighter">
          {title}
        </h4>
        <p className="text-gray-400 text-xs mt-4 leading-relaxed flex-1 font-medium">
          {desc}
        </p>
        <button
          onClick={onClick}
          className="mt-8 w-full py-4 bg-white/5 hover:bg-blue-600 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95"
        >
          {btnText}
        </button>
      </div>
    </div>
  );
}
