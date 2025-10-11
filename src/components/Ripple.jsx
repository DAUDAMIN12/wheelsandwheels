import React, { useRef } from "react";
export default function Ripple({
  as = "button",
  children,
  className = "",
  ...rest
}) {
  const ref = useRef(null);

  const onClick = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
    const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;

    const circle = document.createElement("span");
    Object.assign(circle.style, {
      position: "absolute",
      borderRadius: "50%",
      pointerEvents: "none",
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      background: "rgba(255,255,255,.35)",
      transform: "scale(0)",
      opacity: "0.75",
      transition: "transform .5s ease, opacity .6s ease",
    });
    ref.current.appendChild(circle);
    requestAnimationFrame(() => {
      circle.style.transform = "scale(2.4)";
      circle.style.opacity = "0";
    });
    setTimeout(() => circle.remove(), 650);

    // If the consumer passed their own onClick, call it after ripple is created
    if (typeof rest.onClick === "function") {
      rest.onClick(e);
    }
  };

  const Comp = as;
  return (
    <Comp
      {...rest}
      className={className}
      onClick={onClick}
      style={{
        position: "relative",
        overflow: "hidden",
        ...(rest.style || {}),
      }}
      ref={ref}
    >
      {children}
    </Comp>
  );
}
