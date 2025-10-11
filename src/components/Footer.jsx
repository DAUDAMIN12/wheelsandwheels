import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer footer-animated">
      <div className="footer-container">
        {/* CONTACT US */}
        <div className="footer-section">
          <h2>CONTACT US</h2>
          <p className="brand">WHEELS AND WHEELS</p>

          <p>
            <FaMapMarkerAlt className="icon" />
            Old Tyre Market, Near Rawali Cinema, Aslam Khan Road , Lahore,
            Pakistan.
          </p>
          <p style={{ marginTop: 4, marginLeft: 26 }}></p>

          <p style={{ marginTop: 8 }}>
            <FaPhoneAlt className="icon" />
            Mob: 0321-4229594 - 0339-0045836 WHATSAPP ALSO AVAILABLE
          </p>

          <p>
            <FaEnvelope className="icon" />
            wheelsandwheelsinfo@gmail.com
          </p>

          <p>
            <FaClock className="icon" />
            12:00 PM – 9:00 PM (Mon–Sat), Closed on Sunday
          </p>
        </div>

        {/* ABOUT */}
        <div className="footer-section">
          <h2>ABOUT</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <a href="/#about">About Us</a>
            </li>
            <li>
              <a href="/#services">Services</a>
            </li>
            <li>
              <a href="/#products">Products</a>
            </li>
            <li>
              <a href="/#contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* FOLLOW US */}
        <div className="footer-section">
          <h2 className="followclass">FOLLOW US</h2>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/profile.php?id=61580828295960"
              target="_blank"
              rel="noopener noreferrer"
              className="facebook"
            >
              {" "}
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/wheelsandwheels_/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.threads.net/@wheelsandwheels_"
              target="_blank"
              rel="noopener noreferrer"
              className="threads"
            >
              <FaThreads />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {year} <span>WHEELS AND WHEELS</span> — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
