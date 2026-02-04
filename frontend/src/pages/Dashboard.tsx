import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // 1. SECURITY: Retrieve the role assigned during login
  const userRole = localStorage.getItem("userRole");

  // 2. GATEKEEPER: If no role exists, kick them back to Login
  if (!userRole) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    localStorage.clear(); // Wipe the session
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden bg-[url('https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center font-sans">
      {/* Dark High-Gloss Overlay */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px]"></div>

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between relative z-10 hidden md:flex">
        <div>
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              NATPAC
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${userRole === "admin" ? "bg-purple-500 shadow-[0_0_8px_purple]" : "bg-blue-500 shadow-[0_0_8px_cyan]"}`}
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

            {/* 🔒 PROTECTED ADMIN MODULES */}
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
                <NavItem icon="⚙️" text="Settings" />
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
              10:42 AM
            </p>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">
              System Synchronized
            </p>
          </div>
        </header>

        {/* STATS: Only visible to Admins to protect sensitive internal data */}
        {userRole === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-in slide-in-from-top-4 duration-500">
            <StatCard
              title="Active Surveys"
              value="12"
              icon="📡"
              color="text-green-400"
            />
            <StatCard
              title="Field Staff"
              value="48"
              icon="👷"
              color="text-yellow-400"
            />
            <StatCard
              title="Data Points"
              value="1.2M"
              icon="💾"
              color="text-blue-400"
            />
            <StatCard
              title="Security Alerts"
              value="0"
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
            desc="Access real-time data collection tools for Junction Counts and Speed Studies."
            icon="📝"
            bg="from-blue-900/40 to-black/40"
            btnText="Launch Survey"
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
            desc="Review project timelines, budget status, and traffic analysis reports."
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
      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 ${active ? "bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]" : "hover:bg-white/5 text-gray-400 hover:text-white"}`}
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
