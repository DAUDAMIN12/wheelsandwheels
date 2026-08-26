import { useState } from "react";
import {
  FaCheck,
  FaChevronRight,
  FaClock,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { SERVICES } from "../Data/services.js";

const WHATSAPP = "923390045836";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = SERVICES.find((item) => item.slug === slug);
  const [openFaq, setOpenFaq] = useState(0);
  if (!service)
    return (
      <main className="service-not-found">
        <h1>Service not found</h1>
        <Link to="/#services">View our services</Link>
      </main>
    );
  const booking = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Wheels & Wheels, I would like to book ${service.title}. My vehicle is: `)}`;
  return (
    <main className="service-detail-page">
      <section
        className="service-detail-hero"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(5,6,7,.97),rgba(5,6,7,.45)),url(${service.heroImg})`,
        }}
      >
        <div>
          <Link to="/#services" className="service-back">
            Services / {service.number}
          </Link>
          <div className="eyebrow light">{service.eyebrow}</div>
          <h1>{service.title}</h1>
          <p>{service.tagline}</p>
          <a href={booking} target="_blank" rel="noreferrer">
            <FaWhatsapp /> Book this service <FaChevronRight />
          </a>
        </div>
      </section>
      <section className="service-intro">
        <div>
          <div className="eyebrow">WHAT IT IS</div>
          <h2>A small service with a big effect.</h2>
        </div>
        <p>{service.summary}</p>
      </section>
      <section className="why-service">
        <div className="why-image">
          <img
            src={service.heroImg}
            alt={`${service.title} at Wheels & Wheels`}
          />
          <span>{service.number}</span>
        </div>
        <div className="why-copy">
          <div className="eyebrow">WHY IT MATTERS</div>
          <h2>
            Protect your tyres.
            <br />
            Improve every drive.
          </h2>
          <p>{service.why}</p>
          <div className="benefit-list">
            {service.benefits.map((item) => (
              <span key={item}>
                <FaCheck /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="service-signs">
        <div className="section-heading">
          <div>
            <div className="eyebrow">KNOW THE WARNING SIGNS</div>
            <h2>When should you book?</h2>
          </div>
          <p>{service.recommended}</p>
        </div>
        <div className="sign-grid">
          {service.signs.map((item, index) => (
            <article key={item}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="service-process">
        <div className="process-heading">
          <div className="eyebrow light">OUR WORKSHOP PROCESS</div>
          <h2>
            What happens
            <br />
            when you arrive.
          </h2>
          <p>Clear checks, careful workmanship and no unexplained extras.</p>
          <span>
            <FaClock /> Typical time: {service.time}
          </span>
        </div>
        <div className="process-steps">
          {service.process.map((item, index) => (
            <article key={item}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="service-faq">
        <div>
          <div className="eyebrow">STRAIGHT ANSWERS</div>
          <h2>Frequently asked questions.</h2>
        </div>
        <div>
          {service.faq.map((item, index) => (
            <article className={openFaq === index ? "open" : ""} key={item.q}>
              <button
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                <span>{item.q}</span>
                {openFaq === index ? <FaTimes /> : <b>+</b>}
              </button>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="service-book">
        <div>
          <small>READY FOR A SAFER, SMOOTHER DRIVE?</small>
          <h2>Book {service.title.toLowerCase()}.</h2>
          <p>
            Send your vehicle make, model and preferred time. We will confirm
            availability and pricing.
          </p>
        </div>
        <a href={booking} target="_blank" rel="noreferrer">
          <FaWhatsapp /> Book on WhatsApp
        </a>
      </section>
    </main>
  );
}
