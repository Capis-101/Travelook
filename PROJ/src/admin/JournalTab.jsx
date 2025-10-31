import React, { useEffect, useState } from "react";
import { db } from "../firebaseconfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function JournalsTab() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const journalsRef = collection(db, "journalPosts"); // ✅ SAME NAME AS USER

  const fetchPosts = async () => {
    setLoading(true);
    const snap = await getDocs(journalsRef);
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // ✅ show only public posts
    setPosts(all.filter(p => p.isPublic === true));

    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this journal post?")) return;
    await deleteDoc(doc(db, "journalPosts", id)); // ✅ same collection
    fetchPosts();
  };

  return (
    <div>
      <h3>Journal Moderation</h3>
      <div className="card">
        <p className="small">Showing public posts. You can delete inappropriate ones.</p>
        {loading && <p>Loading...</p>}
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Content</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id}>
                <td>{p.username || "Unknown"}</td>
                <td style={{ maxWidth: 400 }}>{p.content || "-"}</td>
                <td className="small">
                  {p.timestamp?.seconds
                    ? new Date(p.timestamp.seconds * 1000).toLocaleString()
                    : "-"}
                </td>
                <td>
                  <button className="btn danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan="4" className="small">No public posts yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
