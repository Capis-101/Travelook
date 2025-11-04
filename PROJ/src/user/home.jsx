import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseconfig.js";

import Nav from "./nav.jsx";
import Footer from "./footer.jsx";
import PackageModal from "../listdesti/packagemodal.jsx"; 
import luzon from "../package/luzon.js";
import visayas from "../package/visayas.js";
import mindanao from "../package/mindanao.js"; 
import "./home.css";

function Home() {
  const [publicPosts, setPublicPosts] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null); // modal state
  const [userLocation, setUserLocation] = useState("Bulacan"); // example location

  const images =[
        "/visayas/spots/Balicasag.jpg",
        "/visayas/spots/Chocolate Hills.jpg",
        "/visayas/spots/Cambugahay Falls.jpg",
        "/mindanao/spots/White Island.jpg",
        "/mindanao/spots/Kaamulan Grounds.jpg"
    ];

        const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        }, 4000); // change every 4 seconds
        return () => clearInterval(interval);
    }, []);

  useEffect(() => {
    const q = query(
      collection(db, "journalPosts"),
      orderBy("timestamp", "desc"),
      limit(4)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const all = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPublicPosts(all.filter((p) => p.isPublic));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="landing-home">
      <Nav />

      {/* ==== WELCOME ==== */}
      <div className="home-welcome">
        <img src={images[currentImage]} alt="Travel" className="fade-image" />
        <div className="home-landingTXT">
          <h1>Your Trip. Your Story. Your Way.</h1>
          <p>Plan freely, travel smartly, and share your adventures beautifully.</p>
        </div>
      </div>

      {/* ==== POPULAR PACKAGES ==== */}
      <section className="home-section">
  <h4>Popular Packages</h4>
  <div className="package-row">
    {[...luzon, ...visayas, ...mindanao]
      .sort(() => Math.random() - 0.5) // shuffle the array
      .slice(0, 4) // get 4 random items
      .map((pkg) => (
        <div
          className="package-box"
          key={pkg.id}
          onClick={() => setSelectedPackage(pkg)} // open modal
          style={{ cursor: "pointer" }}
        >
          <img
            src={pkg.spotImages?.[0] || pkg.accommodationImage || "/images/default.jpg"}
            alt={pkg.packageName}
          />
          <p>{pkg.packageName}</p>
          <p>{pkg.duration}</p>
        </div>
      ))}
  </div>

  {/* Render Package Modal */}
  {selectedPackage && (
    <PackageModal
      pkg={selectedPackage}
      userLocation={userLocation}
      onClose={() => setSelectedPackage(null)}
    />
  )}


        {/* ==== WHY LOVE TRAVELQOK ==== */}
        <section className="why-love-101">
          <div className="why-header">
            <h2>Why Travelers Love TravelQok</h2>
            <p>
              Because travel planning shouldn’t be stressful — with TravelQok,
              everything feels effortless, organized, and personal.
            </p>
          </div>

          <div className="why-row">
            <div className="why-item">
                        <img src="/destination.png" alt="All in One" />
                        <h3>All-in-One Experience</h3>
                        <p>Plan, budget, and journal without switching between apps.</p>
                    </div>

                    <div className="why-item">
                        <img src="/cash-flow.png" alt="Smart and Simple" />
                        <h3>Smart and Simple</h3>
                        <p>Intuitive design that makes planning a joy, not a task!</p>
                    </div>

                    <div className="why-item">
                        <img src="/agendas.png" alt="Made for Travelers" />
                        <h3>Made for Travelers</h3>
                        <p>Built by travelers who understand what real adventures need.</p>
                    </div>
          </div>
        </section>
      </section>
      
      {/* ==== PUBLIC JOURNALS PREVIEW ==== */}
      <section className="traveler-journals">
        <h2>Traveler Journals</h2>
        <p className="sub-text">Real stories from explorers like you.</p>

        <div className="journal-grid">
          {publicPosts.length === 0 ? (
            <p>No public posts yet.</p>
          ) : (
            publicPosts.map((post) => (
              <div key={post.id} className="journal-card">
                <div className="content">
                  <h3>{post.username || "Traveler"}</h3>
                  <p className="journal-text">
                    {post.content.length > 100
                      ? post.content.slice(0, 100) + "..."
                      : post.content}
                  </p>
                  <small>
                    {post.timestamp?.toDate
                      ? post.timestamp.toDate().toLocaleString()
                      : "Just now"}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>

        <a href="/journal" className="view-all-btn">
          View All Journals
        </a>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
