// Pakistan vehicle-fitment directory.
//
// This registry intentionally separates sourced, indexable model guides from
// research-only references. A tyre size is never an automatic fitment
// approval: model year, trim, placard, load/speed ratings and the fitted wheel
// must still be checked on the physical vehicle.

const slugify = (value = "") => String(value)
  .trim()
  .toLowerCase()
  .replace(/&/g, "and")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const official = (title, url) => ({
  type: "Official manufacturer specification",
  title,
  url,
});

const reference = (size, context, options = {}) => ({
  size,
  context,
  status: options.status || "verify",
  years: options.years || "Varies by model year",
  variants: options.variants || "Confirm exact variant",
  sourceLabel: options.sourceLabel || "Vehicle placard or owner manual",
  note:
    options.note ||
    "Reference size only. Match the exact vehicle placard, owner manual and fitted wheel before purchase.",
});

const vehicle = ({
  make,
  model,
  bodyStyle,
  market = "Pakistan-market and commonly driven examples",
  yearScope,
  summary,
  fitments,
  sources = [],
  searchIndex,
  buyingAdvice = [],
  aliases = [],
}) => {
  const makeSlug = slugify(make);
  const modelSlug = slugify(model);
  const isSourced = sources.some((source) => source?.url);
  const listedSizes = [...new Set(fitments.map((fitment) => fitment.size))];
  const sizeSummary = listedSizes.length
    ? `Published references include ${listedSizes.join(", ")}.`
    : "The complete local tyre code still needs to be read from the vehicle placard or current sidewall.";
  return {
    slug: `${makeSlug}-${modelSlug}`,
    makeSlug,
    modelSlug,
    make,
    model,
    bodyStyle,
    market,
    aliases,
    yearScope:
      yearScope || `${market}; confirm generation, model year, trim and original wheel package`,
    summary:
      summary ||
      `${make} ${model} ${bodyStyle ? `${bodyStyle.toLowerCase()} ` : ""}tyre requirements can change by model year, trim and factory wheel package. ${sizeSummary} Use this model guide to narrow the search, then verify the exact car before requesting a current rate.`,
    commonSizes: fitments,
    sources,
    reviewedAt: "2026-10-14",
    searchIndex: searchIndex ?? isSourced,
    buyingAdvice: [
      `State the exact ${make} ${model} model year and variant when requesting a quote`,
      "Read the complete size and load/speed markings from the current tyre or vehicle placard",
      "Tell the team if the wheels, suspension or tyre profile have been changed",
      ...buyingAdvice,
    ],
  };
};

export const VEHICLE_MAKES = [
  { slug: "suzuki", name: "Suzuki", description: "Compact hatchbacks, family cars and long-running local models found across Pakistan." },
  { slug: "toyota", name: "Toyota", description: "Sedans, hybrids, SUVs and pickups across several Pakistan-market and imported generations." },
  { slug: "honda", name: "Honda", description: "Popular sedans, crossovers and Japanese imports with generation-specific wheel packages." },
  { slug: "kia", name: "Kia", description: "Locally offered hatchbacks, crossovers, SUVs, MPVs and electric vehicles." },
  { slug: "hyundai", name: "Hyundai", description: "Sedans, hybrid SUVs, EVs and people movers sold through Hyundai Pakistan." },
  { slug: "changan", name: "Changan", description: "Sedans, crossovers, vans and Deepal electric vehicles in the Pakistan market." },
  { slug: "mg", name: "MG", description: "Petrol, hybrid and electric crossovers and hatchbacks with variant-specific tyre sizes." },
  { slug: "haval", name: "Haval", description: "SUV and hybrid-SUV fitments that require matching all four tyres to the exact specification." },
  { slug: "gwm", name: "GWM", description: "ORA electric cars and TANK SUVs offered through the current GWM Pakistan range." },
  { slug: "omoda", name: "OMODA", description: "Pakistan-market electric and plug-in-hybrid crossovers with large alloy-wheel packages." },
  { slug: "jaecoo", name: "JAECOO", description: "Pakistan-market hybrid and electric SUVs where the exact local tyre profile needs variant confirmation." },
  { slug: "proton", name: "Proton", description: "Saga sedan and X70 SUV references for Pakistan-market vehicles." },
  { slug: "peugeot", name: "Peugeot", description: "Pakistan-market crossover fitments with official wheel specifications." },
  { slug: "daihatsu", name: "Daihatsu", description: "Common Japanese-import kei cars with year, trim and wheel-package differences." },
  { slug: "nissan", name: "Nissan", description: "Japanese-import hatchbacks, hybrids and crossovers commonly driven in Pakistan." },
  { slug: "mitsubishi", name: "Mitsubishi", description: "Kei cars, sedans and SUVs spanning imported and older Pakistan-road vehicles." },
  { slug: "chery", name: "Chery", description: "Pakistan-market compact and seven-seat SUV tyre references." },
  { slug: "baic", name: "BAIC", description: "Passenger-car and off-road SUV fitments sold in Pakistan." },
  { slug: "dfsk", name: "DFSK", description: "DFSK family crossovers and Seres electric SUVs distributed in Pakistan." },
  { slug: "prince", name: "Prince", description: "Compact city-car references for Pakistan-market vehicles." },
  { slug: "isuzu", name: "Isuzu", description: "Pickup and SUV tyres where load rating and road use are especially important." },
  { slug: "byd", name: "BYD", description: "Electric and plug-in hybrid vehicle tyre references for the growing Pakistan range." },
  { slug: "jac", name: "JAC", description: "Pickup fitments requiring load, terrain and spare-wheel compatibility checks." },
  { slug: "jetour", name: "Jetour", description: "Pakistan-market crossover references with large-diameter wheel packages." },
  { slug: "faw", name: "FAW", description: "Older locally sold hatchback and MPV references still found on Pakistani roads." },
  { slug: "honri", name: "Honri", description: "Compact electric city cars now found in Pakistan; confirm the exact supplied wheel and tyre label." },
  { slug: "gugo", name: "GUGO", description: "Newer electric city-car and commercial-EV references that require physical fitment verification." },
  { slug: "dongfeng", name: "Dongfeng", description: "Electric hatchback and sedan references entering Pakistan through newer distributor ranges." },
];

// These entries extend the long-standing core guides in seoContent.js. Current
// official Pakistan sources are indexable. Import/legacy references without an
// authoritative local source stay accessible but noindex until reviewed.
export const ADDITIONAL_PAKISTAN_VEHICLES = [
  vehicle({
    make: "Suzuki", model: "Alto", bodyStyle: "City hatchback", market: "Current Pakistan-market VXR, VXR AGS and VXL AGS",
    fitments: [reference("145/80 R13", "Official current specification across listed Pakistan-market variants", { years: "Current Pakistan model", variants: "VXR, VXR AGS and VXL AGS" })],
    sources: [official("Pak Suzuki Alto brochure", "https://suzukipakistan.com/api/media/file/ALTO%20Brochure%20Updated%2015-4-2025%20%28Final%29.pdf")],
  }),
  vehicle({
    make: "Suzuki", model: "Cultus", bodyStyle: "Hatchback", market: "Current Pakistan-market VXR, VXL and VXL AGS",
    fitments: [reference("165/65 R14", "Official current specification across listed Pakistan-market variants", { years: "Current Pakistan model", variants: "VXR, VXL and VXL AGS" })],
    sources: [official("Pak Suzuki Cultus brochure", "https://suzukipakistan.com/api/media/file/Cultus%20Brochure%20Updated%20%2027.06.2025.pdf")],
  }),
  vehicle({
    make: "Suzuki", model: "Swift", bodyStyle: "Hatchback", market: "Current Pakistan-market GL, GL CVT and GLX CVT",
    fitments: [reference("185/55 R16", "Official current specification across listed Pakistan-market variants", { years: "Current Pakistan model", variants: "GL, GL CVT and GLX CVT" })],
    sources: [official("Pak Suzuki Swift specification sheet", "https://suzukipakistan.com/api/media/file/Swift%20Specification%20Sheet.pdf")],
  }),
  vehicle({
    make: "Suzuki", model: "Fronx", bodyStyle: "Crossover", market: "Current Pakistan-market GL and GLX",
    fitments: [reference("195/60 R16", "Official current specification", { years: "Current Pakistan model", variants: "GL 5MT, GL 4AT and GLX 6AT" })],
    sources: [official("Pak Suzuki Fronx brochure", "https://suzukipakistan.com/api/media/file/Fronx%20Brochure%20c2p-YQ%20HR-1.pdf")],
  }),
  vehicle({
    make: "Suzuki", model: "Every", bodyStyle: "Mini MPV", market: "Pakistan-market and Japanese-import versions",
    fitments: [reference("145 R12C 86/84S", "Official current Pakistan-market commercial-tyre specification", { years: "Current Pakistan model", variants: "VX and VXR", sourceLabel: "Pak Suzuki brochure", note: "This is a commercial-tyre format, not 145/80 R12. Match the C construction and 86/84 load index shown by the manufacturer." })],
    sources: [official("Pak Suzuki Every brochure", "https://suzukipakistan.com/api/media/file/Every%20brochure%20April%2001%2C%202025.pdf")],
  }),
  vehicle({
    make: "Suzuki", model: "Bolan", bodyStyle: "Mini van", market: "Legacy Pakistan-market commercial/passenger versions",
    fitments: [reference("145/80 R12", "Passenger-tyre dimensional reference; commercial construction and load rating must be checked", { variants: "VX and converted examples vary" })],
    searchIndex: false,
  }),
  vehicle({
    make: "Suzuki", model: "Ravi", bodyStyle: "Mini pickup", market: "Legacy Pakistan-market commercial vehicle",
    fitments: [reference("145 R12C", "Common commercial-tyre format; confirm the full load marking on the vehicle", { variants: "Pickup and converted examples vary" })],
    searchIndex: false,
  }),
  vehicle({
    make: "Suzuki", model: "Hustler", bodyStyle: "Kei crossover", market: "Japanese-import generations",
    fitments: [reference("165/60 R15", "Reference for selected Hustler generations and factory wheel packages")],
    searchIndex: false,
  }),

  vehicle({
    make: "Toyota", model: "Yaris", bodyStyle: "Sedan", market: "Current Pakistan-market 1.3 and 1.5 variants",
    fitments: [reference("185/60 R15", "Official current Pakistan-market reference", { years: "Current Pakistan model", variants: "Current 1.3 and 1.5 variants" })],
    sources: [official("Toyota Pakistan Yaris", "https://toyota-indus.com/yaris/")],
  }),
  vehicle({
    make: "Toyota", model: "Corolla", bodyStyle: "Sedan", market: "Current Pakistan-market Altis X plus older generations",
    fitments: [
      reference("195/65 R15", "Official reference for current 1.6 manual configuration", { variants: "Altis X 1.6 MT" }),
      reference("205/55 R16", "Official reference for current CVT and 1.8 wheel packages", { variants: "Selected Altis X 1.6 CVT/SE and 1.8 variants" }),
    ],
    sources: [official("Toyota Pakistan Corolla Altis X specification", "https://toyota-indus.com/wp-content/uploads/2026/03/IMC-Corolla-Altis-X-Spec-Sheet.pdf")],
  }),
  vehicle({
    make: "Toyota", model: "Fortuner", bodyStyle: "SUV", market: "Current Pakistan-market variants plus older generations",
    fitments: [
      reference("265/65 R17", "Official reference for selected current V and G configurations", { variants: "Fortuner V and G" }),
      reference("265/60 R18", "Official reference for selected current GR-S, Legender and Sigma 4 configurations", { variants: "GR-S, Legender and Sigma 4" }),
    ],
    sources: [official("Toyota Pakistan Fortuner brochure", "https://toyota-indus.com/wp-content/uploads/2025/07/GazooBrochure.pdf")],
  }),
  vehicle({
    make: "Toyota", model: "Hilux / Revo", bodyStyle: "Pickup", market: "Current Pakistan-market Hilux and Revo variants",
    fitments: [
      reference("225/70 R17", "Dimensional reference for Hilux E; verify the required C construction and load marking", { variants: "Hilux E", note: "The official specification uses a commercial C-rated tyre. Confirm the complete sidewall code before purchase." }),
      reference("265/65 R17", "Official reference for selected Revo G configurations", { variants: "Revo G MT and AT" }),
      reference("265/60 R18", "Official reference for selected Revo V, Rocco and GR-S configurations", { variants: "Revo V, Rocco and GR-S" }),
    ],
    sources: [official("Toyota Pakistan Hilux and Revo specification sheet", "https://toyota-indus.com/wp-content/uploads/2025/07/Revo-Spec-Sheet-.pdf")],
    buyingAdvice: ["Confirm cargo load and actual highway or off-road use before choosing the tread category"],
  }),
  vehicle({
    make: "Toyota", model: "Corolla Cross", bodyStyle: "Hybrid crossover",
    fitments: [reference("215/60 R17", "Reference for selected Pakistan-market Corolla Cross variants")],
    sources: [official("Toyota Corolla Cross Pakistan", "https://toyota-indus.com/corolla-cross/")],
  }),
  vehicle({
    make: "Toyota", model: "Camry", bodyStyle: "Executive sedan", market: "Pakistan-market and imported generations",
    fitments: [reference("215/55 R17", "Reference for selected Camry generations"), reference("235/45 R18", "Reference for selected higher wheel packages")],
    searchIndex: false,
  }),
  vehicle({
    make: "Toyota", model: "Prius", bodyStyle: "Hybrid hatchback", market: "Japanese and other imported generations",
    fitments: [reference("195/65 R15", "Reference for selected Prius generations"), reference("215/45 R17", "Reference for selected higher trim wheel packages")],
    searchIndex: false,
  }),
  vehicle({
    make: "Toyota", model: "Aqua", bodyStyle: "Hybrid hatchback", market: "Japanese-import generations",
    fitments: [reference("175/65 R15", "Reference for selected Aqua generations"), reference("185/60 R16", "Reference for selected newer or changed-wheel examples")],
    searchIndex: false,
  }),
  vehicle({
    make: "Toyota", model: "Vitz", bodyStyle: "Hatchback", market: "Japanese-import generations",
    fitments: [reference("165/70 R14", "Reference for selected Vitz generations"), reference("175/65 R15", "Reference for selected higher trims")],
    searchIndex: false,
  }),
  vehicle({
    make: "Toyota", model: "Passo", bodyStyle: "Hatchback", market: "Japanese-import generations",
    fitments: [reference("165/65 R14", "Reference for selected Passo generations"), reference("175/55 R15", "Reference for selected style packages")],
    searchIndex: false,
  }),
  vehicle({
    make: "Toyota", model: "Raize", bodyStyle: "Compact crossover", market: "Japanese-import generations",
    fitments: [reference("195/65 R16", "Reference for selected Raize configurations"), reference("195/60 R17", "Reference for selected larger factory wheel packages")],
    searchIndex: false,
  }),
  vehicle({
    make: "Toyota", model: "Sienta", bodyStyle: "Hybrid MPV", market: "Japanese-import generations",
    fitments: [reference("185/60 R15", "Reference for selected Sienta generations"), reference("195/50 R16", "Reference for selected larger factory wheel packages")],
    searchIndex: false,
  }),
  vehicle({
    make: "Toyota", model: "Land Cruiser", bodyStyle: "Full-size SUV", market: "Pakistan-market and imported generations",
    fitments: [reference("285/60 R18", "Reference for selected Land Cruiser 300 wheel packages"), reference("265/55 R20", "Reference for selected larger factory wheel packages")],
    searchIndex: false,
    buyingAdvice: ["Match tyre construction, load index and all four positions for the vehicle's weight and drivetrain"],
  }),
  vehicle({
    make: "Toyota", model: "Prado", bodyStyle: "SUV", market: "Imported generations and trims",
    fitments: [reference("265/65 R17", "Reference for selected Prado 150 configurations"), reference("265/60 R18", "Reference for selected larger wheel packages")],
    searchIndex: false,
  }),

  vehicle({
    make: "Honda", model: "City", bodyStyle: "Sedan", market: "Current Pakistan-market City variants plus older generations",
    fitments: [reference("175/65 R15", "Official current specification", { years: "Current Pakistan model", variants: "1.2LS, Aspire 1.5LAS and Aspire S" })],
    sources: [official("Honda Pakistan City 1.2LS", "https://www.honda.com.pk/city1-2l"), official("Honda Pakistan City Aspire S", "https://www.honda.com.pk/cityaspires")],
  }),
  vehicle({
    make: "Honda", model: "HR-V", bodyStyle: "Compact crossover",
    fitments: [
      reference("215/60 R17", "Official reference for petrol configurations", { variants: "VTI and VTI-S" }),
      reference("225/50 R18", "Official reference for hybrid configuration", { variants: "e:HEV" }),
    ],
    sources: [official("Honda HR-V e:HEV 2025 brochure", "https://www.honda.com.pk/flipbook/pdf/HR-V-ehev-25-Brochure.pdf")],
  }),
  vehicle({
    make: "Honda", model: "N-Box", bodyStyle: "Kei tall wagon", market: "Japanese-import generations",
    fitments: [reference("155/65 R14", "Reference for selected N-Box configurations"), reference("165/55 R15", "Reference for selected Custom wheel packages")],
    searchIndex: false,
  }),
  vehicle({
    make: "Kia", model: "Sportage", bodyStyle: "SUV", market: "Pakistan-market Sportage L plus earlier local generations",
    fitments: [
      reference("225/55 R18", "Reference for selected earlier Pakistan-market Sportage configurations", { variants: "Earlier local generation" }),
      reference("235/60 R18", "Official reference for current Sportage L configurations", { variants: "Sportage L FWD and AWD HEV" }),
    ],
    sources: [official("Kia Pakistan Sportage L trim comparison", "https://kia-luckymotorcorp.com/showroom/the-all-new-sportage-l/compare-trims/")],
  }),
  vehicle({
    make: "Honda", model: "Accord", bodyStyle: "Executive sedan", market: "Pakistan-market and imported generations",
    fitments: [reference("225/50 R17", "Reference for selected Accord generations"), reference("235/40 R19", "Reference for selected higher wheel packages")],
    searchIndex: false,
  }),
  vehicle({
    make: "Hyundai", model: "Elantra", bodyStyle: "Sedan", market: "Current Pakistan-market petrol and hybrid versions",
    fitments: [
      reference("215/55 R16", "Official reference for Elantra 1.6 Special Edition", { variants: "1.6 Special Edition" }),
      reference("205/55 R16", "Official reference for Elantra Hybrid", { variants: "Hybrid" }),
    ],
    sources: [official("Hyundai Pakistan Elantra specification", "https://hyundai-nishat.com/elantra-specification/"), official("Hyundai Pakistan Elantra Hybrid specification", "https://hyundai-nishat.com/elantra-hybrid-specification/")],
  }),
  vehicle({
    make: "Hyundai", model: "Tucson", bodyStyle: "SUV", market: "Current Tucson Hybrid plus earlier Pakistan-market generation",
    fitments: [
      reference("225/55 R18", "Reference for selected earlier Pakistan-market configurations", { variants: "Earlier local generation" }),
      reference("235/60 R18", "Official current Tucson Hybrid reference", { variants: "Tucson Hybrid" }),
    ],
    sources: [official("Hyundai Pakistan Tucson Hybrid specification", "https://hyundai-nishat.com/tucson-hybrid-specification/")],
  }),
  vehicle({
    make: "Honda", model: "Vezel", bodyStyle: "Hybrid crossover", market: "Japanese-import generations",
    fitments: [reference("215/60 R16", "Reference for selected Vezel generations"), reference("225/50 R18", "Reference for selected higher trims")],
    searchIndex: false,
  }),
  vehicle({
    make: "Changan", model: "Alsvin", bodyStyle: "Sedan", market: "Pakistan-market Comfort and Lumiere variants",
    fitments: [reference("185/55 R15", "Official Pakistan-market reference", { variants: "Comfort and Lumiere" })],
    sources: [official("Changan Pakistan Alsvin specification", "https://changan.com.pk/alsvin/")],
  }),
  vehicle({
    make: "Changan", model: "Oshan X7", bodyStyle: "SUV", market: "Current Pakistan-market variants",
    fitments: [reference("225/55 R19", "Official current specification across listed variants", { variants: "FutureSense and Comfort" })],
    sources: [official("Changan Pakistan Oshan X7 specifications", "https://www.changan.com.pk/oshan-x7/view-specifications.php?product_id=P002")],
  }),
  vehicle({
    make: "Honda", model: "Fit", bodyStyle: "Hybrid hatchback", market: "Japanese-import generations",
    fitments: [reference("185/60 R15", "Reference for selected Honda Fit generations"), reference("185/55 R16", "Reference for selected higher trims")],
    searchIndex: false,
  }),
  vehicle({
    make: "MG", model: "HS", bodyStyle: "SUV", market: "Pakistan-market petrol and hybrid generations",
    fitments: [
      reference("215/60 R17", "Official reference for HS Excite", { variants: "HS Excite" }),
      reference("235/50 R18", "Official reference for HS Trophy and selected earlier variants", { variants: "HS Trophy / selected earlier variants" }),
      reference("225/55 R19", "Official reference for current HS Super Hybrid", { variants: "HS Super Hybrid" }),
    ],
    sources: [official("MG Pakistan HS Excite brochure", "https://mgmotors.com.pk/assets/brochure/MG-HS-Essence.pdf"), official("MG Pakistan HS Super Hybrid brochure", "https://mgmotors.com.pk/assets/brochure/Super-Hybrid-Updated.pdf")],
  }),
  vehicle({
    make: "Honda", model: "N-WGN", bodyStyle: "Kei hatchback", market: "Japanese-import generations",
    fitments: [reference("155/65 R14", "Reference for selected N-WGN variants"), reference("165/55 R15", "Reference for selected Custom wheel packages")],
    searchIndex: false,
  }),
  vehicle({
    make: "Honda", model: "N-One", bodyStyle: "Kei hatchback", market: "Japanese-import generations",
    fitments: [reference("155/65 R14", "Reference for selected N-One variants"), reference("165/55 R15", "Reference for selected higher trims")],
    searchIndex: false,
  }),

  vehicle({
    make: "Kia", model: "Stonic", bodyStyle: "Compact crossover",
    fitments: [
      reference("185/65 R15", "Official reference for selected earlier EX configurations", { variants: "Earlier EX" }),
      reference("195/55 R16", "Official reference for selected EX+ and current Turbo X configurations", { variants: "EX+ or Turbo X" }),
      reference("205/55 R17", "Official reference for current Turbo S configuration", { variants: "Turbo S" }),
    ],
    sources: [official("Kia Pakistan All-New Stonic specifications", "https://kia-luckymotorcorp.com/showroom/all-new-stonic/")],
  }),
  vehicle({
    make: "Kia", model: "Sorento", bodyStyle: "Seven-seat SUV",
    fitments: [reference("235/60 R18", "Official owner-manual reference for selected Sorento configurations"), reference("235/55 R19", "Reference for selected higher wheel packages")],
    sources: [official("Kia Sorento owner manual - tyres and wheels", "https://kia-luckymotorcorp.com/documents/sorento-vehicle/owner-manual-sorento.pdf")],
  }),
  vehicle({
    make: "Kia", model: "Carnival", bodyStyle: "MPV",
    fitments: [reference("235/60 R18", "Reference for selected Pakistan-market Carnival configurations")],
    sources: [official("Kia Pakistan Carnival", "https://kia-luckymotorcorp.com/showroom/carnival/")],
  }),
  vehicle({
    make: "Kia", model: "EV5", bodyStyle: "Electric SUV",
    fitments: [reference("225/55 R18", "Reference for selected EV5 wheel packages"), reference("235/55 R19", "Reference for selected higher EV5 wheel packages")],
    sources: [official("Kia Pakistan EV5", "https://kia-luckymotorcorp.com/showroom/ev5/")],
    searchIndex: false,
  }),
  vehicle({
    make: "Kia", model: "EV9", bodyStyle: "Electric SUV",
    fitments: [reference("285/45 R21", "Official reference for the Pakistan-market EV9 wheel package")],
    sources: [official("Kia Pakistan EV9", "https://kia-luckymotorcorp.com/showroom/ev9/")],
  }),

  vehicle({
    make: "Hyundai", model: "Sonata", bodyStyle: "Executive sedan",
    fitments: [reference("235/45 R18", "Official Pakistan specification for Sonata 2.0 and 2.5")],
    sources: [official("Hyundai Pakistan Sonata specification", "https://hyundai-nishat.com/wp-content/themes/hyundainishat/pdf/Sonata-2.0.pdf")],
  }),
  vehicle({
    make: "Hyundai", model: "Santa Fe", bodyStyle: "Hybrid SUV",
    fitments: [reference("235/55 R19", "Official reference for Santa Fe Hybrid Smart and Signature", { variants: "Smart and Signature" })],
    sources: [official("Hyundai Pakistan Santa Fe specification", "https://hyundai-nishat.com/santa-fe-specification/")],
  }),
  vehicle({
    make: "Hyundai", model: "Palisade", bodyStyle: "Large hybrid SUV",
    fitments: [reference("245/50 R20", "Reference for selected Palisade Hybrid wheel packages")],
    sources: [official("Hyundai Pakistan Palisade Hybrid", "https://hyundai-nishat.com/palisade/")],
  }),
  vehicle({
    make: "Hyundai", model: "Ioniq 5", bodyStyle: "Electric crossover",
    fitments: [reference("255/45 R20", "Official Pakistan-market Ioniq 5 reference")],
    sources: [official("Hyundai Pakistan Ioniq 5 specification", "https://hyundai-nishat.com/ioniq-5-specification/")],
  }),
  vehicle({
    make: "Hyundai", model: "Ioniq 6", bodyStyle: "Electric sedan",
    fitments: [reference("245/40 R20", "Official Pakistan-market Ioniq 6 reference")],
    sources: [official("Hyundai Pakistan Ioniq 6 specification", "https://hyundai-nishat.com/ioniq-6-specification/")],
  }),
  vehicle({
    make: "Hyundai", model: "Staria", bodyStyle: "MPV",
    fitments: [reference("235/55 R18", "Official Pakistan-market Staria HGS 3.5 AT reference", { variants: "HGS 3.5 AT" })],
    sources: [official("Hyundai Pakistan Staria specification", "https://hyundai-nishat.com/wp-content/themes/hyundainishat/pdf/Staria.pdf")],
  }),

  vehicle({
    make: "Changan", model: "Deepal S07", bodyStyle: "Electric crossover",
    fitments: [reference("255/45 R20", "Reference for selected Deepal S07 wheel packages")],
    sources: [official("Deepal Pakistan S07", "https://deepal.com.pk/s07")],
  }),
  vehicle({
    make: "Changan", model: "Deepal L07", bodyStyle: "Electric fastback",
    fitments: [reference("245/45 R19", "Reference for selected Deepal L07 wheel packages")],
    sources: [official("Deepal Pakistan L07", "https://deepal.com.pk/l7/")],
  }),
  vehicle({
    make: "Changan", model: "Karvaan", bodyStyle: "Mini MPV",
    fitments: [reference("175/70 R14", "Passenger-size reference for selected Karvaan examples; load specification needs checking")],
    searchIndex: false,
  }),
  vehicle({
    make: "Changan", model: "M9 Sherpa", bodyStyle: "One-ton pickup", market: "Current Pakistan-market commercial vehicle",
    fitments: [reference("175/70 R14LT", "Official Pakistan-market commercial-tyre specification", { years: "Current Pakistan model", sourceLabel: "Changan Pakistan specification", note: "Match the LT construction and complete load marking; a passenger tyre with similar dimensions is not an automatic substitute." })],
    sources: [official("Changan Pakistan M9 Sherpa specification", "https://changan.com.pk/m9-sherpa/")],
    buyingAdvice: ["State normal payload and road use when requesting a commercial-tyre quotation"],
  }),

  vehicle({
    make: "MG", model: "ZS", bodyStyle: "Compact crossover", market: "Current Pakistan-market petrol and hybrid range",
    fitments: [],
    sources: [official("MG Pakistan current ZS range", "https://mgmotors.com.pk/model/mg-zs")],
    searchIndex: false,
  }),
  vehicle({
    make: "MG", model: "ZS EV", bodyStyle: "Electric compact crossover", market: "Earlier Pakistan-market electric model",
    fitments: [reference("215/55 R17", "Official Pakistan-market ZS EV specification", { variants: "ZS EV Essence and Long Range", sourceLabel: "MG Pakistan official brochure" })],
    sources: [official("MG Pakistan ZS EV brochure", "https://mgmotors.com.pk/assets/brochure/Brochure-MG-ZS-EV.pdf")],
  }),
  vehicle({
    make: "MG", model: "MG4", bodyStyle: "Electric hatchback",
    fitments: [reference("215/50 R17", "Official reference for Excite 51"), reference("235/45 R18", "Official reference for Essence 64")],
    sources: [official("MG Pakistan MG4 EV brochure", "https://mgmotors.com.pk/assets/brochure/Brochure-MG4-EV.pdf")],
  }),
  vehicle({
    make: "MG", model: "MG5", bodyStyle: "Sedan / electric estate", market: "Imported and limited Pakistan-market examples",
    fitments: [reference("205/55 R16", "Reference for selected MG5 configurations"), reference("215/50 R17", "Reference for selected larger wheel packages")],
    searchIndex: false,
  }),

  vehicle({
    make: "Haval", model: "H6", bodyStyle: "SUV", market: "Pakistan-market petrol and hybrid variants",
    fitments: [
      reference("225/60 R18", "Official reference for H6 1.5T FWD", { variants: "1.5T FWD" }),
      reference("225/55 R19", "Official reference for H6 2.0T AWD and H6 HEV", { variants: "2.0T AWD and HEV" }),
    ],
    sources: [official("Haval Pakistan H6 brochure", "https://haval.pk/wp-content/themes/haval/Haval_brochure_H6_HEV.pdf")],
  }),
  vehicle({
    make: "Haval", model: "Jolion", bodyStyle: "Compact SUV",
    fitments: [],
    sources: [official("Haval Pakistan Jolion", "https://haval.pk/jolion/")],
    searchIndex: false,
  }),
  vehicle({
    make: "GWM", model: "ORA 03", bodyStyle: "Electric hatchback", market: "Current GWM Pakistan range; exact local trim must be confirmed",
    fitments: [reference("215/50 R18", "Official global-market reference for ORA 03 18-inch packages; verify the Pakistan vehicle", { sourceLabel: "GWM global-market brochure" })],
    sources: [
      official("GWM Pakistan current model range", "https://www.gwm-pakistan.com/"),
      { type: "Official global specification", title: "GWM ORA 03 brochure", url: "https://www.gwm.co.za/content/dam/gwm/pages/za/en/models/ora-03/ora-brochure627.pdf" },
    ],
    searchIndex: false,
  }),
  vehicle({
    make: "GWM", model: "ORA 07", bodyStyle: "Electric fastback", market: "Current GWM Pakistan range",
    summary: "The GWM ORA 07 is listed for Pakistan with a large alloy-wheel package, but the complete local sidewall code is not published in the source used here. Open this research page, then send a placard or tyre photo for exact verification.",
    fitments: [],
    sources: [official("GWM Pakistan current model range", "https://www.gwm-pakistan.com/")],
    searchIndex: false,
  }),
  vehicle({
    make: "GWM", model: "TANK 500", bodyStyle: "Seven-seat SUV", market: "Current GWM Pakistan range; local trim must be confirmed",
    fitments: [
      reference("265/60 R18", "Official global-market reference for a selected later TANK 500 specification; verify the Pakistan vehicle", { sourceLabel: "GWM global-market brochure" }),
      reference("265/50 R20", "Official global-market reference for a selected 20-inch TANK 500 package; verify the Pakistan vehicle", { sourceLabel: "GWM global-market brochure" }),
    ],
    sources: [
      official("GWM Pakistan current model range", "https://www.gwm-pakistan.com/"),
      { type: "Official global specification", title: "GWM TANK 500 specification", url: "https://www.gwm.co.za/content/dam/gwm/pages/za/en/models/tank-500/gwm_tank_500_brocture_new.pdf" },
    ],
    searchIndex: false,
    buyingAdvice: ["Match all four tyres, the full-size spare, load requirement and intended terrain"],
  }),

  vehicle({
    make: "OMODA", model: "7 SHS-P", bodyStyle: "Plug-in-hybrid crossover", market: "Current Pakistan-market model; local tyre profile must be checked",
    fitments: [reference("245/50 R20", "Official global reference for the 20-inch package; the Pakistan page lists 19- and 20-inch wheels", { sourceLabel: "OMODA official global manual" })],
    sources: [
      official("OMODA Pakistan 7 SHS-P", "https://www.omodajaecoo.pk/omoda-7-shs-p"),
      { type: "Official global specification", title: "OMODA 7 wheel and tyre specification", url: "https://omodaauto.co.uk/wp-content/uploads/2026/02/M38T_PHEV_RHD_OM_EN_UK_20251209.pdf" },
    ],
    searchIndex: false,
  }),
  vehicle({
    make: "OMODA", model: "E5", bodyStyle: "Electric crossover", market: "Current Pakistan-market model",
    summary: "The Pakistan-market OMODA E5 page confirms an 18-inch alloy-wheel package but does not publish the complete local tyre profile. Use this research page to identify the model, then send the placard or current sidewall for verification.",
    fitments: [],
    sources: [official("OMODA Pakistan E5", "https://www.omodajaecoo.pk/omoda-e5")],
    searchIndex: false,
  }),

  vehicle({
    make: "JAECOO", model: "J5 SHS-H", bodyStyle: "Hybrid crossover", market: "Current Pakistan-market model; local tyre profile must be checked",
    fitments: [reference("235/55 R18", "Official global reference for the 18-inch JAECOO 5 package; verify the Pakistan SHS-H vehicle", { sourceLabel: "JAECOO official global specification" })],
    sources: [
      official("JAECOO Pakistan J5 SHS-H", "https://www.omodajaecoo.pk/jaecoo-j5-shs-h"),
      { type: "Official global specification", title: "JAECOO 5 wheel and tyre specification", url: "https://jaecoo.co.uk/jaecoo-5/" },
    ],
    searchIndex: false,
  }),
  vehicle({
    make: "JAECOO", model: "J7 SHS-P", bodyStyle: "Plug-in-hybrid SUV", market: "Current Pakistan-market model; local tyre profile must be checked",
    fitments: [reference("235/50 R19", "Official global reference for the 19-inch JAECOO 7 package; verify the Pakistan SHS-P vehicle", { sourceLabel: "JAECOO official global specification" })],
    sources: [
      official("JAECOO Pakistan J7 SHS-P", "https://www.omodajaecoo.pk/jaecoo-j7-shs-p"),
      { type: "Official global specification", title: "JAECOO 7 wheel and tyre specification", url: "https://jaecoo.co.uk/jaecoo-7/" },
    ],
    searchIndex: false,
  }),
  vehicle({
    make: "JAECOO", model: "J6", bodyStyle: "Electric SUV", market: "Current Pakistan-market model",
    summary: "The Pakistan-market JAECOO J6 page confirms 19-inch alloy wheels but not the complete local tyre profile. This research page keeps the model discoverable while requiring a placard or sidewall photo before any quotation.",
    fitments: [],
    sources: [official("JAECOO Pakistan J6", "https://www.omodajaecoo.pk/jaecoo-j6")],
    searchIndex: false,
  }),

  vehicle({
    make: "Proton", model: "Saga", bodyStyle: "Sedan",
    fitments: [reference("185/60 R14", "Reference for selected Saga Standard variants"), reference("185/55 R15", "Reference for selected Saga Ace wheel packages")],
    sources: [official("Proton Pakistan Saga", "https://proton.com.pk/saga")],
    searchIndex: false,
  }),
  vehicle({
    make: "Proton", model: "X70", bodyStyle: "SUV",
    fitments: [reference("225/60 R18", "Reference for selected X70 Executive configurations"), reference("225/55 R19", "Reference for selected X70 Premium wheel packages")],
    sources: [official("Proton Pakistan X70", "https://proton.com.pk/x70")],
    searchIndex: false,
  }),
  vehicle({
    make: "Peugeot", model: "2008", bodyStyle: "Compact crossover",
    fitments: [reference("215/60 R17", "Official Pakistan specification for Active and Allure variants")],
    sources: [official("Peugeot Pakistan 2008 brochure", "https://www.peugeot-luckymotorcorp.com/app/uploads/2022/06/peugeot-2008.pdf")],
  }),

  vehicle({ make: "Daihatsu", model: "Move", bodyStyle: "Kei hatchback", market: "Japanese-import generations", fitments: [reference("155/65 R14", "Reference for selected Move variants"), reference("165/55 R15", "Reference for selected Move Custom variants")], searchIndex: false }),
  vehicle({ make: "Daihatsu", model: "Tanto", bodyStyle: "Kei tall wagon", market: "Japanese-import generations", fitments: [reference("155/65 R14", "Reference for selected Tanto variants"), reference("165/55 R15", "Reference for selected Tanto Custom variants")], searchIndex: false }),
  vehicle({ make: "Daihatsu", model: "Cast", bodyStyle: "Kei hatchback", market: "Japanese-import generations", fitments: [reference("165/60 R15", "Reference for selected Cast variants"), reference("165/50 R16", "Reference for selected Sport packages")], searchIndex: false }),
  vehicle({ make: "Daihatsu", model: "Rocky", bodyStyle: "Compact crossover", market: "Japanese-import generations", fitments: [reference("195/65 R16", "Reference for selected Rocky configurations"), reference("195/60 R17", "Reference for selected larger factory wheel packages")], searchIndex: false }),

  vehicle({ make: "Nissan", model: "Dayz", bodyStyle: "Kei hatchback", market: "Japanese-import generations", fitments: [reference("155/65 R14", "Reference for selected Dayz variants"), reference("165/55 R15", "Reference for selected Highway Star packages")], searchIndex: false }),
  vehicle({ make: "Nissan", model: "Note", bodyStyle: "Hybrid hatchback", market: "Japanese-import generations", fitments: [reference("185/65 R15", "Reference for selected Note e-Power variants"), reference("195/55 R16", "Reference for selected higher wheel packages")], searchIndex: false }),
  vehicle({ make: "Nissan", model: "Juke", bodyStyle: "Compact crossover", market: "Imported generations", fitments: [reference("215/55 R17", "Reference for selected Juke configurations"), reference("225/45 R19", "Reference for selected larger wheel packages")], searchIndex: false }),
  vehicle({ make: "Nissan", model: "X-Trail", bodyStyle: "SUV", market: "Imported and Pakistan-market examples", fitments: [reference("225/65 R17", "Reference for selected X-Trail configurations"), reference("235/60 R18", "Reference for selected higher wheel packages")], searchIndex: false }),
  vehicle({ make: "Nissan", model: "Roox", bodyStyle: "Kei tall wagon", market: "Japanese-import generations", fitments: [reference("155/65 R14", "Reference for selected Roox configurations"), reference("165/55 R15", "Reference for selected Highway Star packages")], searchIndex: false }),
  vehicle({ make: "Nissan", model: "Serena", bodyStyle: "Hybrid MPV", market: "Japanese-import generations", fitments: [reference("195/65 R15", "Reference for selected Serena configurations"), reference("205/50 R17", "Reference for selected larger factory wheel packages")], searchIndex: false }),

  vehicle({ make: "Mitsubishi", model: "eK Wagon", bodyStyle: "Kei hatchback", market: "Japanese-import generations", fitments: [reference("155/65 R14", "Reference for selected eK Wagon variants"), reference("165/55 R15", "Reference for selected Custom variants")], searchIndex: false }),
  vehicle({ make: "Mitsubishi", model: "Lancer", bodyStyle: "Sedan", market: "Older Pakistan-road and imported generations", fitments: [reference("195/60 R15", "Reference for selected Lancer configurations"), reference("205/55 R16", "Reference for selected larger wheel packages")], searchIndex: false }),
  vehicle({ make: "Mitsubishi", model: "Mirage", bodyStyle: "Hatchback / sedan", market: "Imported generations", fitments: [reference("165/65 R14", "Reference for selected Mirage configurations"), reference("175/55 R15", "Reference for selected higher wheel packages")], searchIndex: false }),
  vehicle({ make: "Mitsubishi", model: "Pajero", bodyStyle: "SUV", market: "Imported generations", fitments: [reference("265/65 R17", "Reference for selected Pajero configurations"), reference("265/60 R18", "Reference for selected larger wheel packages")], searchIndex: false }),

  vehicle({ make: "Chery", model: "Tiggo 4 Pro", bodyStyle: "Compact SUV", fitments: [reference("215/60 R17", "Common reference for selected Tiggo 4 Pro configurations")], sources: [official("Chery Pakistan vehicle range", "https://www.cherypakistan.com/")], searchIndex: false }),
  vehicle({ make: "Chery", model: "Tiggo 8 Pro", bodyStyle: "Seven-seat SUV", fitments: [reference("235/55 R18", "Common reference for selected Tiggo 8 Pro configurations")], sources: [official("Chery Pakistan vehicle range", "https://www.cherypakistan.com/")], searchIndex: false }),
  vehicle({ make: "BAIC", model: "BJ40 Plus", bodyStyle: "Off-road SUV", fitments: [reference("265/65 R17", "Official global reference; Pakistan-local trim must still be checked", { sourceLabel: "BAIC global specification" })], sources: [{ type: "Official global specification", title: "BAIC BJ40 Plus specification", url: "https://www.baicglobal.com/file/upload/2022/08/16/BJ40%20PLUS%20Specifications_20220816135438A007.pdf" }], searchIndex: false }),
  vehicle({ make: "BAIC", model: "D20", bodyStyle: "Hatchback / sedan", fitments: [reference("195/55 R16", "Reference for selected D20 configurations")], searchIndex: false }),
  vehicle({ make: "DFSK", model: "Glory 580", bodyStyle: "Seven-seat SUV", fitments: [reference("225/55 R18", "Reference for selected Glory 580 configurations")], searchIndex: false }),
  vehicle({ make: "DFSK", model: "Seres 3", bodyStyle: "Electric SUV", fitments: [reference("225/55 R18", "Reference for selected Seres 3 configurations")], searchIndex: false }),
  vehicle({ make: "Prince", model: "Pearl", bodyStyle: "City hatchback", fitments: [reference("155/65 R13", "Official Pakistan-market Prince Pearl reference")], sources: [official("Regal Automobiles Prince Pearl specification", "https://regalautomobiles.com/prince-pearl/")] }),
  vehicle({ make: "Isuzu", model: "D-Max", bodyStyle: "Pickup", fitments: [reference("255/65 R17", "Official reference for V-Cross G 3.0 MT and Hi-Rider DC 3.0 MT", { variants: "V-Cross G 3.0 MT and Hi-Rider DC 3.0 MT" }), reference("265/60 R18", "Official reference for X-Terrain 3.0 AT and V-Cross G 3.0 AT", { variants: "X-Terrain 3.0 AT and V-Cross G 3.0 AT" })], sources: [official("Isuzu Pakistan D-Max catalogue", "https://pickup.isuzupakistan.com/webImages/modeliner/DMAX-XTERRAIN-CATALOGUE.pdf")], buyingAdvice: ["Confirm load index, cargo use and terrain before choosing a highway or all-terrain pattern"] }),
  vehicle({ make: "Isuzu", model: "MU-X", bodyStyle: "SUV", fitments: [reference("255/60 R18", "Reference for selected MU-X configurations"), reference("265/60 R18", "Reference for selected market variations")], searchIndex: false }),
  vehicle({ make: "BYD", model: "Atto 3", bodyStyle: "Electric crossover", fitments: [reference("235/50 R18", "Reference for selected Atto 3 wheel packages")], sources: [official("BYD Pakistan Atto 3", "https://byd-mega.com/vehicles/atto-3")], searchIndex: false }),
  vehicle({ make: "BYD", model: "Seal", bodyStyle: "Electric sedan", fitments: [reference("225/50 R18", "Reference for selected Seal wheel packages"), reference("235/45 R19", "Reference for selected performance wheel packages")], sources: [official("BYD Pakistan Seal", "https://byd-mega.com/vehicles/seal")], searchIndex: false }),
  vehicle({ make: "JAC", model: "T9 Hunter", bodyStyle: "Pickup", fitments: [reference("265/60 R18", "Reference for selected T9 Hunter configurations")], searchIndex: false }),
  vehicle({ make: "Jetour", model: "Dashing", bodyStyle: "Crossover", fitments: [reference("255/45 R20", "Reference for selected Dashing configurations")], searchIndex: false }),
  vehicle({ make: "Jetour", model: "X70 Plus", bodyStyle: "Seven-seat SUV", fitments: [reference("255/45 R20", "Reference for selected X70 Plus configurations")], searchIndex: false }),
  vehicle({ make: "FAW", model: "V2", bodyStyle: "Hatchback", market: "Older locally sold examples", fitments: [reference("175/65 R14", "Reference for selected FAW V2 configurations")], searchIndex: false }),
  vehicle({ make: "FAW", model: "Sirius", bodyStyle: "MPV", market: "Older Pakistan-road examples", fitments: [reference("205/55 R16", "Reference for selected FAW Sirius configurations")], searchIndex: false }),
  vehicle({ make: "Honri", model: "i200", bodyStyle: "Electric city car", market: "Pakistan-market examples", fitments: [], searchIndex: false }),
  vehicle({ make: "Honri", model: "i300", bodyStyle: "Electric city car", market: "Pakistan-market examples", fitments: [], searchIndex: false }),
  vehicle({ make: "GUGO", model: "Box EV", bodyStyle: "Electric city hatchback", market: "Newer Pakistan-market examples", fitments: [], searchIndex: false }),
  vehicle({ make: "GUGO", model: "250", bodyStyle: "Electric commercial van", market: "Newer Pakistan-market examples", fitments: [reference("185/70 R14", "Market reference for selected GUGO 250 versions; confirm the commercial load requirement")], searchIndex: false }),
  vehicle({ make: "Dongfeng", model: "007", bodyStyle: "Electric sedan", market: "Newer Pakistan-market examples", fitments: [reference("235/45 R19", "Market reference for selected Dongfeng 007 versions; verify the supplied trim")], searchIndex: false }),
  vehicle({ make: "Dongfeng", model: "Box", bodyStyle: "Electric hatchback", market: "Newer Pakistan-market examples", fitments: [], searchIndex: false }),
];

export const getVehicleMake = (slug) =>
  VEHICLE_MAKES.find((make) => make.slug === slugify(slug)) || null;

export default ADDITIONAL_PAKISTAN_VEHICLES;
