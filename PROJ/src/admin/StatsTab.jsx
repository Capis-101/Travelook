import React, { useEffect, useState } from "react";
import { db } from "../firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import { FaUsers, FaSuitcase, FaBook } from "react-icons/fa";
import "./admin.css";

export default function StatsTab() {
  const [counts, setCounts] = useState({ users: 0, packages: 0, journals: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const usersSnap = await getDocs(collection(db, "users")).catch(() => ({ size: 0 }));
      const packsSnap = await getDocs(collection(db, "packages")).catch(() => ({ size: 0 }));
      const journalsSnap = await getDocs(collection(db, "journalPosts")).catch(() => ({ size: 0 }));

      setCounts({
        users: usersSnap.size || 0,
        packages: packsSnap.size || 0,
        journals: journalsSnap.size || 0,
      });
    };
    fetchCounts();
  }, []);

  return (
    <div className="stats-container">
      <h3 className="stats-title">📊 System Analytics</h3>

      <div className="stats-container">
        <div className="stats-card">
          <FaUsers className="stats-icon" />
          <p className="stats-count">{counts.users}</p>
          <p className="stats-label">Total Users</p>
        </div>

        <div className="stats-card">
          <FaSuitcase className="stats-icon" />
          <p className="stats-count">{counts.packages}</p>
          <p className="stats-label">Total Packages</p>
        </div>

        <div className="stats-card">
          <FaBook className="stats-icon" />
          <p className="stats-count">{counts.journals}</p>
          <p className="stats-label">Total Journals</p>
        </div>
      </div>
    </div>
  );
}
