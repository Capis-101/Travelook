import { useNavigate } from "react-router-dom";
import Nav from "../user/nav.jsx";
import "./noselectedsplitter.css";
import Footer from "../user/footer.jsx";

function NoSelectedSplitter() {
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <div className="no-splitter-container">
        <h1 className="no-splitter-message">
          No Travel Package Selected
        </h1>
        <p className="no-splitter-subtext">
          Please select a travel package from the <strong>Itinerary</strong> page before using the Expense Splitter.
        </p>
        <button className="back-button" onClick={() => navigate("/itinerary")}>
          Go to Itinerary <span><img src="destination.png" className="icons" alt="" /></span>
        </button>
      </div>
      <Footer/>
    </>
  );
}

export default NoSelectedSplitter;
