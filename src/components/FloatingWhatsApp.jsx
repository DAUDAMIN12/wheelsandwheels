import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  const whatsappLink =
    "https://wa.me/923390045836?text=Hi%20Wheels%20%26%20Wheels%2C%20I%20need%20help%20with%20tyres%2C%20rims%20or%20current%20rates.";

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Chat with Wheels and Wheels on official WhatsApp 0339 0045836"
      title="Official WhatsApp: 0339 0045836"
    >
      <FaWhatsapp className="whatsapp-icon" />
      <span>WhatsApp</span>
    </a>
  );
}
