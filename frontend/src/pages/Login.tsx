import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPortal() {
  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // 1. VIBRANT BLUE & VIOLET SPLASH
  useEffect(() => {
    if (showSplash) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setShowSplash(false), 800);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [showSplash]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminMode) {
      if (email === "admin@natpac.com" && password === "1234") {
        localStorage.setItem("userRole", "admin");
        setIsAuthenticated(true);
      } else {
        alert("SECURITY ERROR: Unauthorized Admin Credentials");
      }
    } else {
      localStorage.setItem("userRole", "citizen");
      setIsAuthenticated(true);
    }
  };

  if (showSplash) {
    return (
      <div className="h-screen w-screen bg-[#050505] flex flex-col items-center justify-center font-sans overflow-hidden relative">
        <div className="absolute h-[600px] w-[600px] bg-blue-600/20 blur-[150px] rounded-full -top-20 -left-20 animate-pulse"></div>
        <div className="absolute h-[600px] w-[600px] bg-purple-600/20 blur-[150px] rounded-full -bottom-20 -right-20 animate-bounce"></div>
        <h1 className="text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_35px_rgba(59,130,246,0.8)] uppercase z-10">
          NAT
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-200 to-blue-500">
            PAC
          </span>
        </h1>
        <div className="mt-16 w-64 h-1 bg-white/10 rounded-full overflow-hidden relative border border-white/5 z-10">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black relative overflow-hidden font-sans px-4">
      <div className="absolute top-20 left-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-[450px] h-[450px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30"></div>

      <div className="w-full max-w-md p-10 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white z-10 relative">
        {!isAuthenticated ? (
          <>
            <div className="text-center mb-10 relative">
              <h1 className="absolute inset-0 text-5xl font-black text-blue-500 blur-2xl opacity-50 select-none animate-pulse uppercase">
                NATPAC TRAVEL
              </h1>
              <h1 className="relative text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-2xl z-10 uppercase">
                NATPAC <span className="text-white">TRAVEL</span>
              </h1>
            </div>

            <div className="flex bg-black/30 p-1 rounded-xl mb-8 border border-white/10 relative">
              <div
                className={`absolute top-1 bottom-1 w-[48%] rounded-lg transition-all duration-300 ${!isAdminMode ? "left-1 bg-blue-600/50" : "left-[51%] bg-purple-600/50"}`}
              ></div>
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className="relative z-10 flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-white"
              >
                User Access
              </button>
              <button
                type="button"
                onClick={() => setIsAdminMode(true)}
                className="relative z-10 flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-white"
              >
                Admin Gate
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="email"
                required
                className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                placeholder={
                  isAdminMode ? "Admin Restricted ID" : "Email Address"
                }
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                placeholder="Security Key"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg transform hover:scale-[1.02] transition-all border border-white/20 ${isAdminMode ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-gradient-to-r from-blue-600 to-cyan-500"}`}
              >
                Sign In
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 animate-in zoom-in duration-500">
            <div className="text-6xl mb-4">🔓</div>
            <h2 className="text-2xl font-black tracking-tighter mb-2 uppercase">
              Identity Verified
            </h2>
            <p className="text-blue-300 text-[10px] tracking-[0.4em] mb-8 uppercase opacity-60">
              System Ready for Dashboard Deployment
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-2xl font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-white/30 animate-pulse"
            >
              Enter Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
