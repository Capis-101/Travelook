// src/components/UserNav.jsx
import { NavLink } from "react-router-dom";
import "./landingpage.css"
import { FaSearch } from "react-icons/fa";
import "./nav.css";

function UserNav() {
  return (
    <nav className="navigation">
      <div className="logotxt"><span className="text-travel">Travel</span><FaSearch className="logo-icon" /><span className="text-ok">ok</span></div>

      <ul className="nav-links">
        <li>
          <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/itinerary" className={({ isActive }) => (isActive ? "active" : "")}>
            Itinerary
          </NavLink>
        </li>

        <li>
          <NavLink to="/splitter" className={({ isActive }) => (isActive ? "active" : "")}>
            Expense Splitter
          </NavLink>
        </li>

        <li>
          <NavLink to="/journal" className={({ isActive }) => (isActive ? "active" : "")}>
            Journal
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
            Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default UserNav;
