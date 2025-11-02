// src/components/Itinerary.jsx
import "./itinerary.css";
import "./landingpage.css";
import PackageModal from "../listdesti/packagemodal.jsx";
import PackageCard from "../listdesti/package.jsx";
import { useState, useMemo, useEffect } from "react";
import Footer from "./footer.jsx";
import Nav from "./nav.jsx";

// Import your local datasets
import luzon from "../package/luzon.js";
import visayas from "../package/visayas.js";
import mindanao from "../package/mindanao.js";

function Itinerary({ initialRegion }) {
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState("");
  const [region, setRegion] = useState("All");
  const [category, setCategory] = useState("All");
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [sortLowHigh, setSortLowHigh] = useState(true);

  // Load combined datasets
  useEffect(() => {
    const combined = [...luzon, ...visayas, ...mindanao].map((pkg) => {
      // Compute price from expenses
      const totalCost = Object.values(pkg.expenses || {}).reduce(
        (a, b) => a + b,
        0
      );

      // Auto-assign categories based on destination keywords
      const dest = pkg?.destination?.toLowerCase() || "";
let category = "Others";

if (["beach", "island", "boracay", "palawan", "siargao", "camiguin"].some(w => dest.includes(w))) {
  category = "Beach";
} else if (["mountain", "bukidnon", "sagada"].some(w => dest.includes(w))) {
  category = "Mountain";
} else if (["city", "manila", "davao", "cebu"].some(w => dest.includes(w))) {
  category = "City";
} else if (["adventure", "zipline", "dahilayan", "waterfall"].some(w => dest.includes(w))) {
  category = "Adventure";
} else if (["forest", "lake", "river", "park"].some(w => dest.includes(w))) {
  category = "Nature";
}

return {
  ...pkg,
  price: totalCost,
  category,
};

    });

    setPackages(combined);
  }, []);

  // Handle region selection from URL or props
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regionQuery = params.get("region");
    setRegion(initialRegion || regionQuery || "All");
  }, [initialRegion]);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    return packages
      .filter((pkg) => {
        if (region !== "All" && pkg.region !== region) return false;
        if (category !== "All" && pkg.category !== category) return false;
        if (search && !pkg.destination.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (budget && pkg.price > Number(budget)) return false;
        return true;
      })
      .sort((a, b) => (sortLowHigh ? a.price - b.price : 0));
  }, [packages, region, category, search, budget, sortLowHigh]);

  const categoriesUI = ["All", "Beach", "Mountain", "City", "Adventure", "Nature", "Others"];
  const regionUI = ["All", "Luzon", "Visayas", "Mindanao"];

  return (
    <>
      <Nav />
      <div className="itinerary-container">
        <img src="/landing.jpg" className="IMAHE" alt="background" />

        <div className="overlay">
          <h1 className="itinerary-title">The Roadmap To Your Trip</h1>

          <div className="searchbar-container">
            <input
              type="text"
              placeholder="Search destination..."
              className="search-bar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              type="number"
              placeholder="Max budget (₱)"
              className="search-bar"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min="100"
              step="100"
            />

            <select
              className="search-bar"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {regionUI.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <button
              className="search-bar"
              onClick={() => setSortLowHigh((s) => !s)}
            >
              Sort: {sortLowHigh ? "Low → High" : "None"}
            </button>
          </div>
        </div>
      </div>

      <div className="category-buttons">
        {categoriesUI.map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="package-list">
        {filtered.length > 0 ? (
          filtered.map((pkg) => (
            <PackageCard
              key={pkg.id}
              image={pkg.spotImages?.[0] || "/images/default.jpg"}
              title={pkg.packageName}
              subtitle={`${pkg.duration} • ₱${pkg.price}`}
              location={pkg.destination}
              onClick={() => setSelectedPackage(pkg)}
            />
          ))
        ) : (
          <p className="no-results">No packages found within your filters.</p>
        )}
      </div>

      {selectedPackage && (
        <PackageModal
          pkg={{ ...selectedPackage, totalCost: selectedPackage.price }}
          userLocation={""}
          onClose={() => setSelectedPackage(null)}
        />
      )}
      <Footer />
    </>
  );
}

export default Itinerary;
