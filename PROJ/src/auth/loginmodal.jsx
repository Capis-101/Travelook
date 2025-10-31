import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseconfig";
import "./authmodal.css";
import {useNavigate} from "react-router-dom";
import Loader from "../user/loader";

function LoginModal({ onClose, onSwitch, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose(); // close modal after successful login
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {loading ? (
        <Loader />
      ) : (
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>

        {/* LEFT IMAGE */}
        <div className="auth-modal-image"></div>

        {/* RIGHT FORM */}
        <div className="auth-modal-form">
          <button className="close-btn" onClick={onClose}>×</button>

          

          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="forgot-pass" onClick={onForgot}>Forgot password?</p>
            <button type="submit" className="submit-log">
              Login
            </button>
          </form>

          

          <p className="switch-text">
            Don’t have an account?{" "}
            <span className="link" onClick={onSwitch}>Sign up</span>
          </p>
        </div>
        
      </div>
      )}
    </div>
  );
}

export default LoginModal;
