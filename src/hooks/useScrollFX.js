import { useEffect, useRef } from "react";

/**
 * Direction-aware scroll animations for elements with .reveal
 * Adds/removes: .inview, .enter-down, .enter-up, .exit-down, .exit-up
 */
export default function useScrollFX() {
  const lastY = useRef(window.scrollY);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (els.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("inview", "enter-down"));
      return;
    }

    const getDir = () => (window.scrollY > lastY.current ? "down" : "up");

    const io = new IntersectionObserver(
      (entries) => {
        const dir = getDir();
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add("inview");
            el.classList.remove("exit-up", "exit-down");
            el.classList.add(dir === "down" ? "enter-down" : "enter-up");
            el.classList.remove(dir === "down" ? "enter-up" : "enter-down");
          } else {
            el.classList.remove("inview", "enter-up", "enter-down");
            el.classList.add(dir === "down" ? "exit-down" : "exit-up");
            el.classList.remove(dir === "down" ? "exit-up" : "exit-down");
          }
        });
        lastY.current = window.scrollY;
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => io.observe(el));

    // Reveal anything already in view on first frame
    requestAnimationFrame(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top >= 0 && r.top < window.innerHeight) {
          el.classList.add("inview", "enter-down");
        }
      });
    });

    return () => io.disconnect();
  }, []);
}
