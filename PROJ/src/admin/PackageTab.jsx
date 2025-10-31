import React, { useEffect, useState } from "react";
import { db } from "../firebaseconfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function PackagesTab() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // edit fields
  const [editData, setEditData] = useState({
    packageName: "",
    destination: "",
    duration: "",
    category: "",
    type: "",
    accommodation: "",
    activities: "",
    foodDetails: "",
    durationDays: "",
  });

  const packagesRef = collection(db, "packages");

  // 🔹 Fetch packages from Firestore
  const fetchPackages = async () => {
    setLoading(true);
    const snap = await getDocs(packagesRef);
    setPackages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // 🔹 Start editing
  const handleEdit = (pkg) => {
    setEditingId(pkg.id);
    setEditData({
      packageName: pkg.packageName || "",
      destination: pkg.destination || "",
      duration: pkg.duration || "",
      category: pkg.category || "",
      type: pkg.type || "",
      accommodation: pkg.accommodation || "",
      activities: pkg.activities || "",
      foodDetails: pkg.foodDetails || "",
      durationDays: pkg.durationDays || "",
    });
  };

  // 🔹 Save updates
  const handleUpdate = async () => {
    if (!editingId) return alert("No package selected");
    try {
      const docRef = doc(db, "packages", editingId);
      await updateDoc(docRef, editData);
      alert("✅ Package updated successfully");
      setEditingId(null);
      fetchPackages();
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  // 🔹 Delete package
  const handleDelete = async (id) => {
    if (!confirm("Delete this package?")) return;
    await deleteDoc(doc(db, "packages", id));
    fetchPackages();
  };

  return (
    <div>
      <h3>✈️ Manage Packages</h3>

      {/* 🔹 Edit form */}
      {editingId && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h4>Editing Package</h4>
          <div className="row">
            <div className="col">
              <input
                className="input"
                value={editData.packageName}
                onChange={(e) =>
                  setEditData({ ...editData, packageName: e.target.value })
                }
                placeholder="Package name"
              />
              <input
                className="input"
                value={editData.destination}
                onChange={(e) =>
                  setEditData({ ...editData, destination: e.target.value })
                }
                placeholder="Destination"
              />
              <input
                className="input"
                value={editData.duration}
                onChange={(e) =>
                  setEditData({ ...editData, duration: e.target.value })
                }
                placeholder="Duration"
              />
              <input
                className="input"
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
                placeholder="Category"
              />
              <input
                className="input"
                value={editData.type}
                onChange={(e) =>
                  setEditData({ ...editData, type: e.target.value })
                }
                placeholder="Type"
              />
              <input
                className="input"
                value={editData.accommodation}
                onChange={(e) =>
                  setEditData({ ...editData, accommodation: e.target.value })
                }
                placeholder="Accommodation"
              />
              <input
                className="input"
                value={editData.activities}
                onChange={(e) =>
                  setEditData({ ...editData, activities: e.target.value })
                }
                placeholder="Activities"
              />
              <input
                className="input"
                value={editData.foodDetails}
                onChange={(e) =>
                  setEditData({ ...editData, foodDetails: e.target.value })
                }
                placeholder="Food Details"
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={handleUpdate}>
              💾 Save Changes
            </button>
            <button
              className="btn"
              onClick={() => setEditingId(null)}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Table of packages */}
      <div className="card">
        <h4>Existing Packages {loading ? "(loading...)" : ""}</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Destination</th>
              <th>Duration</th>
              <th>Category</th>
              <th>Type</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr key={p.id}>
                <td>{p.packageName}</td>
                <td>{p.destination}</td>
                <td>{p.duration}</td>
                <td>{p.category}</td>
                <td>{p.type}</td>
                <td>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.packageName}
                      className="preview-img"
                      style={{ width: 80, height: 60, objectFit: "cover" }}
                    />
                  ) : (
                    <span className="small">no image</span>
                  )}
                </td>
                <td>
                  <button className="btn" onClick={() => handleEdit(p)}>
                    Edit
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => handleDelete(p.id)}
                    style={{ marginLeft: 6 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {packages.length === 0 && (
              <tr>
                <td colSpan="7" className="small">
                  No packages yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
