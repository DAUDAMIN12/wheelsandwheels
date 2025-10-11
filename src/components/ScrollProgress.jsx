import React, { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef(null);
  const navRef = useRef(null);
  const toTopRef = useRef(null);

  useEffect(() => {
    navRef.current = document.querySelector("nav");
    toTopRef.current = document.querySelector(".to-top");

    const onScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      if (barRef.current) barRef.current.style.width = `${pct}%`;

      if (navRef.current) {
        if (window.scrollY > 10) navRef.current.classList.add("is-scrolled");
        else navRef.current.classList.remove("is-scrolled");
      }
      if (toTopRef.current) {
        if (window.scrollY > 400) toTopRef.current.classList.add("is-visible");
        else toTopRef.current.classList.remove("is-visible");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__bar" ref={barRef}></div>
    </div>
  );
}
