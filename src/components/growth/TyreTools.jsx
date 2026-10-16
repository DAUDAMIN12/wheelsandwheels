import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalculator,
  FaCalendarAlt,
  FaCheck,
  FaChevronRight,
  FaExclamationTriangle,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import SeoHead from "./SeoHead.jsx";

const WHATSAPP = "923390045836";
const MILLIMETRES_PER_INCH = 25.4;

const TOOL_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Tyre tools", path: "/tools" },
];

const SIZE_CALCULATOR_FAQ = [
  {
    question: "Can a tyre-size calculator approve an alternate size?",
    answer:
      "No. It compares nominal dimensions only. Wheel width, offset, load index, speed rating, steering and suspension clearance, vehicle systems and manufacturer guidance still need to be checked.",
  },
  {
    question: "Why can actual tyre dimensions differ from the calculation?",
    answer:
      "The calculation uses the nominal size code. Actual section width and overall diameter can vary by tyre model, approved wheel width, pressure and manufacturing specification.",
  },
  {
    question: "Does a small diameter difference guarantee fitment?",
    answer:
      "No. A close diameter is only one screening result. A tyre can still be unsuitable because of wheel, clearance, load, speed or vehicle requirements.",
  },
];

const DATE_CODE_FAQ = [
  {
    question: "What do the four tyre date-code digits mean?",
    answer:
      "For the modern four-digit format, the first two digits identify the production week and the last two identify the year. The complete identification may appear on only one sidewall.",
  },
  {
    question: "Does a date code prove that a tyre is safe?",
    answer:
      "No. Age is only one part of an inspection. Storage, use, pressure history, repairs, cracks, bulges, deformation and manufacturer guidance also matter.",
  },
  {
    question: "Can I rely on a three-digit code?",
    answer:
      "Three-digit production-date formats predate the modern four-digit format and can be ambiguous. Ask a qualified tyre professional to inspect and identify the tyre.",
  },
];

function calculateSize({ width, profile, rim }) {
  const numericWidth = Number(width);
  const numericProfile = Number(profile);
  const numericRim = Number(rim);
  if (
    !Number.isFinite(numericWidth) ||
    !Number.isFinite(numericProfile) ||
    !Number.isFinite(numericRim) ||
    numericWidth < 80 ||
    numericWidth > 500 ||
    numericProfile < 15 ||
    numericProfile > 100 ||
    numericRim < 8 ||
    numericRim > 30
  ) {
    return null;
  }
  const sidewall = numericWidth * (numericProfile / 100);
  const diameter = numericRim * MILLIMETRES_PER_INCH + sidewall * 2;
  return {
    width: numericWidth,
    profile: numericProfile,
    rim: numericRim,
    sidewall,
    diameter,
    circumference: diameter * Math.PI,
  };
}
function SizeFields({ legend, value, onChange }) {
  const update = (field) => (event) => {
    onChange({ ...value, [field]: event.target.value.replace(/[^0-9]/g, "") });
  };
  return (
    <fieldset className="tool-size-fields">
      <legend>{legend}</legend>
      <label>
        <span>Width (mm)</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength="3"
          value={value.width}
          onChange={update("width")}
          aria-label={`${legend} tyre width in millimetres`}
        />
      </label>
      <span className="tool-size-divider" aria-hidden="true">/</span>
      <label>
        <span>Profile</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength="2"
          value={value.profile}
          onChange={update("profile")}
          aria-label={`${legend} tyre aspect ratio`}
        />
      </label>
      <span className="tool-size-divider" aria-hidden="true">R</span>
      <label>
        <span>Rim (inch)</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength="2"
          value={value.rim}
          onChange={update("rim")}
          aria-label={`${legend} rim diameter in inches`}
        />
      </label>
    </fieldset>
  );
}

function Breadcrumbs({ current }) {
  return (
    <nav className="growth-breadcrumbs breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tools">Tyre tools</Link></li>
        {current && <li><span aria-current="page">{current}</span></li>}
      </ol>
    </nav>
  );
}

function ToolContact({ subject }) {
  const message = `Hi Wheels & Wheels, I used your ${subject} and need the fitment checked. My vehicle and current tyre details are: `;
  return (
    <aside className="growth-lead-banner tool-lead-banner" aria-labelledby="tool-contact-title">
      <div>
        <p className="eyebrow">VERIFY THE PHYSICAL VEHICLE</p>
        <h2 id="tool-contact-title">Let our Lahore team check the complete requirement.</h2>
        <p>Send the vehicle, model year, variant, sidewall photo and wheel details for a current fitment and rate check.</p>
      </div>
      <div className="growth-actions">
        <a
          className="primary"
          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer"
        >
          <FaWhatsapp aria-hidden="true" /> WhatsApp 0339 0045836
        </a>
        <a className="growth-call-button" href="tel:+923214229594">
          <FaPhoneAlt aria-hidden="true" /> Call 0321 4229594
        </a>
      </div>
    </aside>
  );
}

function ToolFaq({ items }) {
  return (
    <section className="growth-faq section" aria-labelledby="tool-faq-title">
      <p className="eyebrow">IMPORTANT LIMITS</p>
      <h2 id="tool-faq-title">Questions about this tool</h2>
      <div className="growth-faq-list">
        {items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ToolsHub() {
  const tools = [
    {
      path: "/tools/tyre-size-calculator",
      icon: FaCalculator,
      eyebrow: "COMPARE TWO SIZES",
      title: "Tyre size calculator",
      description:
        "Compare nominal sidewall, overall diameter, circumference and indicated-speed change before asking for a physical fitment check.",
    },
    {
      path: "/tools/tyre-date-code-checker",
      icon: FaCalendarAlt,
      eyebrow: "READ FOUR DIGITS",
      title: "Tyre date-code checker",
      description:
        "Translate a modern four-digit production-week code and learn why age never replaces a complete tyre inspection.",
    },
  ];
  const faq = [
    {
      question: "Do these tools confirm that a tyre is suitable?",
      answer:
        "No. They explain nominal dimensions and date markings. Final fitment and condition require the vehicle specification and a physical inspection.",
    },
    {
      question: "Can I ask Wheels & Wheels to check my result?",
      answer:
        "Yes. Send the result with your vehicle, model year, variant and clear sidewall or placard photos by the official WhatsApp or quotation form.",
    },
  ];
  return (
    <main className="growth-page tools-page">
      <SeoHead
        title="Free Tyre Tools for Pakistan"
        description="Use the Wheels & Wheels tyre size calculator and date-code checker, then request professional fitment and condition guidance in Lahore."
        canonical="/tools"
        breadcrumbs={TOOL_BREADCRUMBS}
        faq={faq}
      />
      <nav className="growth-breadcrumbs breadcrumbs" aria-label="Breadcrumb">
        <ol><li><Link to="/">Home</Link></li><li><span aria-current="page">Tyre tools</span></li></ol>
      </nav>
      <header className="growth-hero tools-hero">
        <div className="growth-hero-copy">
          <p className="eyebrow">FREE TYRE TOOLS</p>
          <h1>Useful calculations. Human fitment checks.</h1>
          <p className="growth-lede">
            Use these tools to understand a tyre code and prepare a better enquiry. They do not approve an alternate size or judge a tyre's physical condition.
          </p>
        </div>
      </header>
      <section className="section tool-card-grid" aria-labelledby="tools-list-title">
        <div className="section-heading">
          <div><p className="eyebrow">CHOOSE A TOOL</p><h2 id="tools-list-title">Start with the question you need answered.</h2></div>
        </div>
        <div className="tool-cards">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link className="tool-card" to={tool.path} key={tool.path}>
                <Icon aria-hidden="true" />
                <small>{tool.eyebrow}</small>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <strong>Open tool <FaChevronRight aria-hidden="true" /></strong>
              </Link>
            );
          })}
        </div>
      </section>
      <ToolFaq items={faq} />
      <ToolContact subject="tyre tools" />
    </main>
  );
}

export function TyreSizeCalculator() {
  const [current, setCurrent] = useState({ width: "195", profile: "65", rim: "15" });
  const [proposed, setProposed] = useState({ width: "205", profile: "55", rim: "16" });
  const comparison = useMemo(() => {
    const from = calculateSize(current);
    const to = calculateSize(proposed);
    if (!from || !to) return null;
    const difference = ((to.diameter - from.diameter) / from.diameter) * 100;
    const speedAt100 = 100 * (to.diameter / from.diameter);
    return { from, to, difference, speedAt100, change: Math.abs(difference) };
  }, [current, proposed]);
  const resultTone = !comparison
    ? "invalid"
    : comparison.change <= 2
      ? "close"
      : comparison.change <= 3
        ? "caution"
        : "warning";
  const resultHeading = !comparison
    ? "Enter complete numeric sizes"
    : resultTone === "close"
      ? "The nominal diameters are relatively close"
      : resultTone === "caution"
        ? "The nominal diameter change needs careful review"
        : "The nominal diameter change is substantial";
  const breadcrumbs = [...TOOL_BREADCRUMBS, { name: "Tyre size calculator", path: "/tools/tyre-size-calculator" }];
  return (
    <main className="growth-page tyre-tool-page">
      <SeoHead
        title="Tyre Size Calculator for Pakistan"
        description="Compare two tyre sizes by sidewall, overall diameter, circumference and indicated-speed change, with clear fitment limits and Lahore expert support."
        canonical="/tools/tyre-size-calculator"
        breadcrumbs={breadcrumbs}
        faq={SIZE_CALCULATOR_FAQ}
      />
      <Breadcrumbs current="Tyre size calculator" />
      <header className="growth-hero tool-detail-hero">
        <div className="growth-hero-copy">
          <p className="eyebrow">NOMINAL DIMENSION COMPARISON</p>
          <h1>Tyre size calculator for Pakistan.</h1>
          <p className="growth-lede">Compare the numbers first, then verify the wheel, ratings, clearances and exact vehicle before changing size.</p>
        </div>
        <FaCalculator className="tool-hero-icon" aria-hidden="true" />
      </header>
      <section className="section calculator-shell" aria-labelledby="calculator-title">
        <div className="section-heading">
          <div><p className="eyebrow">STEP 1</p><h2 id="calculator-title">Enter the current and proposed tyre sizes.</h2><p>Example: 195/65 R15 means width 195, profile 65 and rim 15.</p></div>
        </div>
        <div className="calculator-input-grid">
          <SizeFields legend="Current size" value={current} onChange={setCurrent} />
          <SizeFields legend="Proposed size" value={proposed} onChange={setProposed} />
        </div>
        <div className={`calculator-result calculator-result-${resultTone}`} aria-live="polite">
          <div className="calculator-result-heading">
            {resultTone === "close" ? <FaCheck aria-hidden="true" /> : <FaExclamationTriangle aria-hidden="true" />}
            <div><small>CALCULATED RESULT</small><h3>{resultHeading}</h3></div>
          </div>
          {comparison && (
            <>
              <div className="calculator-metrics">
                <article><span>Diameter change</span><strong>{comparison.difference > 0 ? "+" : ""}{comparison.difference.toFixed(2)}%</strong></article>
                <article><span>Current diameter</span><strong>{comparison.from.diameter.toFixed(1)} mm</strong></article>
                <article><span>Proposed diameter</span><strong>{comparison.to.diameter.toFixed(1)} mm</strong></article>
                <article><span>At indicated 100 km/h</span><strong>About {comparison.speedAt100.toFixed(1)} km/h</strong></article>
                <article><span>Sidewall change</span><strong>{comparison.to.sidewall - comparison.from.sidewall > 0 ? "+" : ""}{(comparison.to.sidewall - comparison.from.sidewall).toFixed(1)} mm</strong></article>
                <article><span>Circumference change</span><strong>{comparison.to.circumference - comparison.from.circumference > 0 ? "+" : ""}{(comparison.to.circumference - comparison.from.circumference).toFixed(1)} mm</strong></article>
              </div>
              <p className="calculator-disclaimer"><strong>This is not fitment approval.</strong> A small percentage does not confirm wheel width, offset, brake clearance, suspension and body clearance, load index, speed symbol, TPMS/ABS behaviour or manufacturer permission.</p>
            </>
          )}
        </div>
      </section>
      <section className="section tool-explainer" aria-labelledby="calculator-method-title">
        <p className="eyebrow">HOW IT WORKS</p>
        <h2 id="calculator-method-title">What this comparison calculates</h2>
        <div className="tool-explainer-grid">
          <article><h3>Sidewall height</h3><p>Nominal width multiplied by the aspect-ratio percentage.</p></article>
          <article><h3>Overall diameter</h3><p>Rim diameter in millimetres plus two nominal sidewalls.</p></article>
          <article><h3>Indicated-speed effect</h3><p>A mathematical estimate from the ratio of the two nominal circumferences.</p></article>
        </div>
        <p className="fitment-note"><FaExclamationTriangle aria-hidden="true" /> Actual tyre dimensions differ by pattern and approved wheel. Always use the vehicle placard, owner manual and professional clearance check.</p>
      </section>
      <ToolFaq items={SIZE_CALCULATOR_FAQ} />
      <ToolContact subject="tyre size calculator" />
    </main>
  );
}

function interpretDateCode(code) {
  if (!/^\d{4}$/.test(code)) return { valid: false, message: "Enter exactly four digits." };
  const week = Number(code.slice(0, 2));
  const shortYear = Number(code.slice(2));
  if (week < 1 || week > 53) return { valid: false, message: "The first two digits must be a production week from 01 to 53." };
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const year = 2000 + shortYear;
  if (year > currentYear) return { valid: false, message: "That year is in the future. Recheck all four digits and the other sidewall." };
  const approximateDate = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  if (year === currentYear && approximateDate.getTime() > now.getTime() + 7 * 24 * 60 * 60 * 1000) {
    return { valid: false, message: "That production week is in the future. Recheck the code." };
  }
  const ageMonths = Math.max(0, Math.floor((now.getTime() - approximateDate.getTime()) / (30.4375 * 24 * 60 * 60 * 1000)));
  return {
    valid: true,
    week,
    year,
    ageYears: Math.floor(ageMonths / 12),
    remainingMonths: ageMonths % 12,
  };
}

export function TyreDateCodeChecker() {
  const [code, setCode] = useState("1824");
  const result = useMemo(() => interpretDateCode(code), [code]);
  const breadcrumbs = [...TOOL_BREADCRUMBS, { name: "Tyre date-code checker", path: "/tools/tyre-date-code-checker" }];
  return (
    <main className="growth-page tyre-tool-page">
      <SeoHead
        title="Tyre Date Code Checker for Pakistan"
        description="Read a modern four-digit tyre manufacturing date code, understand its week and year, and learn why tyre condition still needs physical inspection."
        canonical="/tools/tyre-date-code-checker"
        breadcrumbs={breadcrumbs}
        faq={DATE_CODE_FAQ}
      />
      <Breadcrumbs current="Tyre date-code checker" />
      <header className="growth-hero tool-detail-hero">
        <div className="growth-hero-copy">
          <p className="eyebrow">PRODUCTION WEEK &amp; YEAR</p>
          <h1>Tyre date-code checker.</h1>
          <p className="growth-lede">Translate the modern four-digit format, then inspect the exact tyre instead of treating age as the only condition test.</p>
        </div>
        <FaCalendarAlt className="tool-hero-icon" aria-hidden="true" />
      </header>
      <section className="section date-checker-shell" aria-labelledby="date-checker-title">
        <div className="date-checker-copy">
          <p className="eyebrow">ENTER FOUR DIGITS</p>
          <h2 id="date-checker-title">Example: 1824</h2>
          <p>The first pair is the week and the last pair is the year. The complete code may be moulded on only one sidewall.</p>
          <label className="date-code-input">
            <span>Four-digit code</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength="4"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/[^0-9]/g, ""))}
              aria-describedby="date-code-help"
            />
          </label>
          <small id="date-code-help">Enter the final four digits of the modern production-date marking.</small>
        </div>
        <div className={`date-code-result ${result.valid ? "valid" : "invalid"}`} aria-live="polite">
          {result.valid ? (
            <>
              <small>CODE {code}</small>
              <h3>Week {result.week} of {result.year}</h3>
              <p>Approximate elapsed time: <strong>{result.ageYears} years{result.remainingMonths ? ` and ${result.remainingMonths} months` : ""}</strong>.</p>
              <div className="tool-warning"><FaExclamationTriangle aria-hidden="true" /><span>This result identifies production timing only. It cannot grade storage, internal condition, damage, repair history or suitability for service.</span></div>
            </>
          ) : (
            <><small>CHECK THE MARKING</small><h3>That code cannot be interpreted.</h3><p>{result.message}</p></>
          )}
        </div>
      </section>
      <section className="section tool-explainer" aria-labelledby="date-inspection-title">
        <p className="eyebrow">AGE IS ONE CHECK</p>
        <h2 id="date-inspection-title">Inspect more than the production date.</h2>
        <div className="tool-explainer-grid">
          <article><h3>Physical condition</h3><p>Look for cuts, bulges, cracking, deformation, bead damage and signs of pressure loss.</p></article>
          <article><h3>Known history</h3><p>Storage, heat, loading, inflation, impacts and previous repairs affect a tyre throughout its life.</p></article>
          <article><h3>Maker guidance</h3><p>Follow the exact tyre and vehicle manufacturer's inspection and replacement instructions.</p></article>
        </div>
        <div className="tool-sources">
          <h3>Primary references</h3>
          <ul>
            <li><a href="https://www.nhtsa.gov/vehicle-safety/tires" target="_blank" rel="noreferrer">NHTSA TireWise: buying, maintenance and tyre aging</a></li>
            <li><a href="https://www.continental-tires.com/tire-knowledge/replacing-tires/" target="_blank" rel="noreferrer">Continental: checking tyre age and replacement</a></li>
          </ul>
        </div>
      </section>
      <ToolFaq items={DATE_CODE_FAQ} />
      <ToolContact subject="tyre date-code checker" />
    </main>
  );
}
