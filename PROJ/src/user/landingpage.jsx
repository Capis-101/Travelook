import { useRef, useEffect, useState } from 'react';
import packagelist from '../../public/packagelist.js';
import LoginModal from '../auth/loginmodal.jsx';
import SignupModal from '../auth/signup.jsx';
import ForgotPasswordModal from '../auth/forgotpassword.jsx';
import EmailSentModal from '../auth/emailmodal.jsx'; // ✅ new modal
import './landingpage.css';
import '../listdesti/destinationCard.css'
import { FaSearch } from "react-icons/fa";
import Footer from './footer.jsx';

function LandingPage() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [showEmailSent, setShowEmailSent] = useState(false); // ✅

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


    const onSelect = (dest) => {
        setShowSignup(true);
    }

    const scrollRef = useRef(null);

    const handleNext = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
    const handlePrev = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });

    return (
        <div className="landing">
            <div className="nav-landing">
                <div className="navdiv">
                    <div className="logotxt"><span className="text-travel">Travel</span><FaSearch className="logo-icon" /><span className="text-ok">ok</span></div>
                    <button className="signup-btn" onClick={() => setShowSignup(true)}>
                        Sign Up
                    </button>
                </div>
            </div>

            {/* ✅ LOGIN MODAL */}
            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onSwitch={() => {
                        setShowLogin(false);
                        setShowSignup(true);
                    }}
                    onForgot={() => {
                        setShowLogin(false);
                        setShowForgot(true);
                    }}
                    onLoginSuccess={() => (window.location.href = "/home")}
                />
            )}

            {/* ✅ SIGNUP MODAL */}
            {showSignup && (
                <SignupModal
                    onClose={() => setShowSignup(false)}
                    onSwitch={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                    }}
                    onSignupSuccess={() => window.location.href = "/home"}
                />
            )}

            {/* ✅ FORGOT PASSWORD MODAL */}
            {showForgot && (
                <ForgotPasswordModal
                    onClose={() => setShowForgot(false)}
                    onBack={() => {
                        setShowForgot(false);
                        setShowEmailSent(true); // ✅ open success screen
                    }}
                />
            )}

            {/* ✅ EMAIL SENT MODAL */}
            {showEmailSent && (
                <EmailSentModal
                    onClose={() => setShowEmailSent(false)}
                    onBack={() => {
                        setShowEmailSent(false);
                        setShowLogin(true); // ✅ return to login
                    }}
                />
            )}

            {/* ==== WELCOME ==== */}
            <div className="Welcome">
                <img src={images[currentImage]} alt="Travel" className="fade-image" />
                <div className="landingTXT">
                    <h1>"Your Trip. Your Story. Your Way."</h1>
                    <p>Plan freely, travel smartly, and share your adventures beautifully.</p>
                </div>
            </div>

            {/* ==== ABOUT ==== */}
            <div className="about">
                <div className="aboutleft">
                    <h1>About Us</h1>
                    <p>
                        TravelQok is a web-based travel companion designed to make every journey easy, organized,
                        and worry-free. It helps travelers plan their trips efficiently, manage expenses, and
                        document their experiences — all in one platform.
                    </p>

                    <div className="getstartedbtn">
                        <button className="signup-btn" onClick={() => setShowSignup(true)}>
                            Get Started
                        </button>
                    </div>
                </div>

                <div className="aboutright">
                    <div className="cardright">
                        <div className="rightcard itinerary">
                            <h3>ITINERARY</h3>
                            <img src="/planning.png" alt="Itinerary icon" />
                            <p>A guide to where your journey begins.</p>
                        </div>

                        <div className="rightcard journal">
                            <h3>JOURNAL</h3>
                            <img src="/agendas.png" alt="Journal icon" />
                            <p>Keep your journey alive in pages.</p>
                        </div>

                        <div className="rightcard expense">
                            <h3>EXPENSE SPLITTER</h3>
                            <img src="/cash-flow.png" alt="Expense icon" />
                            <p>Travel together, spend smarter.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==== TOP DESTINATIONS ==== */}
            <div className="topdestination">
                <div className="topdestination-header">
                    <h1>Choose your Destination</h1>
                    <p>
                        From island escapes to cool mountain towns, discover where your next journey will take you.
                    </p>
                </div>

                <div className="destination-wrapper">
                    <div className="scroll-container">
                        <div ref={scrollRef} className="destination-list">
                            {packagelist.map((dest, i) => (
                                <div
                                    key={i}
                                    className="destination-card"
                                    onClick={() => onSelect(dest)}
                                >
                                    <img src={`/public/${dest.image}`} alt={dest.name} className="card-image" />
                                    <h2>{dest.name}</h2>
                                    <p>{dest.location}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="button-container">
                        <button className="prev-btn" onClick={handlePrev}>⇦</button>
                        <button className="next-btn" onClick={handleNext}>⇨</button>
                    </div>
                </div>
            </div>

            {/* ===== WHY TRAVELERS LOVE TRAVELQOK ===== */}
            <section className="why-love">
                <div className="why-header">
                    <h2>Why Travelers Love TravelQok</h2>
                    <p>Because travel planning shouldn’t be stressful — with TravelQok, everything feels
                        effortless, organized, and personal.</p>
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

            
            <Footer/>
        </div>
    );
}

export default LandingPage;
