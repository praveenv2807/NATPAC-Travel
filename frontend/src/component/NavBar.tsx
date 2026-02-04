import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Map,
  User,
  Settings,
  Search,
  HelpCircle,
  LogOut,
} from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Create Trip",
      path: "/create-trip",
      icon: <PlusCircle size={20} />,
    },
    { name: "History", path: "/history", icon: <History size={20} /> },
    { name: "Expenses", path: "/search", icon: <Search size={20} /> },
    { name: "Trip Details", path: "/trip/1", icon: <Map size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
    { name: "Queries", path: "/support", icon: <HelpCircle size={20} /> },
  ];

  return (
    <div className="w-64 bg-gray-800 h-screen border-r border-gray-700 flex flex-col p-4 fixed left-0 top-0">
      <h1 className="text-2xl font-bold text-blue-500 mb-10 px-4">
        Travel App
      </h1>
      <div className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded-xl mt-auto transition"
      >
        <LogOut size={20} />
        <span className="font-bold">Logout</span>
      </button>
    </div>
  );
};

export default NavBar;
