import React, { useRef, useState, useEffect } from "react";
import Ripple from "./Ripple.jsx";

const API_BASE =
  (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) ||
  "http://localhost:3000/api";

export default function Contact() {
  const [status, setStatus] = useState({ help: "", ok: false, sending: false });
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const msgRef = useRef(null);

  // clean up in-flight request if the component unmounts
  useEffect(() => {
    const ac = new AbortController();
    return () => ac.abort();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const name = nameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const message = msgRef.current?.value.trim();

    // simple email check
    const isEmail = (v) => /\S+@\S+\.\S+/.test(v || "");

    if (!name || !isEmail(email) || !message) {
      setStatus({
        help: "Please complete all fields with a valid email.",
        ok: false,
        sending: false,
      });
      return;
    }

    setStatus({ help: "", ok: false, sending: true });

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `HTTP ${res.status}`);
      }

      setStatus({
        help: "Thanks! We’ll get back to you shortly.",
        ok: true,
        sending: false,
      });

      // clear fields
      if (nameRef.current) nameRef.current.value = "";
      if (emailRef.current) emailRef.current.value = "";
      if (msgRef.current) msgRef.current.value = "";
    } catch (err) {
      setStatus({
        help:
          err?.message === "Failed to fetch"
            ? "Network error. Please check your connection."
            : `Could not send message. ${err?.message || ""}`,
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
          {status.sending ? "Sending…" : status.ok ? "Sent!" : "Send Message"}
        </Ripple>
      </form>
    </section>
  );
}
