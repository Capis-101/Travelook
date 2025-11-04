import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebaseconfig.js";
import { onAuthStateChanged } from "firebase/auth";
import Nav from "./nav.jsx";
import "./journal.css";
import Footer from "../user/footer.jsx";

function Journal() {
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [publicPosts, setPublicPosts] = useState([]);
  const [privatePosts, setPrivatePosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Watch for user login/logout
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubAuth;
  }, []);

  // ✅ Load posts only when user is known
  useEffect(() => {
    if (loading) return;

    const q = query(collection(db, "journalPosts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const all = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPublicPosts(all.filter((p) => p.isPublic));
      if (user) {
        setPrivatePosts(all.filter((p) => !p.isPublic && p.uid === user.uid));
      } else {
        setPrivatePosts([]);
      }
    });

    return unsubscribe;
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must login to post!");

    await addDoc(collection(db, "journalPosts"), {
      content,
      username: user.displayName || "Traveler",
      uid: user.uid,
      isPublic,
      timestamp: serverTimestamp(),
    });

    setContent("");
    setIsPublic(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this post?")) {
      await deleteDoc(doc(db, "journalPosts", id));
    }
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="loading-text">Loading your journal...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />

      <div className="journal-wrapper">
        {/* ✅ LEFT PANEL */}
        <div className="journal-left scroll-area">
          {/* Create Post */}
          <form className="glass-card new-post" onSubmit={handleSubmit}>
            <textarea
              rows={4}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="visibility-tag">
              <label>
                <input
                  type="radio"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                />
                🌍 Public
              </label>
              <label>
                <input
                  type="radio"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                />
                🔒 Private
              </label>
            </div>

            <button type="submit">Post</button>
          </form>

          {/* Private Posts */}
          <h3 className="section-title">🔒 My Private Posts</h3>
          {privatePosts.length === 0 && (
            <p className="empty-text">No private entries yet.</p>
          )}

          {privatePosts.map((post) => (
            <div key={post.id} className="journal-post glass-card">
              <div className="header">
                <strong>{post.username}</strong>
                <small>
                  {post.timestamp?.toDate
                    ? post.timestamp.toDate().toLocaleString()
                    : "Just now"}
                </small>
              </div>
              <p>{post.content}</p>

              <div className="post-footer">
                <span className="visibility-tag private">Private</span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(post.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ RIGHT PANEL (Public Posts) */}
        <div className="journal-right scroll-area">
          <h3 className="section-title">🌍 Public Community Feed</h3>

          {publicPosts.length === 0 && (
            <p className="empty-text">No public posts yet.</p>
          )}

          {publicPosts.map((post) => (
            <div key={post.id} className="journal-post glass-card">
              <div className="header">
                <strong>{post.username}</strong>
                <small>
                  {post.timestamp?.toDate
                    ? post.timestamp.toDate().toLocaleString()
                    : "Just now"}
                </small>
              </div>

              <p>{post.content}</p>

              <div className="post-footer">
                <span className="visibility-tag public">Public</span>

                {user?.uid === post.uid && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(post.id)}
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Journal;
