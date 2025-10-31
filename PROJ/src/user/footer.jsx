import { useState } from "react";
import "./landingpage.css";

function Footer() {
  const [openModal, setOpenModal] = useState(null);

  const handleOpen = (type) => setOpenModal(type);
  const handleClose = () => setOpenModal(null);

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* About Section */}
          <div className="footer-about">
            <h2>TravelQok</h2>
            <p>
              Your trusted travel companion for every journey.
              Plan itineraries, manage expenses, and keep memories
              alive with our Journal feature — all in one platform.
            </p>
          </div>

          {/* Support & Legal Links */}
          <div className="footer-links">
            <h3>Support & Legal</h3>
            <ul>
              <li>
                <button onClick={() => handleOpen("faq")}>FAQs</button>
              </li>
              <li>
                <button onClick={() => handleOpen("terms")}>Terms & Conditions</button>
              </li>
              <li>
                <button onClick={() => handleOpen("journal")}>Travel Journal Info</button>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>
              Email:{" "}
              <a href="mailto:support@travelqok.com">
                support@travelqok.com
              </a>
            </p>
            <p>For questions and feedback about our modules and features.</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TravelQok. All rights reserved.</p>
        </div>
      </footer>

      {/* ======== MODALS ======== */}
      {openModal === "faq" && (
        <FooterModal title="Frequently Asked Questions" onClose={handleClose}>
          <p>
            1. <b>What is Travelook?</b> Travelook is a mobile-based travel companion system
            designed to help users explore destinations, create personalized itineraries,
            and manage their travel experiences conveniently in one platform.
          </p>
          <p>
            2. <b>How does Travelook work?</b> Users can browse destinations, build itineraries,
            and record their experiences through the travel journal. The system also offers smart
            suggestions for easier planning.
          </p>
          <p>
            3. <b>Is Travelook free to use?</b> Yes, Travelook is free to use. All users can access
            main features without any subscription.
          </p>
          <p>
            4. <b>Do I need an account to use Travelook?</b> Yes. Creating an account allows you to
            save itineraries, journals, and sync your data securely across devices.
          </p>
          <p>
            5. <b>Can I edit or delete my itineraries?</b> Absolutely. You can update or remove
            itineraries anytime.
          </p>
          <p>
            6. <b>How does Travelook ensure my data privacy?</b> Your data is securely stored and not
            shared with third parties. We comply with data protection standards.
          </p>
          <p>
            7. <b>What should I do if I forget my password?</b> Reset it via the “Forgot Password?”
            option on the login page.
          </p>
          <p>
            8. <b>Can I access Travelook offline?</b> Some saved itineraries and journals may be
            available offline, but browsing requires internet access.
          </p>
          <p>
            9. <b>How can I contact the Travelook team?</b> You can reach us via
            travelook.team@gmail.com or through our official social media pages.
          </p>
          <p>
            10. <b>Will Travelook add more features?</b> Yes! We continuously update the platform
            for better user experience.
          </p>
        </FooterModal>
      )}

      {openModal === "terms" && (
        <FooterModal title="Terms & Conditions" onClose={handleClose}>
          <h4>Terms and Conditions</h4>
          <p>
            By using Travelook, you agree to use the platform responsibly and only for personal or
            educational purposes. Users are responsible for maintaining account confidentiality and
            must not engage in unlawful activities. All materials within Travelook are protected by
            copyright and must not be copied or altered without permission. The developers reserve
            the right to update or modify the system at any time.
          </p>

          <h4>Privacy Policy</h4>
          <p>
            Travelook values your privacy. We collect minimal personal information such as name and
            email only to improve user experience and functionality. Your data will never be sold or
            shared with third parties, except when required by law. By continuing to use the
            platform, you consent to our Privacy Policy and its updates.
          </p>
        </FooterModal>
      )}

      {openModal === "journal" && (
        <FooterModal title="Travel Journal Info" onClose={handleClose}>
          <p>
            The Travel Journal lets you record memories, add photos, and share reflections from your
            adventures. It’s your personal travel diary right inside the platform.
          </p>
        </FooterModal>
      )}
    </>
  );
}

function FooterModal({ title, children, onClose }) {
  return (
    <div className="footer-modal-overlay" onClick={onClose}>
      <div
        className="footer-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{title}</h2>
        <div className="footer-modal-body">{children}</div>
        <button className="footer-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Footer;
