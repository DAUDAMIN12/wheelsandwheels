import React from "react";

export default function LoadingPage({ text = "Loading..." }) {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner" />
      <p className="loading-text">{text}</p>
    </div>
  );
}
