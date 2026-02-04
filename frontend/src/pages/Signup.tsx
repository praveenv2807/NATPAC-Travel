import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // SECURITY LOGIC: Every new signup is automatically assigned 'citizen' role.
    // Admin roles must be assigned manually by the organization.
    localStorage.setItem("userRole", "citizen");
    alert("Account Created Successfully! Accessing Public Portal...");
    navigate("/map");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black relative overflow-hidden font-sans px-4">
      {/* Background Orbs */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-[450px] h-[450px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30"></div>

      {/* GLASS CARD */}
      <div className="w-full max-w-md p-10 rounded-[2rem] shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white z-10 relative">
        <div className="text-center mb-10 relative">
          <h1 className="absolute inset-0 text-4xl font-black text-blue-500 blur-2xl opacity-50 select-none animate-pulse uppercase">
            NEW REGISTRATION
          </h1>
          <h1 className="relative text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-2xl z-10 uppercase">
            CREATE <span className="text-white">ACCOUNT</span>
          </h1>
          <p className="text-blue-300 uppercase tracking-[0.3em] text-[9px] font-black mt-2 opacity-70">
            Join the NATPAC GIS Network
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] text-blue-300 font-bold uppercase ml-2 tracking-widest">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm"
              placeholder="Your Name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-blue-300 font-bold uppercase ml-2 tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm"
              placeholder="email@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-blue-300 font-bold uppercase ml-2 tracking-widest">
              Create Security Key
            </label>
            <input
              type="password"
              required
              className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transform hover:scale-[1.02] active:scale-95 transition-all duration-200 border border-white/20 mt-4"
          >
            Register & Initialize
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-purple-400 font-bold hover:text-white transition-all underline decoration-purple-500/50 underline-offset-4"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
