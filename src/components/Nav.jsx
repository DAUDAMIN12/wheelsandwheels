import React, { useEffect, useState } from "react";

export default function Nav({
  sections = [],
  activeId,
  onSelect,
  themeLight,
  setThemeLight,
}) {
  const [open, setOpen] = useState(false);

  // Close menu on Esc and on resize > 768
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 768) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleLink = (id) => {
    onSelect?.(id);
    if (window.innerWidth <= 768) setOpen(false);
  };

  return (
    <nav>
      <div className="nav-container">
        <a
          className="brand"
          href="#home"
          aria-label="Wheels and Wheels - Home"
          onClick={(e) => {
            e.preventDefault();
            handleLink("home");
          }}
        >
          <h1>WHEELS AND WHEELS</h1>
        </a>

        <button
          className="theme-toggle"
          aria-pressed={themeLight ? "true" : "false"}
          title="Toggle theme"
          onClick={() => setThemeLight((v) => !v)}
        >
          {themeLight ? "🌞" : "🌙"}
        </button>

        <button
          className="menu-toggle"
          aria-controls="primary-navigation"
          aria-expanded={open ? "true" : "false"}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <ul
          id="primary-navigation"
          className={`nav-links ${open ? "open" : ""}`}
          role="menubar"
        >
          {sections.map((id) => (
            <li role="none" key={id}>
              <a
                role="menuitem"
                href={`#${id}`}
                className={activeId === id ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  handleLink(id);
                }}
              >
                {id[0].toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
