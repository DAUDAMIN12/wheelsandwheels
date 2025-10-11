// Single source of truth for services
export const SERVICES = [
  {
    slug: "tyre-installation",
    icon: "⚙️",
    title: "Tyre Installation",
    tagline: "Precision mounting for a safer, smoother drive.",
    summary:
      "Professional tyre fitting done to manufacturer torque specs with TPMS handling and a final safety check.",
    bullets: [
      "Remove old tyres, inspect wheels and hub faces",
      "Mount new tyres with lubricant to protect bead",
      "Install new valve/TPMS service kit (if required)",
      "Torque wheel nuts to OEM specification",
      "Initial balance + road test verification",
    ],
    extras: [
      "Run-flat & low-profile expertise",
      "Rim-safe equipment for premium alloys",
      "Disposal of old tyres (on request)",
    ],
    bestFor: ["New tyre sets", "Seasonal changeovers", "Damaged/aged tyres"],
    time: "45–90 minutes (set of 4, depending on size/TPMS)",
    pricing:
      "Pricing varies by size, TPMS, and vehicle type. Contact us for an exact quote.",
    heroImg: "/tyreinstallation.jpg",
  },
  {
    slug: "wheel-balancing",
    icon: "🛞",
    title: "Wheel Balancing",
    tagline: "Eliminate vibration. Protect suspension. Enjoy a quiet ride.",
    summary:
      "Computerized dynamic balancing to correct uneven weight distribution and reduce steering shake.",
    bullets: [
      "Measure imbalance on a calibrated balancer",
      "Apply adhesive or clip-on weights as required",
      "Re-measure until within tolerance",
      "Document before/after readings on request",
    ],
    extras: [
      "Road-force measurement (where applicable)",
      "Low-profile and performance wheel know-how",
      "Premium, residue-free adhesive weights",
    ],
    bestFor: [
      "Steering wheel vibration",
      "Uneven tyre wear",
      "Highway humming at certain speeds",
    ],
    time: "15–25 minutes per wheel",
    pricing:
      "Charged per wheel; combo pricing available with Installation/Alignment.",
    heroImg: "/wheelbalancing.jpg",
  },
  {
    slug: "wheel-alignment",
    icon: "📐",
    title: "Wheel Alignment",
    tagline: "Accurate geometry for tread life, handling, and safety.",
    summary:
      "3D alignment to set camber, caster, and toe within spec, improving stability and tyre life.",
    bullets: [
      "Full suspension & steering inspection",
      "3D geometry measurement (camber/caster/toe)",
      "Adjust to factory specifications",
      "Center steering wheel & test drive",
    ],
    extras: [
      "Custom specs for performance setups (on request)",
      "Pre-alignment tyre pressure/condition check",
      "Before/after printout available",
    ],
    bestFor: [
      "Uneven/rapid tyre wear",
      "Pulling or off-center steering",
      "After suspension or tyre changes",
    ],
    time: "45–75 minutes (vehicle dependent)",
    pricing:
      "Price depends on vehicle and adjustment complexity. Ask us for a tailored quote.",
    heroImg: "/wheelalignment.jpeg",
  },
];
