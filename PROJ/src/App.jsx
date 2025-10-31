import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./user/landingpage.jsx";
import Home from "./user/home.jsx";
import Itinerary from "./user/itinerary.jsx";
import ExpenseSplitter from "./user/ExpensesSplitter.jsx";
import Journal from "./user/journal.jsx";
import NoSelectedSplitter from "./listdesti/noselectedsplitter.jsx";
import Profile from "./user/profile.jsx";
import AdminLogin from "./admin/adminlogin.jsx";
import AdminDashboard from "./admin/adminDashboard.jsx";
import UploadPage from "./admin/UploadPage.jsx";
import ForgotPassword from "./admin/forgotpass.jsx";
import NewPassword from "./admin/newpassword.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Guest Route */}
        <Route path="/" element={<LandingPage />} />

        {/* User Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/splitter" element={<ExpenseSplitter />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/splitter/none" element={<NoSelectedSplitter />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/adminDashboard" element={<AdminDashboard />} />

        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/new-password" element={<NewPassword />} />


        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
