import React, { useEffect, useRef } from "react";
import { FaWhatsapp, FaInstagram, FaPhoneAlt, FaTimes } from "react-icons/fa";

const PK_WHATSAPP = "923390045836";
const INSTAGRAM_URL = "https://instagram.com/wheelsandwheels_";
const CALL_NUMBERS = [
  { href: "+923214229594", label: "0321 4229594" },
  { href: "+923390045836", label: "0339 0045836" },
];

export default function ContactModal({ isOpen, onClose, productTitle }) {
  const firstBtnRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Autofocus primary action
  useEffect(() => {
    if (isOpen && firstBtnRef.current) firstBtnRef.current.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const text = encodeURIComponent(
    `Hi! I'm interested in "${productTitle}". Can you share price & availability?`
  );
  const waLink = `https://wa.me/${PK_WHATSAPP}?text=${text}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Contact options"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        <h3 className="modal-title">Contact Us</h3>
        <p className="modal-sub">
          Product: <strong>{productTitle}</strong>
        </p>

        <div className="modal-actions">
          <a
            ref={firstBtnRef}
            className="btn btn-whatsapp"
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp /> WhatsApp Chat
          </a>

          <a
            className="btn btn-instagram"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram /> Instagram Page
          </a>

          {CALL_NUMBERS.map((number) => (
            <a
              key={number.href}
              className="btn btn-call"
              href={`tel:${number.href}`}
            >
              <FaPhoneAlt /> Call {number.label}
            </a>
          ))}
        </div>

        <p className="modal-help">
          Press <kbd>Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
