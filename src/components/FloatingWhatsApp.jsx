import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  // Convert local number 0300-4583856 -> international for WhatsApp: 923004583856 (Pakistan)
  const whatsappLink =
    "https://wa.me/923390045836?text=Hi%20Wheels%20and%20Wheels!%20I%27d%20like%20to%20chat.";

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <FaWhatsapp className="whatsapp-icon" />
    </a>
  );
}
