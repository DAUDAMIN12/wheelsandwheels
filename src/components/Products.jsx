import React from "react";
import Ripple from "./Ripple.jsx";
import { useNavigate } from "react-router-dom";

const items = [
  {
    img: "/tyre.jpg",
    alt: "Tyre",
    title: "Premium Tyres",
    desc: "High-performance tyres for all vehicles.",
    category: "Tyres",
  },
  {
    img: "/rim.jpg",
    alt: "rims",
    title: "Stylish Rims",
    desc: "Durable and stylish rims to enhance your car.",
    category: "Rims",
  },
  {
    img: "/wheel.jpg",
    alt: "Alloy Wheels",
    title: "Wheels",
    desc: "Quality wheels that drive your passion forward.",
    category: "Alloy Wheels",
  },
];

export default function Products() {
  const navigate = useNavigate();

  return (
    <section id="products">
      <h2 className="reveal">Our Products</h2>
      <div className="products">
        {items.map((it) => (
          <div key={it.title} className="card tilt reveal">
            <img src={it.img} alt={it.alt} loading="lazy" />
            <h3>{it.title}</h3>
            <p>{it.desc}</p>

            <Ripple
              as="button"
              onClick={() =>
                navigate(
                  `/products?category=${encodeURIComponent(it.category)}`
                )
              }
              className="btn btn-ghost"
              data-ripple="true"
            >
              Explore More
            </Ripple>
          </div>
        ))}
      </div>
    </section>
  );
}
