import React, { useRef, useState, useEffect } from "react";
import Ripple from "./Ripple.jsx";

// No API calls—pure mailto flow
const TO_EMAIL = "wheelsandwheelsinfo@gmail.com";

export default function Contact() {
  const [status, setStatus] = useState({ help: "", ok: false, sending: false });
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const msgRef = useRef(null);

  // simple email check
  const isEmail = (v) => /\S+@\S+\.\S+/.test(v || "");

  // optional: abort pattern kept to mirror your original structure
  useEffect(() => {
    const ac = new AbortController();
    return () => ac.abort();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const name = nameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const message = msgRef.current?.value.trim();

    if (!name || !isEmail(email) || !message) {
      setStatus({
        help: "Please complete all fields with a valid email.",
        ok: false,
        sending: false,
      });
      return;
    }

    setStatus({ help: "", ok: false, sending: true });

    // Build a mailto link with subject + body
    const subject = `Website enquiry from ${name}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
      "",
      `Sent from: ${typeof window !== "undefined" ? window.location.href : ""}`,
      `Timestamp: ${new Date().toLocaleString()}`,
    ];
    const body = bodyLines.join("\n");

    const mailto = `mailto:${encodeURIComponent(
      TO_EMAIL,
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the user's mail client
    // Using setTimeout to allow button UI to flip to "Sent!" briefly
    try {
      window.location.href = mailto;
      setStatus({
        help: "Opening your email app…",
        ok: true,
        sending: false,
      });
      // Optional: clear fields after a moment
      setTimeout(() => {
        if (nameRef.current) nameRef.current.value = "";
        if (emailRef.current) emailRef.current.value = "";
        if (msgRef.current) msgRef.current.value = "";
      }, 400);
    } catch {
      setStatus({
        help: "Could not open your email app. Please email us directly.",
        ok: false,
        sending: false,
      });
    }
  };

  return (
    <section id="contact">
      <h2 className="reveal">Contact Us</h2>
      <form
        noValidate
        className="reveal"
        aria-describedby="formHelp"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          autoComplete="name"
          required
          ref={nameRef}
          disabled={status.sending}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          autoComplete="email"
          required
          ref={emailRef}
          disabled={status.sending}
        />
        <textarea
          name="message"
          rows="5"
          placeholder="Your Message"
          required
          ref={msgRef}
          disabled={status.sending}
        />
        <p
          id="formHelp"
          className="form-help"
          aria-live="polite"
          style={{
            color: status.ok
              ? "var(--muted)"
              : status.help
                ? "#ff7b7b"
                : undefined,
          }}
        >
          {status.help}
        </p>
        <Ripple
          as="button"
          type="submit"
          className="btn btn-primary"
          disabled={status.sending}
        >
          {status.sending
            ? "Preparing…"
            : status.ok
              ? "Opening Mail…"
              : "Send Message"}
        </Ripple>

        {/* Fallback direct email link */}
      </form>
    </section>
  );
}
