const UPDATED_AT = "2026-10-15";

const source = (title, url, publisher) => ({ title, url, publisher });

const pexelsCredit = (id, photographer = "Pexels contributor") => ({
  photographer,
  sourceUrl: `https://www.pexels.com/photo/${id}/`,
  licenseName: "Pexels License",
  licenseUrl: "https://www.pexels.com/license/",
  modified: true,
});

const article = ({ slug, title, category, topicSlug, image, imageId, photographer, ...rest }) => ({
  slug,
  title,
  seoTitle: `${title} | Wheels & Wheels`,
  category,
  topicSlug,
  publishedAt: UPDATED_AT,
  updatedAt: UPDATED_AT,
  author: { name: "Wheels & Wheels tyre team", url: "/about" },
  image: `/images/guides/${image}.jpg`,
  imageSmall: `/images/guides/${image}-960.jpg`,
  imageAlt: rest.imageAlt,
  imageCaption: rest.imageCaption,
  imageCredit: pexelsCredit(imageId, photographer),
  ...rest,
});

const TIREWISE = source(
  "TireWise: tyre selection, maintenance and safety",
  "https://www.nhtsa.gov/vehicle-safety/tires",
  "U.S. National Highway Traffic Safety Administration",
);
const USTMA_CARE = source(
  "Tire care and safety",
  "https://www.ustires.org/tire-care-safety",
  "U.S. Tire Manufacturers Association",
);
const REPAIR_BASICS = source(
  "Tire repair basics",
  "https://www.ustires.org/tire-care-safety/tire-repair-basics",
  "U.S. Tire Manufacturers Association",
);

export const ADDITIONAL_GUIDES = [
  article({
    slug: "how-to-read-tyre-date-code-pakistan",
    title: "How to Read a Tyre Date Code Before Buying in Pakistan",
    category: "TYRE BUYING",
    topicSlug: "buying-tyres-in-pakistan",
    image: "tyre-date-code",
    imageId: "14667455",
    photographer: "Luke Miller",
    imageAlt: "Close view of a tyre sidewall and alloy wheel",
    imageCaption: "Read the full sidewall identification and inspect the actual tyre; a four-digit date code is only one part of the decision.",
    excerpt: "Find the modern four-digit production code, translate its week and year, and combine age with storage, condition, specification and seller evidence.",
    takeaway: "A date code identifies production timing; it does not by itself prove freshness, authenticity, storage quality or roadworthiness.",
    readMinutes: 7,
    sections: [
      {
        heading: "Find the complete identification marking",
        paragraphs: [
          "Look on both sidewalls because the complete identification may be moulded on only one side. The modern production-date portion normally ends in four digits.",
          "Photograph the whole marking instead of sending only four numbers. The complete size, load index, speed symbol, construction and other sidewall information are still needed for a useful quotation.",
        ],
      },
      {
        heading: "Translate the four digits correctly",
        paragraphs: [
          "The first pair represents the production week and the second pair represents the last two digits of the production year. For example, 2325 describes week 23 of 2025; it is not a day-and-month code.",
          "A code whose week is outside the valid calendar range, is unclear, or appears altered deserves a closer physical check. Use our date-code checker as a translation aid, not a safety certificate.",
        ],
      },
      {
        heading: "Judge the tyre, not one number",
        paragraphs: [
          "Storage, sunlight, heat, pressure history, impacts, repairs and use all affect condition. Follow the tyre and vehicle maker's guidance for inspection and replacement, including the spare.",
          "Before paying, record the exact brand, pattern, size, ratings, date marking, country-of-manufacture marking and written warranty or invoice terms for the tyre actually offered.",
        ],
      },
      {
        heading: "Use a repeatable buying checklist",
        bullets: [
          "Check the full code on every tyre in the set",
          "Inspect tread, sidewalls, bead and inner liner for damage or repairs",
          "Match size, load index and speed rating to the exact vehicle",
          "Confirm whether fitting, valves, balancing and warranty are included",
        ],
      },
    ],
    faqs: [
      { question: "Does a newer date code guarantee a better tyre?", answer: "No. Specification, storage, condition, authenticity, suitability and seller support still need checking." },
      { question: "Why can I not see the full code?", answer: "The complete identification can appear on only one sidewall, so the inner side may need inspection." },
      { question: "Can I check the code online?", answer: "You can translate the four-digit week/year format with our checker, but a physical inspection and manufacturer guidance remain necessary." },
    ],
    relatedLinks: [
      { label: "Use the tyre date-code checker", href: "/tools/tyre-date-code-checker" },
      { label: "Inspect a tyre before buying", href: "/guides/verify-fresh-genuine-tyres-lahore" },
      { label: "When to replace tyres", href: "/guides/when-to-replace-tyres-pakistan" },
    ],
    sources: [TIREWISE, source("Replacing tires", "https://www.continental-tires.com/tire-knowledge/replacing-tires/", "Continental")],
  }),
  article({
    slug: "correct-tyre-pressure-pakistan",
    title: "Correct Tyre Pressure: A Practical Guide for Pakistan Drivers",
    category: "TYRE CARE & SAFETY",
    topicSlug: "tyre-care-and-road-safety",
    image: "tyre-pressure",
    imageId: "32726194",
    imageAlt: "Detailed close-up of a tyre and modern alloy wheel",
    imageCaption: "Use the vehicle's cold-pressure recommendation, not a guess based on tyre appearance or the maximum printed on the sidewall.",
    excerpt: "Learn where to find the vehicle's recommended cold pressure, when to measure it, and what repeated pressure loss can reveal.",
    takeaway: "Set pressure from the vehicle placard or manual when tyres are cold; the sidewall maximum is not the routine target.",
    readMinutes: 7,
    sections: [
      {
        heading: "Start with the vehicle recommendation",
        paragraphs: [
          "Find the tyre-information placard, commonly located around the driver's door opening, or use the owner's manual. Front and rear recommendations can differ, and a loaded vehicle may have separate guidance.",
          "Do not copy a number from another car or use the maximum pressure moulded on the tyre as the everyday target. The vehicle maker specifies the operating pressure for the approved fitment.",
        ],
      },
      {
        heading: "Measure consistently when cold",
        paragraphs: [
          "Use a reliable gauge before driving or after the vehicle has been parked long enough for the tyres to cool. Driving and ambient temperature change the reading.",
          "Check all road tyres and the spare where fitted. Refit valve caps and record readings so gradual loss is easier to notice.",
        ],
      },
      {
        heading: "Investigate repeated loss",
        paragraphs: [
          "A tyre that repeatedly loses pressure may have a puncture, leaking valve, bead-seal problem, wheel damage or another fault. Adding air repeatedly does not diagnose the cause.",
          "If pressure drops suddenly, a warning light appears with handling changes, or the tyre has been driven very low, stop safely and arrange inspection rather than assuming inflation alone solves it.",
        ],
      },
      {
        heading: "Build pressure checks into maintenance",
        bullets: [
          "Check before long trips and carrying unusual loads",
          "Compare wear across inner, centre and outer tread",
          "Recheck after a tyre, valve or wheel has been serviced",
          "Use the placard specification after changing seasons or ambient temperature",
        ],
      },
    ],
    faqs: [
      { question: "Should front and rear tyre pressure be the same?", answer: "Not always. Use the front and rear values printed for the exact vehicle and load condition." },
      { question: "Is the number on the tyre sidewall the correct pressure?", answer: "The sidewall can show a maximum or rating-related value; use the vehicle placard or manual for routine cold pressure." },
      { question: "Why does pressure change after driving?", answer: "Tyres warm during use and pressure changes with temperature, which is why routine checks are compared cold." },
    ],
    relatedLinks: [
      { label: "Tyre replacement checklist", href: "/guides/when-to-replace-tyres-pakistan" },
      { label: "Wheel alignment versus balancing", href: "/guides/wheel-alignment-vs-balancing-lahore" },
      { label: "Tyre installation service", href: "/services/tyre-installation" },
    ],
    sources: [TIREWISE, USTMA_CARE],
  }),
  article({
    slug: "tyre-puncture-repair-guide-pakistan",
    title: "Can This Tyre Puncture Be Repaired? A Safety-First Guide",
    category: "TYRE CARE & SAFETY",
    topicSlug: "tyre-care-and-road-safety",
    image: "puncture-repair",
    imageId: "30547328",
    photographer: "Sam McCool",
    imageAlt: "Close view of a wheel and tyre prepared for professional inspection",
    imageCaption: "A repair decision requires tyre removal and an internal inspection; location, size and run-flat damage matter.",
    excerpt: "Understand why tread-area location, damage size, previous repairs and driving while underinflated determine whether a professional repair is possible.",
    takeaway: "A plug or sealant used from the outside is not a complete inspection; the tyre should be removed and assessed inside and out.",
    readMinutes: 8,
    sections: [
      {
        heading: "Location changes the repair decision",
        paragraphs: [
          "Repair standards generally limit conventional repairs to qualifying punctures in the tread area. Shoulder, sidewall, bead, large, irregular or overlapping damage can make repair unsuitable.",
          "Do not judge location while the tyre is still loaded on the vehicle. Mark the object or leak and let a trained technician inspect the complete path of damage.",
        ],
      },
      {
        heading: "Internal damage can be hidden",
        paragraphs: [
          "A tyre driven while severely underinflated can suffer internal flexing and heat damage that is not visible from the outside. Removal lets the inner liner and structure be inspected.",
          "Sealant and emergency plugs can help reach assistance when their instructions allow, but they should be disclosed before service and should not be treated as automatic permanent repairs.",
        ],
      },
      {
        heading: "A complete repair addresses both paths",
        paragraphs: [
          "Industry guidance describes a repair that fills the injury channel and seals the inner liner. The exact method, limits and post-repair service must follow the tyre maker and recognised repair standard.",
          "After repair, correct pressure, valve condition, wheel balance and the reason for any repeated air loss should be checked before normal use resumes.",
        ],
      },
      {
        heading: "Tell the technician the full history",
        bullets: [
          "How far and how fast the vehicle travelled after pressure loss",
          "Whether sealant or an outside plug was used",
          "Any previous repairs, impacts or wheel damage",
          "The vehicle, load and normal driving use",
        ],
      },
    ],
    faqs: [
      { question: "Can a sidewall puncture be repaired?", answer: "Sidewall or shoulder damage is generally outside the normal repairable tread area and requires professional replacement assessment." },
      { question: "Is an external plug enough?", answer: "Industry repair guidance calls for internal inspection and a repair that seals the liner and fills the injury; an outside-only plug does not do both." },
      { question: "Can run-flat damage be repaired?", answer: "It depends on the exact product, damage and manufacturer policy. Share the driving history and follow the tyre maker's guidance." },
    ],
    relatedLinks: [
      { label: "When to replace tyres", href: "/guides/when-to-replace-tyres-pakistan" },
      { label: "Tyre installation in Lahore", href: "/services/tyre-installation" },
      { label: "Ask for an inspection", href: "/quote" },
    ],
    sources: [REPAIR_BASICS, USTMA_CARE],
  }),
  article({
    slug: "tyre-rotation-guide-pakistan",
    title: "Tyre Rotation Guide: Timing, Patterns and Important Exceptions",
    category: "TYRE CARE & SAFETY",
    topicSlug: "tyre-care-and-road-safety",
    image: "tyre-rotation",
    imageId: "17600886",
    imageAlt: "Mechanic servicing a wheel on a raised vehicle",
    imageCaption: "Rotation patterns depend on drivetrain, tyre type, wheel sizes and manufacturer instructions.",
    excerpt: "Learn what rotation can achieve, why one universal pattern does not fit every car, and what should be inspected during the service.",
    takeaway: "Use the vehicle and tyre maker's interval and pattern; directional tyres, staggered wheels and temporary spares need special handling.",
    readMinutes: 7,
    sections: [
      {
        heading: "Understand what rotation can and cannot do",
        paragraphs: [
          "Rotation changes tyre positions to help manage position-specific wear. It cannot reverse damage, cure alignment or suspension faults, or make mismatched tyres compatible.",
          "Record the odometer and tread measurements so the next decision is based on actual wear rather than memory.",
        ],
      },
      {
        heading: "Choose a pattern for the actual setup",
        paragraphs: [
          "Drivetrain, directional arrows, asymmetric markings, front/rear wheel size and spare compatibility all affect the permitted pattern. Some staggered vehicles cannot rotate front to rear.",
          "Follow the owner's manual and tyre maker instructions. If a tyre must be dismounted from the wheel to change sides, that is a different service from a simple wheel-position swap.",
        ],
      },
      {
        heading: "Inspect while every wheel is accessible",
        paragraphs: [
          "Compare tread depth and wear across each tyre, inspect sidewalls and inner shoulders, verify cold pressures, and look for wheel or valve damage.",
          "Feathering, one-sided wear, cupping, vibration or repeated pressure loss should trigger diagnosis rather than being hidden by rotation.",
        ],
      },
      {
        heading: "Ask these questions before rotation",
        bullets: [
          "Are the tyres directional or asymmetric?",
          "Are front and rear tyre or wheel sizes different?",
          "Does the owner's manual include the full-size spare?",
          "Is current wear even enough for rotation to remain useful?",
        ],
      },
    ],
    faqs: [
      { question: "How often should tyres be rotated?", answer: "Use the interval in the vehicle and tyre maker guidance; driving conditions and observed wear can change service timing." },
      { question: "Can directional tyres switch sides?", answer: "Not as a simple wheel swap if that reverses their marked direction. Follow the exact product instructions." },
      { question: "Will rotation fix uneven wear?", answer: "No. It can redistribute future wear, but the pressure, alignment, wheel, suspension or driving cause still needs diagnosis." },
    ],
    relatedLinks: [
      { label: "Alignment versus balancing", href: "/guides/wheel-alignment-vs-balancing-lahore" },
      { label: "Computerised wheel balancing", href: "/services/wheel-balancing" },
      { label: "Correct tyre pressure", href: "/guides/correct-tyre-pressure-pakistan" },
    ],
    sources: [source("Tire rotation: why and how", "https://www.michelinman.com/auto/auto-tips-and-advice/tire-maintenance/tire-rotation", "Michelin"), TIREWISE],
  }),
  article({
    slug: "tyre-warranty-checklist-pakistan",
    title: "Tyre Warranty in Pakistan: What to Confirm Before You Pay",
    category: "TYRE BUYING",
    topicSlug: "buying-tyres-in-pakistan",
    image: "tyre-warranty",
    imageId: "36556346",
    photographer: "jiale MA",
    imageAlt: "Modern tyre and alloy wheel shown in detail",
    imageCaption: "A useful warranty is written, product-specific and supported by an invoice and traceable seller details.",
    excerpt: "Use a written checklist for coverage, exclusions, claim evidence, adjustment method, authorised seller status and installed-price terms.",
    takeaway: "Do not treat the word warranty as a promise by itself; ask who honours it, what is covered and what evidence a claim requires.",
    readMinutes: 8,
    sections: [
      {
        heading: "Identify who provides the warranty",
        paragraphs: [
          "Ask whether support comes from the manufacturer, importer, distributor or shop and whether the seller is authorised for the exact brand. Record contact details on the invoice.",
          "A verbal statement is difficult to compare. Request the written terms that apply to the exact pattern, size and production source being supplied.",
        ],
      },
      {
        heading: "Read coverage and exclusions together",
        paragraphs: [
          "Manufacturing-defect coverage is different from road-hazard damage, punctures, impacts, incorrect pressure, alignment wear, overloading, racing, commercial use or cosmetic complaints.",
          "Check the time or mileage basis, whether coverage is full or pro-rated, and how usable tread, taxes, fitting and transport are handled during an adjustment.",
        ],
      },
      {
        heading: "Keep evidence from day one",
        paragraphs: [
          "Keep the invoice, tyre serial or identification details, installation date, vehicle odometer and service records. Photograph the sidewall codes and tread when fitted.",
          "Maintain pressure, rotation and alignment records where required. If a concern appears, stop using a visibly damaged tyre and contact the named provider before altering or discarding it.",
        ],
      },
      {
        heading: "Put these details on the quotation",
        bullets: [
          "Exact brand, pattern, size, load index and speed symbol",
          "Quantity, per-tyre rate and installed total",
          "Manufacturing details and invoice/serial traceability",
          "Written provider, duration, exclusions and claim route",
        ],
      },
    ],
    faqs: [
      { question: "Does every puncture qualify for warranty?", answer: "No. Punctures and road hazards are commonly separate from manufacturing-defect coverage; read the exact written terms." },
      { question: "What is a pro-rated adjustment?", answer: "It generally means credit is calculated using remaining service or tread under the provider's formula rather than a free replacement." },
      { question: "Why keep alignment and pressure records?", answer: "They can document maintenance and help distinguish a product concern from operating or vehicle-related wear." },
    ],
    relatedLinks: [
      { label: "Compare tyre quotations", href: "/guides/how-to-compare-tyre-prices-pakistan" },
      { label: "Read a tyre date code", href: "/guides/how-to-read-tyre-date-code-pakistan" },
      { label: "Request a written current quote", href: "/quote" },
    ],
    sources: [TIREWISE, USTMA_CARE],
  }),
  article({
    slug: "used-tyres-buying-risks-pakistan",
    title: "Used Tyres in Pakistan: Inspection Limits and Buying Risks",
    category: "TYRE BUYING",
    topicSlug: "buying-tyres-in-pakistan",
    image: "used-tyre-risks",
    imageId: "16023877",
    photographer: "Tony Rogers",
    imageAlt: "Stacks of used tyres inside an automotive garage",
    imageCaption: "A used tyre may have an incomplete pressure, impact, repair and storage history even when the tread looks deep.",
    excerpt: "Understand the hidden-history problem with used tyres and the minimum sidewall, inner-liner, repair, tread and specification checks before any decision.",
    takeaway: "Visible tread depth cannot reveal every impact, run-flat, repair, age or storage event in a used tyre's history.",
    readMinutes: 8,
    sections: [
      {
        heading: "Start with the missing history",
        paragraphs: [
          "A removed tyre may have been overloaded, driven underinflated, repaired, exposed to heat or chemicals, or damaged in an impact. The seller may not know its full service history.",
          "A clean sidewall and deep tread do not prove that the internal structure is sound. Treat provenance and a complete professional inspection as essential information.",
        ],
      },
      {
        heading: "Inspect inside and outside",
        paragraphs: [
          "The tyre should be off the wheel so the inner liner, bead, repairs and evidence of run-flat damage can be assessed. Reject exposed cords, bulges, deep cuts, bead damage, severe cracking or questionable repairs.",
          "Read the full size, load index, speed symbol and production marking. Compare remaining tread across the whole width and look for one-sided wear or irregular deformation.",
        ],
      },
      {
        heading: "Check set compatibility",
        paragraphs: [
          "Mixing construction, size, large tread-depth differences or incompatible patterns can affect stability and some drivetrains. Follow the vehicle and tyre maker's replacement guidance.",
          "Include inspection, fitting, a suitable valve, balancing and any immediate alignment or wheel work when comparing a used option with a new one.",
        ],
      },
      {
        heading: "Walk away when evidence is incomplete",
        bullets: [
          "The tyre cannot be removed for internal inspection",
          "Identification or date markings are unreadable or altered",
          "Repair history, seller terms or invoice details are unclear",
          "The specification does not exactly match the vehicle requirement",
        ],
      },
    ],
    faqs: [
      { question: "Is deep tread enough to approve a used tyre?", answer: "No. Internal condition, repairs, age, history, specification and compatibility remain unknown without a complete assessment." },
      { question: "Can a previously repaired tyre be sold safely?", answer: "A qualified technician must inspect the repair type, location, condition and tyre maker limits; not every repaired tyre is suitable." },
      { question: "Should used tyres be fitted as a mixed pair?", answer: "Follow vehicle and tyre maker guidance. Size, construction, tread pattern, remaining depth and drivetrain compatibility all matter." },
    ],
    relatedLinks: [
      { label: "When to replace tyres", href: "/guides/when-to-replace-tyres-pakistan" },
      { label: "Inspect tyres before buying", href: "/guides/verify-fresh-genuine-tyres-lahore" },
      { label: "Compare current new-tyre options", href: "/brands" },
    ],
    sources: [TIREWISE, USTMA_CARE, REPAIR_BASICS],
  }),
  article({
    slug: "highway-terrain-all-terrain-mud-terrain-tyres",
    title: "H/T vs A/T vs M/T Tyres: Choose for Your Real Road Use",
    category: "TYRE BUYING",
    topicSlug: "buying-tyres-in-pakistan",
    image: "suv-terrain-tyres",
    imageId: "34357287",
    photographer: "Erik Mclean",
    imageAlt: "Tyres and alloy wheels stacked inside a vehicle workshop",
    imageCaption: "Choose an SUV or pickup tread category for the roads, loads and speeds actually driven—not for appearance alone.",
    excerpt: "Compare highway-terrain, all-terrain and mud-terrain priorities for comfort, noise, wet roads, loose surfaces, durability and daily use.",
    takeaway: "The most aggressive-looking tread is not automatically the safest or most comfortable choice for mostly paved driving.",
    readMinutes: 8,
    sections: [
      {
        heading: "Highway-terrain prioritises paved-road use",
        paragraphs: [
          "H/T-labelled SUV and pickup tyres are generally designed around road comfort, predictable paved-road behaviour and lower pattern noise. Exact performance still depends on the individual product and ratings.",
          "They can suit drivers whose 4x4 spends most of its time in Lahore traffic and on motorways, provided load capacity and fitment match the vehicle.",
        ],
      },
      {
        heading: "All-terrain balances mixed surfaces",
        paragraphs: [
          "A/T patterns use more open tread and stronger-looking features for a mixture of paved roads and loose surfaces. The trade-off can include noise, weight, rolling resistance or different wet-road behaviour.",
          "Ask how much travel is genuinely off pavement and what that surface is: gravel, broken roads, sand, rock and mud are different requirements.",
        ],
      },
      {
        heading: "Mud-terrain is a specialised compromise",
        paragraphs: [
          "M/T patterns prioritise traction and self-cleaning in severe loose conditions. Large blocks and voids can bring substantial paved-road compromises, so appearance alone is a poor reason to choose them.",
          "For any category, verify dimensions, load and speed ratings, wheel compatibility, spare fitment and whether all four tyres should match for the drivetrain.",
        ],
      },
      {
        heading: "Describe use before asking for a quote",
        bullets: [
          "Percentage of city, motorway and unpaved driving",
          "Normal passengers, cargo, towing and tyre pressure plan",
          "Priority between comfort, noise, durability and loose-surface grip",
          "Full tyre size, wheel dimensions and spare-wheel limitation",
        ],
      },
    ],
    faqs: [
      { question: "Are all A/T tyres equally good off road?", answer: "No. Pattern design, construction, ratings and intended terrain vary by product; compare the exact model." },
      { question: "Can I fit M/T tyres only for their appearance?", answer: "They may add noise, weight and on-road trade-offs. Choose from real use, vehicle approval and complete specification." },
      { question: "Should all four SUV tyres match?", answer: "Follow the vehicle and tyre maker guidance, especially for AWD/4WD systems where circumference differences can matter." },
    ],
    relatedLinks: [
      { label: "Browse SUV tyre sizes", href: "/tyre-sizes" },
      { label: "Compare tyre brands", href: "/brands" },
      { label: "Request a use-based recommendation", href: "/quote" },
    ],
    sources: [TIREWISE, USTMA_CARE],
  }),
  article({
    slug: "tyres-fuel-economy-rolling-resistance-pakistan",
    title: "Tyres and Fuel Economy: What Rolling Resistance Really Changes",
    category: "TYRE BUYING",
    topicSlug: "buying-tyres-in-pakistan",
    image: "fuel-efficient-tyres",
    imageId: "20792556",
    photographer: "GMB VISUALS",
    imageAlt: "Performance car wheel and tyre on a paved road",
    imageCaption: "Pressure, size, load, alignment, tread and driving conditions all influence energy use; one marketing label is not the whole answer.",
    excerpt: "Learn how tyre deformation, pressure, size and pattern can affect fuel or electric range without ignoring wet grip, ratings and vehicle approval.",
    takeaway: "Efficiency matters, but never trade away correct fitment, load capacity, pressure, condition or braking priorities for a single label.",
    readMinutes: 7,
    sections: [
      {
        heading: "Understand rolling resistance in plain language",
        paragraphs: [
          "A tyre deforms as it rolls and some energy is lost as heat. Construction, compound, pattern, pressure, load and dimensions influence that loss.",
          "An efficiency-focused tyre may reduce one source of energy use, but real fuel economy or EV range also depends on speed, traffic, temperature, aerodynamics, load and driving style.",
        ],
      },
      {
        heading: "Pressure and alignment can erase gains",
        paragraphs: [
          "Underinflation increases deformation and heat, while incorrect alignment can drag tyres and create rapid wear. Use the vehicle's recommended cold pressure and diagnose uneven wear.",
          "A larger, wider or heavier wheel-and-tyre package can change mass, aerodynamics, gearing and comfort. A small diameter calculation alone cannot approve an upsize.",
        ],
      },
      {
        heading: "Compare complete products",
        paragraphs: [
          "Compare the exact pattern's wet-road performance, load and speed ratings, noise, expected use and seller support alongside efficiency claims.",
          "For replacement, keep the vehicle maker's approved specification as the starting point and avoid mixing substantially different tyres on an axle or drivetrain without guidance.",
        ],
      },
      {
        heading: "For a useful rate request, share",
        bullets: [
          "Vehicle model, year, variant and normal load",
          "Complete tyre size and placard pressure",
          "Current pattern and any uneven-wear symptoms",
          "Priority between economy, comfort, wet grip and mileage",
        ],
      },
    ],
    faqs: [
      { question: "Will narrower tyres always save fuel?", answer: "No. Vehicle approval, construction, pressure, compound, pattern, load and wheel package all affect the result." },
      { question: "Does low rolling resistance mean low grip?", answer: "Not automatically. Evaluate the complete product's tested performance and intended use instead of assuming from one label." },
      { question: "Can incorrect alignment reduce economy?", answer: "It can increase drag and wear. Diagnose pulling or uneven wear and correct the underlying cause." },
    ],
    relatedLinks: [
      { label: "Correct tyre pressure", href: "/guides/correct-tyre-pressure-pakistan" },
      { label: "Compare tyre options", href: "/guides/chinese-vs-japanese-vs-premium-tyres-lahore" },
      { label: "Use the tyre-size calculator", href: "/tools/tyre-size-calculator" },
    ],
    sources: [TIREWISE, USTMA_CARE],
  }),
  article({
    slug: "tyre-bulges-cuts-cracks-damage-guide",
    title: "Tyre Bulges, Cuts and Cracks: What Needs Immediate Attention?",
    category: "TYRE CARE & SAFETY",
    topicSlug: "tyre-care-and-road-safety",
    image: "tyre-damage",
    imageId: "37821816",
    photographer: "Raphhill .Jpg",
    imageAlt: "Black and white close-up of a tyre and wheel",
    imageCaption: "Inspect outer and inner sidewalls after impacts; visible damage can require the tyre to leave service immediately.",
    excerpt: "Use a clear inspection routine for bulges, deep cuts, exposed cords, cracking, bead damage, impact marks and unexplained vibration.",
    takeaway: "A bulge, exposed structure, sudden pressure loss or severe cut is not a cosmetic issue—stop normal use and obtain professional inspection.",
    readMinutes: 7,
    sections: [
      {
        heading: "Treat bulges and exposed structure as urgent",
        paragraphs: [
          "A localised sidewall bulge can indicate damaged internal cords after an impact. Exposed cords, separated tread, severe deformation or deep damage also require the tyre to be removed from normal service.",
          "Do not press, puncture or attempt to patch a bulge. If safe, use the vehicle's approved spare or arrange recovery and inspection.",
        ],
      },
      {
        heading: "Inspect after potholes and kerb impacts",
        paragraphs: [
          "Check the outer sidewall, inner sidewall, bead area, tread and wheel. New vibration, pulling, steering change or pressure loss can indicate tyre, wheel or suspension damage.",
          "Some damage is hidden until the tyre is removed. Balancing should not be used to mask a bent wheel, structural tyre fault or loose component.",
        ],
      },
      {
        heading: "Read cracking in context",
        paragraphs: [
          "Fine surface ageing and deep cracking are not the same, but photographs alone may not reveal depth or internal condition. Heat, sunlight, chemicals, pressure and storage history matter.",
          "Follow manufacturer inspection and replacement guidance and include the spare. A date code supports the assessment but does not override damage.",
        ],
      },
      {
        heading: "Stop and request help when you see",
        bullets: [
          "A bulge, bubble, exposed cord or tread separation",
          "A deep cut, torn bead or wheel damage",
          "Sudden or repeated pressure loss",
          "Vibration or pulling that began after an impact",
        ],
      },
    ],
    faqs: [
      { question: "Can a tyre bulge be repaired?", answer: "A bulge can indicate structural cord damage and is not handled like a simple tread puncture; stop normal use and obtain replacement assessment." },
      { question: "Is sidewall cracking only cosmetic?", answer: "Not necessarily. Depth, extent, age, exposure and manufacturer guidance need professional assessment." },
      { question: "Can balancing fix vibration after a pothole?", answer: "Only if imbalance is the actual cause. The tyre, wheel, hub and suspension should first be checked for damage." },
    ],
    relatedLinks: [
      { label: "Puncture repair guide", href: "/guides/tyre-puncture-repair-guide-pakistan" },
      { label: "When to replace tyres", href: "/guides/when-to-replace-tyres-pakistan" },
      { label: "Wheel balancing service", href: "/services/wheel-balancing" },
    ],
    sources: [TIREWISE, USTMA_CARE, source("Replacing tires", "https://www.ustires.org/tire-care-safety/replacing-tires", "U.S. Tire Manufacturers Association")],
  }),
  article({
    slug: "alloy-wheel-pcd-offset-centre-bore-guide",
    title: "Alloy Wheel PCD, Offset and Centre Bore Explained",
    category: "ALLOY RIMS & WHEELS",
    topicSlug: "alloy-rims-and-wheel-fitment",
    image: "wheel-pcd-offset",
    imageId: "12173187",
    photographer: "Amar Preciado",
    imageAlt: "Detailed close-up of a multi-spoke alloy wheel",
    imageCaption: "Diameter is only one dimension: PCD, centre bore, width, offset, seat type and load capacity all belong in a wheel fitment check.",
    excerpt: "Understand the measurements that locate and support an alloy wheel before choosing a 12–24 inch rim for a specific vehicle.",
    takeaway: "A wheel that shares the same diameter or bolt count is not automatically compatible with the vehicle.",
    readMinutes: 9,
    sections: [
      {
        heading: "PCD describes the bolt circle",
        paragraphs: [
          "PCD combines the number of wheel fasteners with the diameter of the circle through their centres. Two wheels can both have five holes but use different bolt-circle diameters.",
          "Slots, redrilling or forcing fasteners are not substitutes for correct fitment. Confirm the vehicle specification and the wheel's verified marking or technical drawing.",
        ],
      },
      {
        heading: "Offset positions the wheel across the hub",
        paragraphs: [
          "Offset is the distance between the wheel centreline and mounting face. Changing it moves the wheel inward or outward and can affect suspension, brake, arch and steering clearance.",
          "Appearance does not prove clearance through full steering and suspension travel. Wheel width and tyre section width interact with offset.",
        ],
      },
      {
        heading: "Centre bore and fastener seat matter",
        paragraphs: [
          "The centre bore must suit the hub-centred or approved ring arrangement. The fastener thread, length and seat profile must also match the vehicle and wheel.",
          "Brake-caliper clearance, load capacity, wheel construction and any front/rear difference still need checking even when the basic measurements look correct.",
        ],
      },
      {
        heading: "Send these measurements for a rim enquiry",
        bullets: [
          "Vehicle make, model, year and exact variant",
          "Wheel diameter, width, PCD, offset and centre bore",
          "Current tyre size and desired use",
          "Clear photos of the hub, current wheel markings and brake package",
        ],
      },
    ],
    faqs: [
      { question: "Is bolt count the same as PCD?", answer: "No. PCD includes both the number of fasteners and the diameter of their bolt circle." },
      { question: "Can a centre-bore ring fix any wheel?", answer: "No. It cannot correct PCD, offset, width, load, fastener-seat or brake-clearance incompatibility." },
      { question: "Does lower offset push the wheel outward?", answer: "Generally, relative to the same width, but the complete wheel geometry and vehicle must be checked rather than using offset alone." },
    ],
    relatedLinks: [
      { label: "Browse 12–24 inch alloy rims", href: "/rims" },
      { label: "Choose alloy rim size", href: "/guides/choose-alloy-rim-size-pakistan" },
      { label: "Request a rim fitment check", href: "/quote" },
    ],
    sources: [source("Wheel technology: dimensions and fitment", "https://www.ozracing.com/jp/world-of-oz/technology/the-wheel", "OZ Racing")],
  }),
  article({
    slug: "choose-alloy-rim-size-pakistan",
    title: "How to Choose an Alloy Rim Size Without Guessing",
    category: "ALLOY RIMS & WHEELS",
    topicSlug: "alloy-rims-and-wheel-fitment",
    image: "alloy-rim-size",
    imageId: "29081913",
    photographer: "Lucas Porras",
    imageAlt: "Close-up of a modern alloy wheel and tyre",
    imageCaption: "Choose the wheel, tyre and vehicle as one system; diameter alone does not establish compatibility.",
    excerpt: "Work through wheel diameter, width, tyre profile, load, PCD, offset, centre bore, brake clearance and suspension travel before changing rim size.",
    takeaway: "A larger rim usually requires a different tyre profile, but matching overall diameter does not solve every fitment or ride-quality issue.",
    readMinutes: 8,
    sections: [
      {
        heading: "Start from the approved factory package",
        paragraphs: [
          "Record the current wheel markings, full tyre code and the vehicle's approved alternatives from the placard or manual. Identify any existing modification before planning another change.",
          "The new wheel must match PCD, centre bore, fastener seat, width, offset, load capacity and brake clearance—not just diameter.",
        ],
      },
      {
        heading: "Plan the tyre and wheel together",
        paragraphs: [
          "Increasing wheel diameter normally reduces tyre sidewall if overall diameter is to remain similar. That can alter comfort, impact protection, wheel weight, steering feel and replacement availability.",
          "Use a size calculator for nominal comparison only. The exact tyre model can vary dimensionally and must suit the chosen wheel-width range and vehicle ratings.",
        ],
      },
      {
        heading: "Verify physical clearance",
        paragraphs: [
          "Check brake clearance and the inner and outer envelope through full steering and suspension movement. Include passengers, cargo and real road impacts in the decision.",
          "After correct installation, use suitable fasteners and torque procedure, set vehicle-specified pressure, and investigate rubbing, vibration or handling changes immediately.",
        ],
      },
      {
        heading: "Compare the whole installed package",
        bullets: [
          "Four wheels, compatible tyres and correct valves",
          "Approved fasteners or hub-centric components",
          "Mounting, balancing and alignment diagnosis where needed",
          "Spare-wheel strategy and future tyre availability",
        ],
      },
    ],
    faqs: [
      { question: "Can I fit any 17-inch rim to a car with 17-inch tyres?", answer: "No. Width, PCD, offset, centre bore, fasteners, load and brake clearance must also match." },
      { question: "Will the tyre-size calculator approve a wheel upgrade?", answer: "No. It compares nominal tyre dimensions and cannot test structural, wheel or vehicle clearance requirements." },
      { question: "Why can a larger rim make the ride firmer?", answer: "The matching tyre often has less sidewall compliance, while wheel weight and pressure choices can also affect ride." },
    ],
    relatedLinks: [
      { label: "Use the tyre-size calculator", href: "/tools/tyre-size-calculator" },
      { label: "PCD, offset and centre bore", href: "/guides/alloy-wheel-pcd-offset-centre-bore-guide" },
      { label: "Browse alloy rims", href: "/rims" },
    ],
    sources: [source("Wheel technology: dimensions and fitment", "https://www.ozracing.com/jp/world-of-oz/technology/the-wheel", "OZ Racing")],
  }),
  article({
    slug: "bent-cracked-alloy-wheel-symptoms",
    title: "Bent or Cracked Alloy Wheel? Symptoms and Next Steps",
    category: "ALLOY RIMS & WHEELS",
    topicSlug: "alloy-rims-and-wheel-fitment",
    image: "damaged-alloy-rim",
    imageId: "13350036",
    photographer: "Leon Kohle",
    imageAlt: "Close-up of an alloy wheel, tyre and brake assembly",
    imageCaption: "A vibration or leak after an impact needs tyre, wheel, hub and suspension diagnosis—not cosmetic judgement alone.",
    excerpt: "Recognise impact-related vibration, repeated air loss, visible deformation and cracking, then separate wheel damage from tyre, hub or suspension faults.",
    takeaway: "Stop driving on a visibly cracked wheel or a tyre losing pressure rapidly, and obtain a qualified structural assessment before repair or reuse.",
    readMinutes: 7,
    sections: [
      {
        heading: "Connect symptoms with the impact history",
        paragraphs: [
          "A pothole or kerb strike can damage the tyre, wheel, hub, bearing, steering or suspension. Note when vibration, pulling, noise or pressure loss began.",
          "Inspect both wheel faces and both tyre sidewalls where safely possible. Inner-edge bends and tyre bulges can be easy to miss from outside the vehicle.",
        ],
      },
      {
        heading: "Separate imbalance from structural damage",
        paragraphs: [
          "A balancing machine can reveal radial or lateral runout, but adding weights does not make a cracked or severely bent wheel sound. The tyre itself can also be out of round or internally damaged.",
          "Repeated bead-area leakage may involve corrosion, damage, an unsuitable tyre, valve trouble or poor mounting. Diagnose the sealing surfaces instead of only refilling air.",
        ],
      },
      {
        heading: "Repairability needs specialist judgement",
        paragraphs: [
          "Location, material, wheel construction, deformation and heat history affect whether repair is permitted and sensible. Cosmetic refinishing is different from structural repair.",
          "Any repaired wheel must still meet the vehicle's dimensional and load requirements and should be checked for runout, leakage, fastener seating and tyre compatibility.",
        ],
      },
      {
        heading: "Arrange immediate inspection for",
        bullets: [
          "A visible crack, missing material or severe deformation",
          "Rapid pressure loss or a tyre bead that will not seal",
          "New vibration, pulling or noise after an impact",
          "A damaged fastener seat, centre bore or mounting face",
        ],
      },
    ],
    faqs: [
      { question: "Can balancing fix a bent alloy wheel?", answer: "No. Balancing corrects mass distribution; it does not restore structural shape or repair a crack." },
      { question: "Can every alloy wheel be welded?", answer: "No. Material, construction, crack location and damage determine whether any repair is acceptable; use a qualified specialist." },
      { question: "Why does a wheel leak after a pothole?", answer: "The tyre, valve, bead seat or wheel can be damaged. Remove and inspect the assembly rather than assuming one cause." },
    ],
    relatedLinks: [
      { label: "Computerised wheel balancing", href: "/services/wheel-balancing" },
      { label: "Wheel alignment service", href: "/services/wheel-alignment" },
      { label: "Alloy wheel fitment measurements", href: "/guides/alloy-wheel-pcd-offset-centre-bore-guide" },
    ],
    sources: [source("Wheel technology and construction", "https://www.ozracing.com/jp/world-of-oz/technology/the-wheel", "OZ Racing"), TIREWISE],
  }),
  article({
    slug: "ev-tyres-load-pressure-range-guide",
    title: "EV Tyres: Load, Pressure, Noise and Range Explained",
    category: "TYRE SIZE & FITMENT",
    topicSlug: "tyre-size-and-fitment",
    image: "ev-tyres",
    imageId: "32723311",
    photographer: "Erik Mclean",
    imageAlt: "Close-up of a black alloy wheel and performance tyre",
    imageCaption: "For an EV, match the exact size and ratings first; range, noise and wear are product and vehicle-specific trade-offs.",
    excerpt: "Understand why electric-vehicle weight, torque, quiet cabins and range make load rating, pressure, construction and exact fitment especially important.",
    takeaway: "An EV badge is not a substitute for the exact tyre size, load and speed ratings required by the vehicle manufacturer.",
    readMinutes: 8,
    sections: [
      {
        heading: "Start with load capacity and exact fitment",
        paragraphs: [
          "Battery mass and vehicle configuration can create demanding axle loads. Match the placard size, load index, speed symbol and any reinforced or extra-load requirement for the exact variant.",
          "Do not assume a tyre fits because another version of the same EV uses it. Wheel packages and front/rear sizes can vary by trim and market.",
        ],
      },
      {
        heading: "Use the vehicle's pressure guidance",
        paragraphs: [
          "Set cold pressure from the vehicle placard or manual and account for stated load conditions. Incorrect pressure can affect heat, wear, steering response and energy use.",
          "EV torque can make poor pressure, alignment or aggressive acceleration show up quickly as wear. Inspect all tread zones and investigate a new wear pattern early.",
        ],
      },
      {
        heading: "Compare range, noise and grip as a package",
        paragraphs: [
          "Rolling resistance can influence range, and a quiet powertrain can make tyre noise more noticeable. These priorities still sit alongside wet grip, braking, durability and damage resistance.",
          "Compare the exact pattern rather than assuming every product marketed for EVs behaves the same. Keep compatible tyres across an axle and follow drivetrain guidance.",
        ],
      },
      {
        heading: "Share these EV details when enquiring",
        bullets: [
          "Make, model, model year, variant and wheel package",
          "Front and rear sidewall codes plus placard photo",
          "Normal passengers, cargo and motorway use",
          "Priority between range, comfort, noise, wet grip and durability",
        ],
      },
    ],
    faqs: [
      { question: "Do electric cars always need special EV tyres?", answer: "They need tyres meeting the exact vehicle specification. Product labels vary; size, load, speed, construction and manufacturer guidance decide suitability." },
      { question: "Why might EV tyres wear quickly?", answer: "Weight, torque, pressure, alignment, tyre design, road surface and driving style all influence wear." },
      { question: "Can I choose a tyre only for maximum range?", answer: "No. Correct fitment, load capacity, wet grip, braking, condition and intended use remain essential." },
    ],
    relatedLinks: [
      { label: "Find tyres by electric vehicle", href: "/vehicles" },
      { label: "Tyres and fuel economy", href: "/guides/tyres-fuel-economy-rolling-resistance-pakistan" },
      { label: "Correct tyre pressure", href: "/guides/correct-tyre-pressure-pakistan" },
    ],
    sources: [TIREWISE, USTMA_CARE],
  }),
];

export default ADDITIONAL_GUIDES;
