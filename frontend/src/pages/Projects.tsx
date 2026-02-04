import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  // 1. DATA STATE
  const [projectList, setProjectList] = useState([
    {
      id: 1,
      title: "Kochi Smart Bypass",
      status: "Active",
      desc: "Advanced junction counts and traffic flow modeling for NH-66 expansion.",
    },
    {
      id: 2,
      title: "Trivandrum Metro Link",
      status: "Pending",
      desc: "Feasibility study for the light metro corridor and station placement.",
    },
    {
      id: 3,
      title: "Urban Signal Grid",
      status: "Completed",
      desc: "Installation of AI-integrated traffic signals across the city center.",
    },
  ]);

  // 2. FORM STATE
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    status: "Active",
  });

  if (!userRole) {
    navigate("/");
    return null;
  }

  // 3. LOGIC FUNCTIONS
  const handleSave = () => {
    if (editingId) {
      setProjectList(
        projectList.map((p) =>
          p.id === editingId ? { ...formData, id: p.id } : p,
        ),
      );
    } else {
      setProjectList([...projectList, { ...formData, id: Date.now() }]);
    }
    closeForm();
  };

  const openEdit = (project: any) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      desc: project.desc,
      status: project.status,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ title: "", desc: "", status: "Active" });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden bg-[url('https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center font-sans">
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* --- SIDEBAR (RESTORED OLD STYLE) --- */}
      <aside className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 p-6 flex flex-col justify-between relative z-10 hidden md:flex">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">
            NATPAC
          </h1>
          <p className="text-xs text-blue-200/50 uppercase tracking-widest mb-10 font-bold">
            Project Inventory
          </p>

          <nav className="space-y-2">
            <div
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/5 text-gray-400"
            >
              <span>🏠</span>{" "}
              <span className="font-medium text-sm">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30">
              <span>📂</span>{" "}
              <span className="font-medium text-sm">Projects</span>
            </div>
          </nav>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 font-semibold text-sm"
        >
          <span>🛑</span> Sign Out
        </button>
      </aside>

      {/* --- MAIN CONTENT (RESTORED OLD STYLE) --- */}
      <main className="flex-1 p-8 relative z-10 overflow-y-auto">
        <header className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
              Project <span className="text-blue-500">Management</span>
            </h2>
            <p className="text-blue-200/60 mt-1 font-bold uppercase tracking-widest text-[10px]">
              Auth Level: <span className="text-cyan-400">{userRole}</span>
            </p>
          </div>

          {userRole === "admin" && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20"
            >
              + Initiate Project
            </button>
          )}
        </header>

        {/* MEDIUM SIZE GRID (Balanced boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectList.map((project) => (
            <div
              key={project.id}
              className="bg-black/30 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:border-blue-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-black uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h4>
                <span
                  className={`text-[10px] px-2 py-1 rounded border font-black tracking-widest ${
                    project.status === "Active"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : project.status === "Completed"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  }`}
                >
                  {project.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-6 font-medium leading-relaxed">
                {project.desc}
              </p>

              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-xs font-mono text-blue-400 font-bold italic uppercase">
                  ID-00{project.id}
                </span>

                {userRole === "admin" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(project)}
                      className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 px-3 py-1 rounded border border-white/10 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setProjectList(
                          projectList.filter((p) => p.id !== project.id),
                        )
                      }
                      className="text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1 rounded border border-red-500/20 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* --- DYNAMIC FORM OVERLAY --- */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/10 p-10 rounded-3xl w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-white italic">
                {editingId ? "Modify" : "Initiate"}{" "}
                <span className="text-blue-500">Record</span>
              </h2>
              <div className="space-y-4">
                <input
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 font-bold text-sm"
                  placeholder="Project Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <textarea
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 h-24 font-bold text-sm resize-none"
                  placeholder="Scope/Description"
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                />
                <select
                  className="w-full bg-gray-800 border border-white/10 p-4 rounded-xl outline-none text-blue-400 font-black uppercase tracking-widest text-[10px]"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
                  >
                    {editingId ? "Update" : "Initiate"}
                  </button>
                  <button
                    onClick={closeForm}
                    className="px-6 py-4 rounded-xl font-black uppercase text-[10px] text-gray-500 tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
