import React from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p className="muted">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Go Back Home
      </button>
    </div>
  );
}
