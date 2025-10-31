import React, { useState } from "react";
import "./admin.css";
import PackagesTab from "../admin/PackageTab.jsx";
import JournalsTab from "../admin/JournalTab";
import StatsTab from "../admin/StatsTab";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseconfig.js";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [tab, setTab] = useState("stats");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <button className={tab === "stats" ? "active" : ""} onClick={() => setTab("stats")}>📊 Stats</button>
        <button className={tab === "packages" ? "active" : ""} onClick={() => setTab("packages")}>🧳 Packages</button>
        <button className={tab === "journals" ? "active" : ""} onClick={() => setTab("journals")}>📝 Journals</button>
      </aside>

      <main className="admin-main">
        {tab === "stats" && <StatsTab />}
        {tab === "packages" && <PackagesTab />}
        {tab === "journals" && <JournalsTab />}
      </main>

      {/* ✅ Logout Button */}
      <button className="admin-logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}
