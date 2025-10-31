    import "./authmodal.css";

    function EmailSentModal({ onClose, onBack }) {
    return (
        <div className="emailsent-overlay" onClick={onClose}>
  <div className="emailsent-box" onClick={(e) => e.stopPropagation()}>
    
    <button className="emailsent-close" onClick={onClose}>×</button>

    <div className="emailsent-icon">✅</div>

    <h2 className="emailsent-title">Email Sent!</h2>

    <p className="emailsent-message">
      Check your inbox for a reset link 👍
    </p>

    <button className="emailsent-btn" onClick={onBack}>
      Return to Login
    </button>

  </div>
</div>
    );
    }

    export default EmailSentModal;
