import PRODUCTS from "./productsData.js";
import { TYRE_SIZE_MANIFEST } from "./tyreSizeManifest.js";

export const SEO_CONTENT_UPDATED = "2026-10-04";

export const FITMENT_NOTICE =
  "Tyre sizes can change by model year, trim, import specification, wheel package and previous modification. Confirm the size, load index and speed rating on the vehicle placard or owner's manual, then have the complete fitment checked before purchase.";

export const AVAILABILITY_NOTICE =
  "Brand, pattern, manufacturing country, production date, warranty, price and stock must be confirmed for the exact tyre offered. A brand's country of origin does not prove where an individual tyre was manufactured.";

const COMMON_BUYER_CHECKS = [
  "Match the complete size, load index and speed rating required by the vehicle",
  "Inspect the exact tyre's sidewall for manufacturing country and date code",
  "Ask whether the quoted amount is per tyre or for a complete set",
  "Confirm current stock, fitting, balancing and warranty terms before payment",
];

const makeBrand = ({
  slug,
  name,
  brandOrigin,
  marketPosition,
  summary,
  knownFor,
  exampleFamilies,
}) => {
  const categoryLink = ["dunlop", "yokohama", "bridgestone", "toyo", "falken", "nitto"].includes(slug)
    ? { label: "Compare Japanese tyre options", href: "/tyres/japanese" }
    : ["aplus", "sailun", "linglong", "triangle", "roadx"].includes(slug)
      ? { label: "Compare Chinese tyre options", href: "/tyres/chinese" }
      : marketPosition === "Premium"
        ? { label: "Compare premium tyre options", href: "/tyres/premium" }
        : null;
  return ({
  slug,
  name,
  title: `${name} Tyres`,
  seoTitle: `${name} Tyres in Lahore | Sizes and Current Rates | Wheels & Wheels`,
  metaDescription: `Explore ${name} tyre options in Lahore by size and vehicle. Ask Wheels & Wheels to verify exact fitment, manufacturing details, current stock and rate.`,
  heroTitle: `${name} tyres in Lahore`,
  brandOrigin,
  marketPosition,
  summary,
  knownFor,
  exampleFamilies,
  buyerChecks: COMMON_BUYER_CHECKS,
  availabilityNote: AVAILABILITY_NOTICE,
  relatedLinks: [
    ...(categoryLink ? [categoryLink] : []),
    { label: "Browse tyre sizes", href: "/tyre-sizes" },
    { label: "Find tyres by vehicle", href: "/vehicles" },
    { label: "Ask for a verified quote", href: "/quote" },
  ],
  });
};

export const SEO_BRANDS = [
  makeBrand({
    slug: "michelin",
    name: "Michelin",
    brandOrigin: "French brand; manufacturing country varies by product and market",
    marketPosition: "Premium",
    summary:
      "Michelin supplies passenger-car, performance and SUV tyre ranges. Buyers should compare the exact pattern and specification rather than judging a tyre by the brand name alone.",
    knownFor: ["Touring tyres", "Performance tyres", "SUV and light-truck ranges"],
    exampleFamilies: ["Primacy", "Pilot Sport", "Latitude and LTX"],
  }),
  makeBrand({
    slug: "pirelli",
    name: "Pirelli",
    brandOrigin: "Italian brand; manufacturing country varies by product and market",
    marketPosition: "Premium",
    summary:
      "Pirelli offers touring, performance and SUV tyres in selected fitments. The correct load, speed and homologation markings matter when choosing an option for a premium vehicle.",
    knownFor: ["Performance-oriented ranges", "Touring tyres", "SUV fitments"],
    exampleFamilies: ["Cinturato", "P Zero", "Scorpion"],
  }),
  makeBrand({
    slug: "continental",
    name: "Continental",
    brandOrigin: "German brand; manufacturing country varies by product and market",
    marketPosition: "Premium",
    summary:
      "Continental makes comfort, touring and performance tyre families. Pattern availability in Pakistan varies, so the exact model, size and sidewall specification should be checked before ordering.",
    knownFor: ["Comfort-focused ranges", "Touring tyres", "Performance tyres"],
    exampleFamilies: ["UltraContact", "PremiumContact", "ComfortContact"],
  }),
  makeBrand({
    slug: "dunlop",
    name: "Dunlop",
    brandOrigin:
      "International brand with market-dependent ownership and manufacturing; verify the exact tyre",
    marketPosition: "Mid-range to premium, depending on pattern",
    summary:
      "Dunlop-branded tyres cover compact cars, sedans, performance vehicles and SUVs. Product naming and production source can differ by region, making sidewall verification important.",
    knownFor: ["Passenger-car touring ranges", "Performance ranges", "SUV patterns"],
    exampleFamilies: ["SP Touring", "SP Sport", "Grandtrek"],
  }),
  makeBrand({
    slug: "yokohama",
    name: "Yokohama",
    brandOrigin: "Japanese brand; manufacturing country varies by product and market",
    marketPosition: "Mid-range to premium",
    summary:
      "Yokohama supplies passenger, performance and SUV tyre families. Compare the exact tread family because comfort, efficiency and all-terrain products are designed for different uses.",
    knownFor: ["Passenger-car touring tyres", "Performance tyres", "SUV and all-terrain ranges"],
    exampleFamilies: ["BluEarth", "ADVAN", "Geolandar"],
  }),
  makeBrand({
    slug: "bridgestone",
    name: "Bridgestone",
    brandOrigin: "Japanese brand; manufacturing country varies by product and market",
    marketPosition: "Mid-range to premium",
    summary:
      "Bridgestone produces tyres for compact cars, sedans, SUVs and commercial applications. Each range has a different purpose, so fitment and performance category should be confirmed together.",
    knownFor: ["Touring ranges", "Efficiency-focused ranges", "SUV and 4x4 tyres"],
    exampleFamilies: ["Turanza", "Ecopia", "Dueler"],
  }),
  makeBrand({
    slug: "toyo",
    name: "Toyo",
    brandOrigin: "Japanese brand; manufacturing country varies by product and market",
    marketPosition: "Mid-range to premium",
    summary:
      "Toyo offers touring, performance and SUV products across selected sizes. Pattern, load rating and intended road use should be matched to the vehicle before purchase.",
    knownFor: ["Performance tyres", "Touring tyres", "SUV and all-terrain patterns"],
    exampleFamilies: ["Proxes", "NanoEnergy", "Open Country"],
  }),
  makeBrand({
    slug: "falken",
    name: "Falken",
    brandOrigin: "Japanese brand; manufacturing country varies by product and market",
    marketPosition: "Mid-range to premium",
    summary:
      "Falken sells passenger-car, performance and SUV tyre ranges. Availability is fitment-specific, particularly for larger wheels and lower-profile sizes.",
    knownFor: ["Performance ranges", "Touring tyres", "SUV and all-terrain ranges"],
    exampleFamilies: ["Azenis", "ZIEX", "Wildpeak"],
  }),
  makeBrand({
    slug: "nitto",
    name: "Nitto",
    brandOrigin: "Japanese brand; manufacturing country varies by product and market",
    marketPosition: "Mid-range to premium",
    summary:
      "Nitto offers passenger, performance, SUV and all-terrain tyre families in selected fitments. Large-diameter availability is size-specific, so confirm the exact pattern, ratings and production details.",
    knownFor: ["Performance tyres", "SUV road tyres", "All-terrain and off-road ranges"],
    exampleFamilies: ["NT420V", "NT555", "Terra Grappler"],
  }),
  makeBrand({
    slug: "aplus",
    name: "APLUS",
    brandOrigin: "Chinese brand; verify manufacturing details on the exact tyre",
    marketPosition: "Value-focused",
    summary:
      "APLUS is commonly considered by price-conscious buyers. Selection should focus on the exact pattern, required rating, recent condition and documented seller terms rather than origin alone.",
    knownFor: ["Passenger-car sizes", "Value-focused replacements", "Selected SUV fitments"],
    exampleFamilies: ["A609", "A610", "A919"],
  }),
  makeBrand({
    slug: "sailun",
    name: "Sailun",
    brandOrigin: "Chinese brand; manufacturing country can vary by product",
    marketPosition: "Value to mid-range",
    summary:
      "Sailun offers passenger-car, performance, SUV and light-commercial tyre families. Verify the exact pattern because products with the same brand can serve very different vehicles and road uses.",
    knownFor: ["Passenger-car ranges", "Performance-oriented ranges", "SUV and commercial tyres"],
    exampleFamilies: ["Atrezzo", "Terramax", "Commercio"],
  }),
  makeBrand({
    slug: "linglong",
    name: "Linglong",
    brandOrigin: "Chinese brand; verify manufacturing details on the exact tyre",
    marketPosition: "Value-focused",
    summary:
      "Linglong supplies passenger-car and SUV tyres in a broad set of sizes. Buyers should compare sidewall ratings, production date, seller support and the intended use of the exact pattern.",
    knownFor: ["Passenger-car replacements", "Selected performance sizes", "SUV fitments"],
    exampleFamilies: ["Green-Max", "Comfort Master", "Crosswind"],
  }),
  makeBrand({
    slug: "triangle",
    name: "Triangle",
    brandOrigin: "Chinese brand; verify manufacturing details on the exact tyre",
    marketPosition: "Value to mid-range",
    summary:
      "Triangle produces passenger-car, performance, SUV and commercial tyre lines. Suitability depends on the individual pattern and specification, not only the brand label.",
    knownFor: ["Passenger-car sizes", "Performance-oriented patterns", "SUV and commercial ranges"],
    exampleFamilies: ["EffeXSport", "AdvanteX", "AgileX"],
  }),
  makeBrand({
    slug: "roadx",
    name: "RoadX",
    brandOrigin: "Chinese-origin brand; verify manufacturing details on the exact tyre",
    marketPosition: "Value to mid-range",
    summary:
      "RoadX offers passenger and SUV patterns in selected fitments. Confirm the exact model, load and speed rating, date code and after-sales terms before comparing its price with another option.",
    knownFor: ["Passenger-car replacements", "SUV highway patterns", "Selected all-terrain sizes"],
    exampleFamilies: ["RXMotion", "RXQuest", "RXFrost"],
  }),
];

const makeVehicle = ({
  slug,
  make,
  model,
  yearScope,
  summary,
  commonSizes,
  buyingAdvice,
}) => ({
  slug,
  make,
  model,
  name: `${make} ${model}`,
  title: `Tyres for ${make} ${model}`,
  seoTitle: `Tyres for ${make} ${model} in Lahore | Size Guide | Wheels & Wheels`,
  metaDescription: `Check reference tyre sizes and request verified options for a ${make} ${model} in Lahore. Final size, rating and wheel fitment must be confirmed for the exact car.`,
  heroTitle: `Find tyres for ${make} ${model}`,
  yearScope,
  summary,
  verificationRequired: true,
  verificationNote: FITMENT_NOTICE,
  commonSizes: commonSizes.map(({ size, context }) => ({
    size,
    context,
    status: "verify",
    note: "Reference only. Verify against the exact vehicle placard, manual and fitted wheel before purchase.",
  })),
  buyingAdvice,
  relatedLinks: [
    { label: "Browse all tyre sizes", href: "/tyre-sizes" },
    { label: "Compare tyre brands", href: "/brands" },
    { label: "Request fitment confirmation", href: "/quote" },
  ],
});

export const SEO_VEHICLES = [
  makeVehicle({
    slug: "suzuki-alto",
    make: "Suzuki",
    model: "Alto",
    yearScope: "Pakistan-market and imported variants; confirm generation and trim",
    summary:
      "Alto fitment varies between older local cars, newer Pakistan-market cars and imported Japanese versions. Do not select by model name without checking the car itself.",
    commonSizes: [
      { size: "145/80 R13", context: "Common reference for newer Pakistan-market variants" },
      { size: "155/65 R14", context: "Seen on some imported or changed-wheel variants" },
      { size: "165/70 R13", context: "Commonly discussed alternate; clearance and diameter require checking" },
    ],
    buyingAdvice: ["Prioritize correct load rating and fuel-economy goals", "Check clearance before considering a wider alternate"],
  }),
  makeVehicle({
    slug: "suzuki-cultus",
    make: "Suzuki",
    model: "Cultus",
    yearScope: "Old-shape and 2017-onward cars use different references",
    summary:
      "Cultus spans substantially different generations. Identify the generation and original wheel before comparing comfort, grip or upsize options.",
    commonSizes: [
      { size: "165/65 R14", context: "Common reference for 2017-onward Pakistan-market cars" },
      { size: "155/80 R13", context: "Reference found on some earlier-generation configurations" },
      { size: "175/65 R15", context: "Possible changed-wheel setup; not an automatic replacement" },
    ],
    buyingAdvice: ["Separate old-shape and new-shape fitments", "Keep overall diameter and wheel width within a verified safe combination"],
  }),
  makeVehicle({
    slug: "suzuki-wagon-r",
    make: "Suzuki",
    model: "Wagon R",
    yearScope: "Pakistan-market and Japanese-import versions differ",
    summary:
      "Wagon R listings can refer to local tall-hatchback models or Japanese imports. Verify the generation, wheel diameter and placard before quoting a size.",
    commonSizes: [
      { size: "145/80 R13", context: "Common Pakistan-market reference" },
      { size: "165/70 R13", context: "Commonly considered wider alternate; requires clearance verification" },
      { size: "155/65 R14", context: "Reference for selected imported or changed-wheel examples" },
    ],
    buyingAdvice: ["Avoid assuming an imported car matches the local model", "Consider steering weight and clearance before increasing width"],
  }),
  makeVehicle({
    slug: "suzuki-swift",
    make: "Suzuki",
    model: "Swift",
    yearScope: "Generation and wheel package must be identified",
    summary:
      "Swift tyre sizes differ between earlier and current Pakistan-market generations. The correct starting point is the placard and fitted wheel, not a generic model list.",
    commonSizes: [
      { size: "185/60 R15", context: "Reference associated with selected earlier configurations" },
      { size: "185/55 R16", context: "Reference associated with selected newer configurations" },
      { size: "195/55 R16", context: "Possible alternate on compatible wheels; verify diameter and clearance" },
    ],
    buyingAdvice: ["Identify model generation before comparing prices", "Confirm rim width and steering clearance for alternate sizes"],
  }),
  makeVehicle({
    slug: "suzuki-mehran",
    make: "Suzuki",
    model: "Mehran",
    yearScope: "Multiple production years and modified wheels remain on the road",
    summary:
      "Many Mehran cars have had wheels or suspension changed over time. Inspect the current setup and placard before replacing or widening the tyre.",
    commonSizes: [
      { size: "145/70 R12", context: "Common reference for standard-size replacements" },
      { size: "155/70 R12", context: "Commonly considered wider replacement; verify wheel and clearance" },
    ],
    buyingAdvice: ["Inspect older rims and valves during fitting", "Do not trade steering clearance for width without a physical check"],
  }),
  makeVehicle({
    slug: "toyota-corolla",
    make: "Toyota",
    model: "Corolla",
    yearScope: "Generation, trim and factory wheel package vary widely",
    summary:
      "Corolla is sold across many generations and trims in Pakistan. Quote by model year, variant and wheel package rather than treating every Corolla as one fitment.",
    commonSizes: [
      { size: "195/65 R15", context: "Common reference across several sedan configurations" },
      { size: "205/55 R16", context: "Reference for selected higher-trim or changed-wheel configurations" },
      { size: "205/60 R16", context: "Seen on selected configurations; confirm diameter before use" },
    ],
    buyingAdvice: ["Ask for the exact generation and trim", "Compare comfort, road noise and wet grip within the verified size"],
  }),
  makeVehicle({
    slug: "toyota-yaris",
    make: "Toyota",
    model: "Yaris",
    yearScope: "Pakistan-market sedan and imported hatchback versions differ",
    summary:
      "The Yaris name covers a Pakistan-market sedan and several imported generations. Confirm the body style, year and wheel package before using a reference size.",
    commonSizes: [
      { size: "185/60 R15", context: "Common reference for selected Pakistan-market sedan variants" },
      { size: "195/60 R16", context: "Reference for selected wheel packages or alternatives; verify first" },
    ],
    buyingAdvice: ["State sedan or imported hatchback when requesting a quote", "Keep the factory load and speed requirements"],
  }),
  makeVehicle({
    slug: "toyota-fortuner",
    make: "Toyota",
    model: "Fortuner",
    yearScope: "Generation, trim and wheel diameter vary",
    summary:
      "Fortuner tyres must support SUV load requirements and the intended road use. Highway, all-terrain and changed-wheel setups should not be mixed without checking specifications.",
    commonSizes: [
      { size: "265/65 R17", context: "Reference for selected generations or trims" },
      { size: "265/60 R18", context: "Common reference for selected later wheel packages" },
    ],
    buyingAdvice: ["Confirm load index and spare-wheel compatibility", "Choose highway or all-terrain pattern according to real use"],
  }),
  makeVehicle({
    slug: "toyota-hilux-revo",
    make: "Toyota",
    model: "Hilux / Revo",
    yearScope: "Work, passenger and performance-style trims can differ",
    summary:
      "Hilux and Revo fitment decisions must account for load, terrain and trim. Verify the placard before selecting a highway or all-terrain tyre.",
    commonSizes: [
      { size: "265/65 R17", context: "Reference for selected trims" },
      { size: "265/60 R18", context: "Reference for selected later or higher-trim wheel packages" },
      { size: "265/70 R16", context: "Reference for selected work-oriented or earlier configurations" },
    ],
    buyingAdvice: ["Do not under-specify load capacity", "Match tread category to motorway, city, construction-site or off-road use"],
  }),
  makeVehicle({
    slug: "honda-city",
    make: "Honda",
    model: "City",
    yearScope: "Several generations and trims are active in Pakistan",
    summary:
      "Honda City tyre selection changes with generation and wheel package. Verify the exact car before comparing standard and wider alternatives.",
    commonSizes: [
      { size: "175/65 R15", context: "Common reference for selected Pakistan-market generations" },
      { size: "185/60 R15", context: "Reference for selected trims or commonly discussed alternatives" },
      { size: "185/55 R16", context: "Reference for selected wheel packages; verify carefully" },
    ],
    buyingAdvice: ["Confirm generation and original rim size", "Balance comfort and grip without exceeding verified clearance"],
  }),
  makeVehicle({
    slug: "honda-civic",
    make: "Honda",
    model: "Civic",
    yearScope: "Generation and trim determine 15-, 16- or 17-inch references",
    summary:
      "Civic models in Pakistan span multiple generations, turbo and non-turbo trims, and changed-wheel cars. A year and variant are essential for an accurate quote.",
    commonSizes: [
      { size: "195/65 R15", context: "Reference for selected earlier-generation configurations" },
      { size: "215/55 R16", context: "Reference for selected later configurations" },
      { size: "215/50 R17", context: "Reference for selected higher-trim wheel packages" },
    ],
    buyingAdvice: ["Check whether the car retains factory wheels", "Match speed and load ratings before comparing performance patterns"],
  }),
  makeVehicle({
    slug: "honda-br-v",
    make: "Honda",
    model: "BR-V",
    yearScope: "Confirm trim, year and wheel package",
    summary:
      "BR-V tyre selection should account for passenger load and the exact factory wheel. Verify the placard before considering an alternate size.",
    commonSizes: [
      { size: "195/60 R16", context: "Common reference for selected Pakistan-market configurations" },
      { size: "205/55 R16", context: "Possible alternate on compatible wheels; requires full check" },
    ],
    buyingAdvice: ["Prioritize verified load capacity", "Check clearance with passengers and luggage in mind"],
  }),
  makeVehicle({
    slug: "kia-sportage",
    make: "Kia",
    model: "Sportage",
    yearScope: "Generation, drivetrain and trim can change wheel size",
    summary:
      "Sportage fitments vary by generation and trim. Confirm the exact wheel package and whether all four tyres must be closely matched for the drivetrain.",
    commonSizes: [
      { size: "225/55 R18", context: "Common reference for selected Pakistan-market trims" },
      { size: "245/45 R19", context: "Reference for selected larger-wheel packages" },
    ],
    buyingAdvice: ["Keep all four tyres compatible with drivetrain requirements", "Confirm load rating and spare-wheel strategy"],
  }),
  makeVehicle({
    slug: "kia-picanto",
    make: "Kia",
    model: "Picanto",
    yearScope: "Confirm local or imported specification and trim",
    summary:
      "Picanto tyre quotes should begin with the exact model year and wheel size. Avoid assuming that every imported and locally sold car shares one specification.",
    commonSizes: [
      { size: "165/60 R14", context: "Common reference for selected Pakistan-market configurations" },
      { size: "175/65 R14", context: "Possible alternate or market variation; verify before use" },
    ],
    buyingAdvice: ["Check the placard before moving to a wider tyre", "Consider city comfort and steering effort"],
  }),
  makeVehicle({
    slug: "hyundai-tucson",
    make: "Hyundai",
    model: "Tucson",
    yearScope: "Generation, drivetrain and trim affect fitment",
    summary:
      "Tucson wheel packages differ by trim and generation. Verify all four positions, load rating and drivetrain requirements before ordering.",
    commonSizes: [
      { size: "225/55 R18", context: "Common reference for selected Pakistan-market trims" },
      { size: "245/45 R19", context: "Reference for selected larger-wheel packages" },
    ],
    buyingAdvice: ["Use matching specifications across the axle and drivetrain", "Choose a pattern suited to actual city and motorway use"],
  }),
  makeVehicle({
    slug: "hyundai-elantra",
    make: "Hyundai",
    model: "Elantra",
    yearScope: "Generation and trim must be confirmed",
    summary:
      "Elantra tyre size and performance requirements vary with generation and wheel package. Check the exact car before comparing touring and performance options.",
    commonSizes: [
      { size: "205/55 R16", context: "Common reference for selected sedan configurations" },
      { size: "225/45 R17", context: "Reference for selected higher-trim wheel packages" },
    ],
    buyingAdvice: ["Confirm wheel diameter before requesting a quote", "Compare comfort and wet braking within the correct specification"],
  }),
  makeVehicle({
    slug: "changan-alsvin",
    make: "Changan",
    model: "Alsvin",
    yearScope: "Trim and wheel package must be confirmed",
    summary:
      "Alsvin variants may use different wheels. Verify the tyre placard and current rim before choosing standard or alternate options.",
    commonSizes: [
      { size: "185/55 R15", context: "Common reference for selected Pakistan-market trims" },
      { size: "195/55 R15", context: "Possible alternate; diameter and clearance require checking" },
    ],
    buyingAdvice: ["Identify the exact trim", "Do not increase width without checking steering and body clearance"],
  }),
  makeVehicle({
    slug: "changan-oshan-x7",
    make: "Changan",
    model: "Oshan X7",
    yearScope: "Trim and production specification must be checked",
    summary:
      "Oshan X7 tyre selection requires the exact rim, load rating and variant. Larger SUV tyres should be compared by specification and intended use, not price alone.",
    commonSizes: [
      { size: "225/55 R19", context: "Common reference for selected Pakistan-market configurations" },
      { size: "235/55 R19", context: "Possible market variation or alternate; verify before use" },
    ],
    buyingAdvice: ["Confirm load index and full tyre dimensions", "Check replacement availability before changing from the factory size"],
  }),
  makeVehicle({
    slug: "mg-hs",
    make: "MG",
    model: "HS",
    yearScope: "Variant and model year can affect wheel specification",
    summary:
      "MG HS fitment should be verified against the exact trim and wheel. Matching load, speed and dimensional requirements is essential for a crossover replacement.",
    commonSizes: [
      { size: "235/50 R18", context: "Common reference for selected configurations" },
      { size: "235/45 R19", context: "Reference for selected larger-wheel packages" },
    ],
    buyingAdvice: ["Confirm the full sidewall specification", "Avoid mixing substantially different tread designs across axles"],
  }),
  makeVehicle({
    slug: "daihatsu-mira",
    make: "Daihatsu",
    model: "Mira",
    yearScope: "Japanese-import generations and trims vary considerably",
    summary:
      "Mira imports arrive in several generations and wheel configurations. The auction year or registration year alone is not enough to determine tyre size.",
    commonSizes: [
      { size: "145/80 R13", context: "Reference found on selected generations" },
      { size: "155/65 R14", context: "Reference found on selected later or higher-trim imports" },
      { size: "165/55 R15", context: "Reference for selected wheel packages; verify carefully" },
    ],
    buyingAdvice: ["Read the actual placard on the imported vehicle", "Check wheel width and body clearance before changing size"],
  }),
  makeVehicle({
    slug: "haval-h6",
    make: "Haval",
    model: "H6",
    yearScope: "Powertrain, trim and model year can change wheel fitment",
    summary:
      "Haval H6 variants can have different wheel packages. Confirm the exact specification, including load and speed ratings, before sourcing replacements.",
    commonSizes: [
      { size: "225/60 R18", context: "Reference for selected configurations" },
      { size: "225/55 R19", context: "Reference for selected larger-wheel packages" },
    ],
    buyingAdvice: ["State the exact variant, including hybrid where relevant", "Match all four tyres to drivetrain and vehicle requirements"],
  }),
];

const SIZE_CHECKLIST = [
  "Verify the complete size on the placard or owner's manual",
  "Match load index and speed rating, not just width, profile and rim",
  "Confirm wheel width, clearance and overall diameter before changing size",
  "Compare current price, date code, manufacturing country and warranty for the exact tyre",
];

const makeSize = ({ slug, size, width, aspectRatio, rim, summary, applications }) => ({
  slug,
  size,
  name: `${size} Tyres`,
  title: `${size} Tyres in Lahore`,
  seoTitle: `${size} Tyres in Lahore | Brands and Current Rates | Wheels & Wheels`,
  metaDescription: `Compare available ${size} tyres in Lahore across value, Japanese and premium brands. Confirm vehicle fitment, ratings, stock and today's rate before purchase.`,
  heroTitle: `${size} tyre options`,
  width,
  aspectRatio,
  rim,
  summary,
  verificationRequired: true,
  verificationNote: FITMENT_NOTICE,
  commonApplications: applications.map((application) => ({
    application,
    status: "verify",
    note: "Vehicle reference only; model year, trim and placard must be checked.",
  })),
  shoppingChecklist: SIZE_CHECKLIST,
  relatedLinks: [
    { label: "Find tyres by vehicle", href: "/vehicles" },
    { label: "Compare tyre brands", href: "/brands" },
    { label: "Request current options", href: "/quote" },
  ],
});

const CURATED_SEO_SIZES = [
  makeSize({
    slug: "145-70-r12",
    size: "145/70 R12",
    width: 145,
    aspectRatio: 70,
    rim: 12,
    summary: "A compact 12-inch passenger-car size. Older vehicles may have changed wheels, so inspect the current setup before replacement.",
    applications: ["Selected Suzuki Mehran configurations", "Selected older compact-car configurations"],
  }),
  makeSize({
    slug: "155-70-r12",
    size: "155/70 R12",
    width: 155,
    aspectRatio: 70,
    rim: 12,
    summary: "A 12-inch compact-car size frequently compared as a replacement or wider option. Clearance and wheel width still require verification.",
    applications: ["Selected older compact cars", "Some changed-wheel Suzuki Mehran setups"],
  }),
  makeSize({
    slug: "145-80-r13",
    size: "145/80 R13",
    width: 145,
    aspectRatio: 80,
    rim: 13,
    summary: "A narrow 13-inch size used by selected small hatchbacks. Buyers often prioritize city comfort and low running cost in this fitment.",
    applications: ["Selected Suzuki Alto variants", "Selected Suzuki Wagon R variants", "Selected Daihatsu Mira imports"],
  }),
  makeSize({
    slug: "165-70-r13",
    size: "165/70 R13",
    width: 165,
    aspectRatio: 70,
    rim: 13,
    summary: "A common 13-inch replacement size for compact cars and a frequently discussed alternate. An alternate is not automatically safe for every car.",
    applications: ["Selected compact hatchbacks", "Possible alternate for selected Alto or Wagon R setups"],
  }),
  makeSize({
    slug: "165-65-r14",
    size: "165/65 R14",
    width: 165,
    aspectRatio: 65,
    rim: 14,
    summary: "A 14-inch compact-car size used on selected hatchbacks. Verify the generation because similarly named cars can use different wheels.",
    applications: ["Selected Suzuki Cultus configurations", "Selected imported compact cars"],
  }),
  makeSize({
    slug: "185-65-r14",
    size: "185/65 R14",
    width: 185,
    aspectRatio: 65,
    rim: 14,
    summary: "A 14-inch passenger-car size available across value and established international brands. Compare the exact rating and pattern.",
    applications: ["Selected older sedans", "Selected compact and family-car configurations"],
  }),
  makeSize({
    slug: "175-65-r15",
    size: "175/65 R15",
    width: 175,
    aspectRatio: 65,
    rim: 15,
    summary: "A 15-inch size used by selected compact sedans and hatchbacks. Model generation and trim remain essential fitment checks.",
    applications: ["Selected Honda City configurations", "Selected compact-sedan configurations"],
  }),
  makeSize({
    slug: "185-65-r15",
    size: "185/65 R15",
    width: 185,
    aspectRatio: 65,
    rim: 15,
    summary: "A widely stocked passenger-car size with comfort, efficiency and value-oriented pattern choices.",
    applications: ["Selected sedans and hatchbacks", "Selected imported hybrid and compact-car configurations"],
  }),
  makeSize({
    slug: "195-65-r15",
    size: "195/65 R15",
    width: 195,
    aspectRatio: 65,
    rim: 15,
    summary: "A high-interest 15-inch sedan size with Chinese, Japanese and premium choices. Compare like-for-like ratings and current production details.",
    applications: ["Selected Toyota Corolla configurations", "Selected Honda Civic configurations", "Selected imported sedan configurations"],
  }),
  makeSize({
    slug: "185-60-r15",
    size: "185/60 R15",
    width: 185,
    aspectRatio: 60,
    rim: 15,
    summary: "A 15-inch passenger-car size found on selected compact sedans and hatchbacks. Confirm whether it is factory fitment or an alternate.",
    applications: ["Selected Toyota Yaris configurations", "Selected Honda City or Suzuki Swift configurations"],
  }),
  makeSize({
    slug: "195-60-r16",
    size: "195/60 R16",
    width: 195,
    aspectRatio: 60,
    rim: 16,
    summary: "A 16-inch touring size used on selected sedans and crossovers. Verify wheel package and overall diameter before replacing another size.",
    applications: ["Selected compact and mid-size sedans", "Selected crossover configurations"],
  }),
  makeSize({
    slug: "205-55-r16",
    size: "205/55 R16",
    width: 205,
    aspectRatio: 55,
    rim: 16,
    summary: "A popular 16-inch sedan size offered in touring, efficiency and performance-oriented tread families.",
    applications: ["Selected Toyota Corolla configurations", "Selected Hyundai Elantra configurations", "Selected European and Japanese sedans"],
  }),
  makeSize({
    slug: "215-55-r16",
    size: "215/55 R16",
    width: 215,
    aspectRatio: 55,
    rim: 16,
    summary: "A 16-inch size used on selected larger sedans. Load and speed requirements can differ even when dimensions match.",
    applications: ["Selected Honda Civic configurations", "Selected mid-size sedan configurations"],
  }),
  makeSize({
    slug: "215-55-r17",
    size: "215/55 R17",
    width: 215,
    aspectRatio: 55,
    rim: 17,
    summary: "A 17-inch fitment used on selected sedans and crossovers. Compare comfort, wet-road needs and replacement availability.",
    applications: ["Selected sedan wheel packages", "Selected compact-crossover configurations"],
  }),
  makeSize({
    slug: "225-55-r18",
    size: "225/55 R18",
    width: 225,
    aspectRatio: 55,
    rim: 18,
    summary: "An 18-inch crossover and SUV size. Correct load index and a matching set are important for vehicle stability and drivetrain compatibility.",
    applications: ["Selected Kia Sportage configurations", "Selected Hyundai Tucson configurations", "Selected crossover configurations"],
  }),
  makeSize({
    slug: "265-60-r18",
    size: "265/60 R18",
    width: 265,
    aspectRatio: 60,
    rim: 18,
    summary: "An 18-inch SUV and pickup size available in highway and all-terrain categories. Select the category according to load and real road use.",
    applications: ["Selected Toyota Fortuner configurations", "Selected Toyota Hilux or Revo configurations", "Selected SUV and pickup configurations"],
  }),
];

const TYRE_SIZE_PATTERN = /^(\d{3})\s*\/\s*(\d{2})\s*R\s*(\d{2})$/i;

const parseTyreSize = (value = "") => {
  const match = String(value).trim().match(TYRE_SIZE_PATTERN);
  if (!match) return null;
  const width = Number(match[1]);
  const aspectRatio = Number(match[2]);
  const rim = Number(match[3]);
  return {
    width,
    aspectRatio,
    rim,
    size: `${width}/${aspectRatio} R${rim}`,
    slug: `${width}-${aspectRatio}-r${rim}`,
  };
};

const uniqueBy = (items, keyFor) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFor(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const vehicleReferencesBySize = new Map();
SEO_VEHICLES.forEach((vehicle) => {
  vehicle.commonSizes.forEach((entry) => {
    const parsed = parseTyreSize(entry.size);
    if (!parsed) return;
    const current = vehicleReferencesBySize.get(parsed.slug) || [];
    current.push({
      name: vehicle.name,
      slug: vehicle.slug,
      context: entry.context,
      note: entry.note,
    });
    vehicleReferencesBySize.set(parsed.slug, current);
  });
});

const catalogueReferencesBySize = new Map();
PRODUCTS.filter((product) => String(product.category).toLowerCase() === "tyres").forEach(
  (product) => {
    const parsed = parseTyreSize(product.size);
    if (!parsed) return;
    const current = catalogueReferencesBySize.get(parsed.slug) || [];
    current.push({
      name: product.title,
      slug: product.slug,
      brand: product.brand,
      vehicle: product.vehicle,
      image: product.image || "/tyre.jpg",
      origin: product.origin,
    });
    catalogueReferencesBySize.set(parsed.slug, current);
  },
);

const rawSizePages = new Map();
CURATED_SEO_SIZES.forEach((item) => rawSizePages.set(item.slug, item));

const registerReferenceSize = (value) => {
  const parsed = parseTyreSize(value);
  if (!parsed || rawSizePages.has(parsed.slug)) return;
  rawSizePages.set(parsed.slug, makeSize({
    ...parsed,
    summary: `${parsed.size} combines a ${parsed.width} mm nominal width, a ${parsed.aspectRatio} profile and a ${parsed.rim}-inch wheel. It appears in our current catalogue or vehicle-reference data, but the exact vehicle, ratings and availability still need confirmation.`,
    applications: [],
  }));
};

TYRE_SIZE_MANIFEST.forEach((item) => registerReferenceSize(item.size));

const baseSizePages = [...rawSizePages.values()].sort(
  (a, b) => a.rim - b.rim || a.width - b.width || a.aspectRatio - b.aspectRatio,
);

const formatMillimetres = (value) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

export const SEO_SIZES = baseSizePages.map((item) => {
  const vehicleReferences = uniqueBy(
    vehicleReferencesBySize.get(item.slug) || [],
    (entry) => entry.slug,
  );
  const catalogueReferences = uniqueBy(
    catalogueReferencesBySize.get(item.slug) || [],
    (entry) => entry.slug,
  );
  const hasReferenceEvidence =
    vehicleReferences.length > 0 || catalogueReferences.length > 0;
  const sidewallHeight = (item.width * item.aspectRatio) / 100;
  const overallDiameter = item.rim * 25.4 + sidewallHeight * 2;
  const diameterInches = overallDiameter / 25.4;
  const applications = uniqueBy(
    [
      ...(item.commonApplications || []),
      ...vehicleReferences.map((vehicle) => ({
        application: vehicle.name,
        status: "verify",
        note: `${vehicle.context} Reference only; confirm the exact model year, trim, placard and fitted wheel.`,
      })),
      ...catalogueReferences
        .filter((product) => product.vehicle)
        .map((product) => ({
          application: product.vehicle,
          status: "catalogue-reference",
          note: "Catalogue use-category only; it does not approve fitment for a particular vehicle.",
        })),
    ],
    (entry) => String(entry.application || entry.name || entry).toLowerCase(),
  );
  const siblings = baseSizePages
    .filter((candidate) => candidate.rim === item.rim && candidate.slug !== item.slug)
    .slice(0, 5);
  const referenceSummary = vehicleReferences.length
    ? `Our reference data connects it with ${vehicleReferences.map((vehicle) => vehicle.name).join(", ")}. These are starting points, not universal approvals.`
    : catalogueReferences.length
      ? `Our catalogue includes ${catalogueReferences.map((product) => product.name).join(", ")} in this labelled size. Ask us to confirm the exact current item and its ratings.`
      : "This size is retained as a researched fitment reference. Ask our team to confirm a suitable current option for the exact vehicle.";
  const relatedLinks = uniqueBy(
    [
      { label: `Browse all ${item.rim}-inch tyre sizes`, href: `/tyre-sizes/${item.rim}-inch` },
      ...vehicleReferences.slice(0, 3).map((vehicle) => ({
        label: `Tyres for ${vehicle.name}`,
        href: `/vehicles/${vehicle.slug}`,
      })),
      ...catalogueReferences.slice(0, 3).map((product) => ({
        label: `${product.name} ${item.size}`,
        href: `/product/${product.slug}`,
      })),
      ...siblings.map((sibling) => ({
        label: `${sibling.size} tyre guide`,
        href: `/tyre-sizes/${sibling.slug}`,
      })),
      { label: "How to choose the right tyre size", href: "/guides/how-to-choose-the-right-tyre-size-pakistan" },
    ],
    (entry) => entry.href,
  );

  return {
    ...item,
    path: `/tyre-sizes/${item.slug}`,
    seoTitle: `${item.size} Tyres in Lahore | Rate & Fitment`,
    metaDescription: `${item.size} tyre guide for Lahore: understand the dimensions, review available vehicle and catalogue references, and ask for today's rate and verified fitment.`,
    heroTitle: `${item.size} tyres in Lahore`,
    vehicleReferences,
    catalogueReferences,
    noIndex: !hasReferenceEvidence,
    commonApplications: applications,
    shoppingChecklist: [],
    measurements: {
      sidewallHeightMm: Number(sidewallHeight.toFixed(1)),
      overallDiameterMm: Number(overallDiameter.toFixed(1)),
      overallDiameterInches: Number(diameterInches.toFixed(2)),
    },
    highlights: [
      {
        title: "Complete size code",
        description: `${item.width} mm nominal width, ${item.aspectRatio} profile and R${item.rim} radial wheel fitment.`,
      },
      {
        title: "Estimated sidewall",
        description: `${formatMillimetres(sidewallHeight)} mm per side, calculated from the nominal width and aspect ratio.`,
      },
      {
        title: "Estimated diameter",
        description: `${formatMillimetres(overallDiameter)} mm (${diameterInches.toFixed(2)} in). Actual mounted dimensions vary by tyre model and wheel.`,
      },
      {
        title: "Reference coverage",
        description: `${vehicleReferences.length} vehicle reference${vehicleReferences.length === 1 ? "" : "s"} and ${catalogueReferences.length} catalogue example${catalogueReferences.length === 1 ? "" : "s"} in our current data.`,
      },
    ],
    sections: [
      {
        eyebrow: "READ THE SIDEWALL",
        heading: `What ${item.size} means`,
        paragraphs: [
          `${item.width} is the nominal section width in millimetres. ${item.aspectRatio} means the sidewall height is ${item.aspectRatio}% of that width. R identifies radial construction and ${item.rim} is the wheel diameter in inches.`,
          `Using those nominal values, the sidewall is about ${formatMillimetres(sidewallHeight)} mm and the overall unloaded diameter is about ${formatMillimetres(overallDiameter)} mm. These calculations help comparison; they do not replace the vehicle maker's approved specification.`,
        ],
      },
      {
        eyebrow: "OUR DATA",
        heading: `Where ${item.size} appears`,
        paragraphs: [referenceSummary],
        bullets: [
          ...vehicleReferences.map((vehicle) => `${vehicle.name}: ${vehicle.context}`),
          ...catalogueReferences.map((product) => `${product.brand} ${product.name}: catalogue example; current pattern, ratings and stock must be reconfirmed.`),
        ],
      },
      {
        eyebrow: "BEFORE A QUOTE",
        heading: `How to request the right ${item.size} option`,
        paragraphs: [
          `Send a clear sidewall photo, the vehicle make, model, year and variant, and tell us whether the wheels are original. For ${item.size}, we will then check current brands, pattern, manufacturing details, ratings, availability and rate.`,
        ],
        bullets: SIZE_CHECKLIST,
      },
    ],
    faqs: [
      {
        question: `What does ${item.size} mean?`,
        answer: `${item.width} is nominal width in millimetres, ${item.aspectRatio} is the aspect ratio and R${item.rim} means radial construction for a ${item.rim}-inch wheel. Load index and speed symbol are separate markings that must also be checked.`,
      },
      {
        question: `Which cars use ${item.size} tyres?`,
        answer: vehicleReferences.length
          ? `${vehicleReferences.map((vehicle) => vehicle.name).join(", ")} appear in our reference data, but sizes vary by year, trim, import specification and wheel package. Verify the exact vehicle before purchase.`
          : "Vehicle fitment varies by year, trim and wheel package. Share the placard and sidewall details so the complete requirement can be verified.",
      },
      {
        question: `Is ${item.size} currently available in Lahore?`,
        answer: "Availability changes by brand, pattern, ratings and shipment. Contact Wheels & Wheels with the exact size and vehicle for a current check; this page is not a live-stock promise.",
      },
      {
        question: `Can I replace another size with ${item.size}?`,
        answer: "Not from the size code alone. Overall diameter, wheel width, offset, clearance, load capacity, speed rating and manufacturer guidance all need checking before any change.",
      },
    ],
    relatedLinks,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Tyres", path: "/tyres" },
      { name: "Tyre sizes", path: "/tyre-sizes" },
      { name: `${item.rim}-inch tyre sizes`, path: `/tyre-sizes/${item.rim}-inch` },
      { name: item.size, path: `/tyre-sizes/${item.slug}` },
    ],
  };
});

export const TYRE_RIM_HUBS = Array.from({ length: 13 }, (_, index) => index + 12).map((rim) => {
  const sizes = SEO_SIZES.filter((item) => item.rim === rim);
  const firstSize = sizes[0]?.size;
  const lastSize = sizes.at(-1)?.size;
  const examples = sizes.map((item) => item.size).join(", ");
  const path = `/tyre-sizes/${rim}-inch`;
  return {
    slug: `${rim}-inch`,
    path,
    rim,
    sizes,
    noIndex: sizes.length === 0,
    name: `${rim}-inch tyre sizes`,
    title: `${rim}-inch Tyre Sizes in Lahore`,
    seoTitle: `${rim}-inch Tyre Sizes in Lahore | Fitment Directory`,
    heroTitle: `${rim}-inch tyre size directory`,
    metaDescription: sizes.length
      ? `Browse ${sizes.length} published ${rim}-inch tyre-size references, from ${firstSize} to ${lastSize}. Open an exact profile page and request a current Lahore rate.`
      : `Ask Wheels & Wheels about a complete ${rim}-inch tyre requirement. Exact width, profile, ratings, vehicle and wheel fitment must be confirmed.`,
    summary: sizes.length
      ? `Start with the complete sidewall code. This directory contains ${sizes.length} published ${rim}-inch size references: ${examples}. Each one still requires vehicle, rating and current-stock confirmation.`
      : `We accept enquiries for ${rim}-inch requirements, but our current published data does not contain a verified exact width/profile combination for this diameter. Send the complete sidewall code for a manual check.`,
    verificationNote: FITMENT_NOTICE,
    highlights: [
      { title: "Wheel diameter", description: `R${rim} means a radial tyre designed for a ${rim}-inch wheel.` },
      { title: "Published exact sizes", description: sizes.length ? `${sizes.length} researched size references with calculated dimensions.` : "No exact combination published yet." },
      { title: "Fitment rule", description: "Width, profile, load and speed rating still matter; rim diameter alone is not enough." },
    ],
    sections: [
      {
        eyebrow: "SIZE DIRECTORY",
        heading: `${rim}-inch profiles in our current data`,
        paragraphs: [
          sizes.length
            ? `Open an exact size below for its nominal dimensions, vehicle references, catalogue examples and enquiry links. Similar-looking ${rim}-inch tyres are not automatically interchangeable.`
            : `No exact ${rim}-inch width/profile combination is currently supported by the published vehicle or catalogue data. This page is available for navigation and direct enquiries, but it is intentionally excluded from the search sitemap until useful exact-size data is added.`,
        ],
        bullets: sizes.map((item) => `${item.size}: ${item.vehicleReferences.length} vehicle reference${item.vehicleReferences.length === 1 ? "" : "s"}, ${item.catalogueReferences.length} catalogue example${item.catalogueReferences.length === 1 ? "" : "s"}.`),
      },
      {
        eyebrow: "FITMENT FIRST",
        heading: `What to verify for an R${rim} tyre`,
        paragraphs: [
          `The ${rim}-inch figure only identifies wheel diameter. A complete quote also needs width, aspect ratio, load index, speed symbol and the exact vehicle specification.`,
        ],
        bullets: SIZE_CHECKLIST,
      },
    ],
    faqs: [
      {
        question: `Does every ${rim}-inch tyre fit every ${rim}-inch rim?`,
        answer: "No. Wheel width, tyre width, profile, load rating, speed rating, offset and vehicle clearance must all be compatible.",
      },
      {
        question: `How do I find my complete ${rim}-inch tyre size?`,
        answer: `Read the sidewall code, such as ${firstSize || `205/55 R${rim}`}, and compare it with the vehicle placard or owner's manual. Send a clear photo if you are unsure.`,
      },
      {
        question: `Can Wheels & Wheels source an unlisted ${rim}-inch size?`,
        answer: "You can send the complete requirement for a current sourcing check. Availability is confirmed individually and is not guaranteed by this directory.",
      },
    ],
    relatedLinks: [
      ...sizes.map((item) => ({ label: `${item.size} tyres`, href: item.path })),
      { label: "Browse all tyre sizes", href: "/tyre-sizes" },
      { label: "How to choose the right tyre size", href: "/guides/how-to-choose-the-right-tyre-size-pakistan" },
    ],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Tyres", path: "/tyres" },
      { name: "Tyre sizes", path: "/tyre-sizes" },
      { name: `${rim}-inch tyre sizes`, path },
    ],
  };
});

const GUIDE_TOPIC_DEFINITIONS = [
  {
    slug: "tyre-size-and-fitment",
    name: "Tyre size and fitment",
    title: "Tyre Size and Fitment Guides",
    seoTitle: "Tyre Size & Fitment Guides for Pakistan",
    description:
      "Understand tyre sidewall codes, load and speed ratings, vehicle placards and safe fitment checks before choosing a replacement tyre.",
    heroTitle: "Understand the complete tyre fitment.",
    intro:
      "Use the vehicle specification and every part of the tyre code—not wheel diameter alone—to narrow a safe, useful enquiry.",
  },
  {
    slug: "buying-tyres-in-pakistan",
    name: "Buying tyres in Pakistan",
    title: "Tyre Buying Guides for Pakistan",
    seoTitle: "Tyre Buying Guides for Pakistan | Wheels & Wheels",
    description:
      "Compare tyre brands, inspect the exact stock offered and ask the right questions about date codes, ratings, warranty and installed price.",
    heroTitle: "Compare the complete tyre offer.",
    intro:
      "Brand and price are only part of the decision. These guides help you compare specifications, condition, support and real use.",
  },
  {
    slug: "tyre-care-and-road-safety",
    name: "Tyre care and road safety",
    title: "Tyre Care and Road-Safety Guides",
    seoTitle: "Tyre Care & Road-Safety Guides for Pakistan",
    description:
      "Practical tyre inspection, pressure, replacement, balancing and alignment guidance for city, motorway, summer and monsoon driving.",
    heroTitle: "Keep tyres, wheels and steering in check.",
    intro:
      "Use repeatable inspections and diagnose symptoms early. A tyre, wheel or suspension fault should be identified before adjustment or replacement.",
  },
];

const guideTopicForCategory = (category = "") => {
  const normalized = category.toLowerCase();
  if (normalized.includes("size") || normalized.includes("fitment")) {
    return "tyre-size-and-fitment";
  }
  if (normalized.includes("buying") || normalized.includes("inspection")) {
    return "buying-tyres-in-pakistan";
  }
  return "tyre-care-and-road-safety";
};

const guide = ({
  slug,
  title,
  excerpt,
  readMinutes,
  category,
  topicSlug,
  publishedAt,
  image,
  imageSmall,
  imagePosition,
  imageAlt,
  imageCaption,
  imageCredit,
  takeaway,
  sections,
  faqs,
  relatedLinks,
}) => ({
  slug,
  title,
  seoTitle: `${title} | Wheels & Wheels`,
  metaDescription: excerpt,
  excerpt,
  readMinutes,
  category,
  topicSlug: topicSlug || guideTopicForCategory(category),
  publishedAt,
  updatedAt: SEO_CONTENT_UPDATED,
  author: { name: "Wheels & Wheels tyre team", url: "/about" },
  image,
  imageSmall,
  imagePosition,
  imageAlt,
  imageCaption,
  imageCredit,
  takeaway,
  sections,
  faqs,
  relatedLinks,
});

export const GUIDES = [
  guide({
    slug: "how-to-choose-the-right-tyre-size-pakistan",
    title: "How to Choose the Right Tyre Size in Pakistan",
    category: "TYRE SIZE & FITMENT",
    publishedAt: "2026-09-30",
    image: "/images/guides/choose-right-tyre-size.webp",
    imageSmall: "/images/guides/choose-right-tyre-size-960.webp",
    imagePosition: "center 58%",
    imageAlt: "Close-up of a mounted tyre showing its sidewall size marking",
    imageCaption: "Start with the full sidewall marking, then verify it against the vehicle placard or owner's manual before purchase.",
    imageCredit: {
      photographer: "Komorebi Photo",
      sourceUrl: "https://unsplash.com/photos/close-up-of-a-car-tire-with-size-markings-rKpCsu0aFk8",
      licenseName: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
      modified: true,
    },
    takeaway: "Start with the vehicle placard and complete sidewall code; rim diameter alone cannot approve a tyre.",
    excerpt:
      "A practical way to read a tyre size, find the vehicle's approved specification and evaluate an alternate without relying on guesswork.",
    readMinutes: 7,
    sections: [
      {
        heading: "Start with the vehicle, not the shop shelf",
        paragraphs: [
          "The safest starting point is the tyre placard, usually found on a door frame, fuel flap or another location identified in the owner's manual. It records an approved size and cold-pressure guidance for that vehicle specification.",
          "Registration year alone is not enough. Imported cars, different trims and optional wheel packages can use different tyres even when the model badge is identical.",
        ],
      },
      {
        heading: "Read all parts of the code",
        paragraphs: [
          "In 195/65 R15, 195 is nominal section width in millimetres, 65 is sidewall height as a percentage of width, R identifies radial construction and 15 is wheel diameter in inches.",
          "The markings that follow are also important. Load index and speed symbol must meet the vehicle requirement; they should not be ignored just because two tyres share the same dimensions.",
        ],
        bullets: [
          "Size must match the wheel diameter",
          "Load index must support the vehicle's requirement",
          "Speed rating must meet the required specification",
          "Directional or asymmetric tyres must be installed in the correct orientation",
        ],
      },
      {
        heading: "Treat an upsize as an engineering check",
        paragraphs: [
          "Changing width, profile or rim diameter changes more than appearance. It can affect overall diameter, speedometer reading, ground clearance, steering effort, ride comfort and clearance around the suspension and body.",
          "A diameter calculator is a useful screening tool, but a percentage alone cannot approve a fitment. Wheel width, offset, load rating, full steering lock, suspension travel and the manufacturer's guidance still need to be checked.",
        ],
      },
      {
        heading: "Information to send for an accurate quote",
        bullets: [
          "A clear photo of the current tyre sidewall",
          "Vehicle make, model, model year and exact variant",
          "Current wheel diameter and whether the wheels are original",
          "Main use: city, motorway, high load, broken roads or off-road",
          "Priority: price, comfort, low noise, tread life or performance",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I choose a tyre using only the rim diameter?",
        answer: "No. Width, aspect ratio, load index, speed rating, wheel width, offset and clearance also matter.",
      },
      {
        question: "Is a wider tyre always safer?",
        answer: "No. A wider tyre can change steering, fuel use, wet behaviour and clearance. It is only suitable when the full fitment is verified.",
      },
      {
        question: "Is an online diameter calculator enough to approve an upsize?",
        answer: "No. It can compare dimensions, but it cannot inspect wheel offset, body clearance, load requirements or manufacturer restrictions.",
      },
      {
        question: "What if the four tyres are different sizes?",
        answer: "Some vehicles are designed with staggered sizes, but an unexpected mismatch can be unsafe. Check the manual and have the setup inspected before driving further.",
      },
    ],
    relatedLinks: [
      { label: "Browse tyres by vehicle", href: "/vehicles" },
      { label: "Browse tyre sizes", href: "/tyre-sizes" },
      { label: "Book tyre installation", href: "/services/tyre-installation" },
    ],
  }),
  guide({
    slug: "chinese-vs-japanese-vs-premium-tyres-lahore",
    title: "Chinese, Japanese or Premium Tyres: A Lahore Buyer's Framework",
    category: "TYRE BUYING",
    publishedAt: "2026-09-30",
    image: "/images/guides/compare-tyre-options.jpg",
    imageSmall: "/images/guides/compare-tyre-options-960.jpg",
    imagePosition: "center 48%",
    imageAlt: "Tyre technician examining a passenger tyre in a professional workshop",
    imageCaption: "Compare the exact pattern, specification, condition and seller support rather than relying on origin or price alone.",
    imageCredit: {
      photographer: "Gustavo Fring",
      sourceUrl: "https://www.pexels.com/photo/mechanic-holding-a-car-tire-6870311/",
      licenseName: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      modified: true,
    },
    takeaway: "Country and price are only context; compare the exact pattern, specification, condition and support.",
    excerpt:
      "Compare tyre options by verified specification, pattern, condition and support instead of assuming that country or price alone determines quality.",
    readMinutes: 8,
    sections: [
      {
        heading: "Origin is context, not a verdict",
        paragraphs: [
          "A brand may have roots in one country while producing tyres in several factories. The individual sidewall, invoice and seller documentation are better evidence for the exact tyre than a category label such as Japanese or European.",
          "Chinese brands cover a broad range of factories and products, just as established international brands cover economy, touring, performance and SUV lines. Compare exact products, not stereotypes.",
        ],
      },
      {
        heading: "Use one comparison sheet",
        table: {
          headers: ["Check", "Why it matters"],
          rows: [
            ["Full size and ratings", "Confirms the tyre can carry the vehicle and matches the approved fitment"],
            ["Pattern category", "Separates touring, performance, highway, all-terrain and commercial uses"],
            ["Production date and storage", "Provides context for the condition of the exact stock"],
            ["Wet and noise labels where supplied", "Helps compare like-for-like products, but test standards must match"],
            ["Written warranty terms", "Shows what is covered, for how long and by whom"],
            ["Installed total", "Avoids comparing a bare tyre price with a fitted and balanced package"],
          ],
        },
      },
      {
        heading: "Match the budget to the way the car is used",
        paragraphs: [
          "A low-mileage city car, a motorway commuter, a high-powered sedan and a loaded SUV do not have the same priorities. Start with safety-critical specifications, then rank comfort, noise, tread life, grip and price for the real use case.",
          "If replacement stock is rare in the chosen size, a slightly cheaper tyre may become inconvenient later. Ask whether the same pattern and size can be sourced again if one tyre is damaged.",
        ],
      },
      {
        heading: "Questions worth asking before payment",
        bullets: [
          "Can I inspect the sidewall and date code of the tyres I will receive?",
          "Is the quote per tyre or for four tyres?",
          "Are fitting, valves, balancing and disposal included?",
          "Who handles a documented manufacturing defect claim?",
          "Is this exact load and speed rating appropriate for my vehicle?",
        ],
      },
    ],
    faqs: [
      {
        question: "Are all Chinese tyres budget tyres?",
        answer: "No. Chinese manufacturers and product lines occupy different price and performance positions. Judge the exact tyre and specification.",
      },
      {
        question: "Does a Japanese brand mean the tyre was made in Japan?",
        answer: "Not necessarily. Manufacturing location can vary by model, size and batch. Read the country marking on the exact tyre.",
      },
      {
        question: "Should I buy the most expensive option available?",
        answer: "Not automatically. Buy a correctly specified tyre whose intended use, support and price suit the vehicle and driving pattern.",
      },
      {
        question: "Can I mix two brands on one axle?",
        answer: "A matched pair is generally the safer purchasing goal. Vehicle and tyre manufacturer guidance should be followed, especially on AWD vehicles.",
      },
    ],
    relatedLinks: [
      { label: "Compare tyre brands", href: "/brands" },
      { label: "See 195/65 R15 options", href: "/tyre-sizes/195-65-r15" },
      { label: "Request a current quote", href: "/quote" },
    ],
  }),
  guide({
    slug: "verify-fresh-genuine-tyres-lahore",
    title: "How to Check a Tyre Before Buying in Lahore",
    category: "TYRE INSPECTION",
    publishedAt: "2026-09-30",
    image: "/images/guides/check-tyre-before-buying.webp",
    imageSmall: "/images/guides/check-tyre-before-buying-960.webp",
    imagePosition: "center 48%",
    imageAlt: "Gloved technician closely inspecting the tread of a mounted tyre",
    imageCaption: "Inspect every physical tyre, its tread, sidewall markings and invoice details before accepting supply.",
    imageCredit: {
      photographer: "Jimmy",
      sourceUrl: "https://unsplash.com/photos/9uHal2Dd9aE",
      licenseName: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
      modified: true,
    },
    takeaway: "Verify the exact physical tyre, its markings and seller documentation—not a catalogue photo alone.",
    excerpt:
      "Use the sidewall, physical condition, invoice and written terms to verify the exact tyre instead of relying on packaging or a verbal fresh-stock claim.",
    readMinutes: 7,
    sections: [
      {
        heading: "Inspect the exact set, not a display sample",
        paragraphs: [
          "Ask to see all tyres included in the quote. Confirm that size, pattern, load index and speed symbol match across the intended axle or set.",
          "A clean surface or plastic wrapping does not establish age, storage quality or authenticity. The moulded sidewall information is more useful.",
        ],
      },
      {
        heading: "Read the date code carefully",
        paragraphs: [
          "Many road tyres carry a four-digit week-and-year code as part of their identification marking. For example, 1826 normally indicates production in week 18 of 2026.",
          "Age is only one part of condition. Storage, heat, sunlight, deformation, cracking and manufacturer guidance also matter. A date code alone is not a universal expiry date.",
        ],
      },
      {
        heading: "Check identity and physical condition",
        bullets: [
          "Brand and pattern name moulded into the sidewall",
          "Complete size, load index and speed symbol",
          "Country of manufacture on the exact tyre",
          "No visible cuts, bulges, bead damage, deep cracking or deformation",
          "Matching identification details across a quoted set where appropriate",
          "A seller invoice that identifies the product and transaction",
        ],
      },
      {
        heading: "Put promises in writing",
        paragraphs: [
          "Ask for written warranty terms, including who accepts a claim, what evidence is required and which damage is excluded. Road hazards, incorrect pressure and alignment wear are not the same as a manufacturing defect.",
          "Record the fitted size, date, pressure and alignment or balancing work on the invoice. Good documentation makes future inspection and support easier.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does a four-digit code show when a tyre was made?",
        answer: "On tyres using that convention, the first two digits indicate production week and the last two indicate year. Ask the fitter to point out the complete marking.",
      },
      {
        question: "Is a tyre automatically unsafe after a fixed number of years?",
        answer: "There is no single answer for every tyre and use. Follow the vehicle and tyre manufacturer's inspection and replacement guidance and consider condition and storage.",
      },
      {
        question: "Can packaging prove a tyre is genuine?",
        answer: "No. Inspect moulded markings, seller documentation and the exact product. Packaging alone can be replaced or copied.",
      },
      {
        question: "Should all four date codes be identical?",
        answer: "Not necessarily, but large differences should be explained. The specification and condition of every tyre must be acceptable.",
      },
    ],
    relatedLinks: [
      { label: "Compare tyre brands", href: "/brands" },
      { label: "Book professional fitting", href: "/services/tyre-installation" },
      { label: "Contact the Lahore shop", href: "/contact" },
    ],
  }),
  guide({
    slug: "wheel-alignment-vs-balancing-lahore",
    title: "Wheel Alignment vs Balancing: What Lahore Drivers Need",
    category: "WHEEL CARE",
    publishedAt: "2026-09-30",
    image: "/images/guides/alignment-vs-balancing.jpg",
    imageSmall: "/images/guides/alignment-vs-balancing-960.jpg",
    imagePosition: "center 48%",
    imageAlt: "Technician attaching wheel-alignment measuring equipment to a vehicle",
    imageCaption: "Alignment corrects wheel angles; balancing corrects rotating weight distribution. Diagnosis should come first.",
    imageCredit: {
      photographer: "Andrea Piacquadio",
      sourceUrl: "https://www.pexels.com/photo/man-in-black-jacket-and-black-cap-standing-near-black-vehicle-3807649/",
      licenseName: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      modified: true,
    },
    takeaway: "Alignment and balancing solve different problems, so diagnose the symptom before choosing a service.",
    excerpt:
      "Learn which service addresses pulling and uneven wear, which addresses speed-related vibration, and when a tyre or suspension inspection should come first.",
    readMinutes: 6,
    sections: [
      {
        heading: "They correct different problems",
        paragraphs: [
          "Balancing corrects uneven mass in a tyre-and-wheel assembly by measuring it on a balancer and applying corrective weights. Alignment measures and adjusts wheel angles where the vehicle allows adjustment.",
          "Neither service repairs a bent rim, separated tyre, worn bearing or loose suspension component. Inspection should come before adjustment when damage is suspected.",
        ],
      },
      {
        heading: "Use the symptom as a clue",
        table: {
          headers: ["Symptom", "First checks"],
          rows: [
            ["Steering vibration that changes with speed", "Tyre condition, wheel damage and balancing"],
            ["Vehicle pulls on a level road", "Pressure, tyre condition, brakes, suspension and alignment"],
            ["Steering wheel sits off-centre", "Alignment and steering or suspension condition"],
            ["Inside or outside edge wear", "Pressure, suspension and alignment"],
            ["Vibration after a pothole impact", "Tyre, rim, hub and suspension inspection before balancing"],
          ],
        },
      },
      {
        heading: "When to book balancing",
        bullets: [
          "When new tyres are installed",
          "After a tyre is removed from the wheel for repair",
          "When speed-related vibration appears",
          "When a balance weight is missing",
          "When irregular wear suggests the assembly needs inspection",
        ],
      },
      {
        heading: "When to check alignment",
        bullets: [
          "After a strong pothole or kerb impact",
          "When the car pulls or the steering wheel is off-centre",
          "When tread wears more on one edge",
          "After steering or suspension parts are replaced",
          "When installing new tyres if the old set wore unevenly",
        ],
      },
    ],
    faqs: [
      {
        question: "Will alignment stop a steering-wheel vibration?",
        answer: "Usually not by itself. Speed-related vibration more often points to imbalance, tyre damage, wheel damage or another rotating component.",
      },
      {
        question: "Do new tyres need balancing?",
        answer: "Yes. A new tyre and wheel assembly should be balanced during installation.",
      },
      {
        question: "Can alignment be accurate with worn suspension parts?",
        answer: "Loose or damaged parts can prevent stable adjustment. They should be identified and addressed first.",
      },
      {
        question: "Does balancing fix a bent alloy rim?",
        answer: "No. Weights cannot restore the structure of a bent or cracked wheel; it needs separate assessment.",
      },
    ],
    relatedLinks: [
      { label: "Wheel alignment in Lahore", href: "/services/wheel-alignment" },
      { label: "Computerised wheel balancing", href: "/services/wheel-balancing" },
      { label: "Tyre installation", href: "/services/tyre-installation" },
    ],
  }),
  guide({
    slug: "lahore-summer-monsoon-tyre-checklist",
    title: "Lahore Summer and Monsoon Tyre Checklist",
    category: "SEASONAL TYRE CARE",
    publishedAt: "2026-09-30",
    image: "/images/guides/monsoon-tyre-check.webp",
    imageSmall: "/images/guides/monsoon-tyre-check-960.webp",
    imagePosition: "center 52%",
    imageAlt: "Cars driving through heavy rain on a water-covered road",
    imageCaption: "Before extreme heat or heavy rain, check cold pressure, tread, visible damage and the spare tyre.",
    imageCredit: {
      sourceLabel: "Unsplash contributor",
      sourceUrl: "https://unsplash.com/photos/955S12hDHcg",
      licenseName: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
      modified: true,
    },
    takeaway: "Check pressure cold, inspect tread and damage, and include the spare before extreme heat or heavy rain.",
    excerpt:
      "A seasonal inspection routine for pressure, tread, damage, alignment and emergency equipment before Lahore heat or heavy rain exposes a weak tyre.",
    readMinutes: 7,
    sections: [
      {
        heading: "Heat makes pressure checks more important",
        paragraphs: [
          "Tyre pressure changes as temperature and driving heat change. Check pressure when tyres are cold and use the vehicle placard value rather than a number copied from another car.",
          "The maximum pressure moulded on a tyre sidewall is not normally the vehicle's everyday target pressure. The vehicle manufacturer specifies the operating recommendation.",
        ],
      },
      {
        heading: "Prepare for standing water",
        paragraphs: [
          "Tread must clear water while steering and braking inputs remain smooth. Worn tread, incorrect pressure and excessive speed increase risk on wet roads.",
          "Inspect every tyre across its width, not only the outer shoulder. Uneven wear can hide on the inner edge when alignment or suspension is incorrect.",
        ],
        bullets: [
          "Check tread across inner, centre and outer zones",
          "Clear stones and inspect grooves for damage",
          "Test wipers, lights and brakes before monsoon travel",
          "Reduce speed and increase following distance in heavy rain",
        ],
      },
      {
        heading: "Pothole impacts need a physical inspection",
        paragraphs: [
          "A hard impact can damage a tyre sidewall, wheel or suspension even when pressure remains normal. New vibration, pulling, a bulge or a changed steering position deserves prompt inspection.",
          "Do not try to solve impact damage by adding pressure or repeatedly rebalancing a visibly damaged assembly.",
        ],
      },
      {
        heading: "Keep the spare and tools ready",
        bullets: [
          "Check spare-tyre pressure and condition",
          "Confirm the jack and wheel-nut tool fit the vehicle",
          "Keep the locking-wheel-nut key in the car",
          "Save roadside and tyre-shop contact details",
          "Recheck wheel-nut torque according to installer guidance after wheel removal",
        ],
      },
    ],
    faqs: [
      {
        question: "Should tyre pressure be checked hot or cold?",
        answer: "Use a cold-tyre check for comparison with the vehicle placard unless the manufacturer gives another procedure.",
      },
      {
        question: "Can I use the maximum pressure written on the sidewall?",
        answer: "That marking is not normally the vehicle's routine target. Follow the vehicle placard or owner's manual.",
      },
      {
        question: "What should I do after hitting a deep pothole?",
        answer: "Slow down safely, inspect for pressure loss or visible damage, and arrange a tyre, wheel and suspension check if anything changed.",
      },
      {
        question: "Is tread depth the only wet-weather check?",
        answer: "No. Pressure, damage, tyre age and condition, alignment, vehicle speed and driving technique also affect wet-road safety.",
      },
    ],
    relatedLinks: [
      { label: "Book wheel alignment", href: "/services/wheel-alignment" },
      { label: "Book wheel balancing", href: "/services/wheel-balancing" },
      { label: "Ask about replacement tyres", href: "/quote" },
    ],
  }),
  guide({
    slug: "195-65-r15-tyre-guide-pakistan",
    title: "195/65 R15 Tyres in Pakistan: A Practical Buying Guide",
    category: "POPULAR TYRE SIZE",
    publishedAt: "2026-09-30",
    image: "/images/guides/195-65-r15-buying-guide.jpg",
    imageSmall: "/images/guides/195-65-r15-buying-guide-960.jpg",
    imagePosition: "center 58%",
    imageAlt: "Detailed close-up of information moulded into a tyre sidewall",
    imageCaption: "Sidewall detail shown for illustration. Confirm that the exact tyre reads 195/65 R15 and carries the vehicle-approved load and speed ratings.",
    imageCredit: {
      photographer: "Erik Mclean",
      sourceUrl: "https://www.pexels.com/photo/close-up-of-a-car-tire-16685597/",
      licenseName: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      modified: true,
    },
    takeaway: "Use 195/65 R15 only where the vehicle specification approves it, then compare equal ratings and patterns.",
    excerpt:
      "Understand the 195/65 R15 marking, compare exact specifications and request a useful quote without assuming that every 15-inch car uses this size.",
    readMinutes: 7,
    sections: [
      {
        heading: "What 195/65 R15 means",
        paragraphs: [
          "The nominal section width is 195 millimetres. The sidewall height is 65 percent of that nominal width, the R indicates radial construction and the tyre mounts on a 15-inch wheel.",
          "Those four elements do not complete the specification. The load index, speed symbol, tread pattern and any vehicle-specific requirements still need to match.",
        ],
      },
      {
        heading: "Do not buy it only because your wheel is 15 inches",
        paragraphs: [
          "A 15-inch wheel can accept multiple tyre sizes only when its width and the vehicle's clearance allow them. A 195/65 R15 is not interchangeable with every other R15 size.",
          "Check the placard first. If the current tyre differs, find out whether the car has modified wheels or an earlier owner's alternate setup before repeating it.",
        ],
      },
      {
        heading: "Compare options in useful groups",
        table: {
          headers: ["Group", "Questions to ask"],
          rows: [
            ["Value-focused", "Are the required ratings present, and what written support is included?"],
            ["Touring", "How does the exact pattern prioritize comfort, noise and everyday use?"],
            ["Performance-oriented", "Does the vehicle and driving style justify the trade-offs and rating?"],
            ["Efficiency-focused", "Is the claim documented for the exact pattern and test standard?"],
          ],
        },
      },
      {
        heading: "Ask for a complete quote",
        bullets: [
          "Exact brand, pattern, load index and speed symbol",
          "Country of manufacture and date code for available stock",
          "Per-tyre price and set-of-four total",
          "Fitting, valve and balancing charges",
          "Written warranty or claim process",
          "Availability of the same pattern if one tyre later needs replacement",
        ],
      },
    ],
    faqs: [
      {
        question: "Which cars use 195/65 R15?",
        answer: "Selected variants of several sedans use it, but model name alone is not proof. Confirm the exact vehicle placard and wheel.",
      },
      {
        question: "Can I replace 195/65 R15 with 205/55 R16?",
        answer: "That also requires a different wheel and a complete diameter, load, offset and clearance check. It is not a direct tyre-only replacement.",
      },
      {
        question: "Should I replace two tyres or all four?",
        answer: "It depends on tread difference, tyre condition and drivetrain requirements. AWD vehicles can have stricter matching requirements; inspect the full set.",
      },
      {
        question: "Why do prices differ for the same size?",
        answer: "Brand, pattern, ratings, production source, seller terms, supply and included services can all differ. Compare the complete offer.",
      },
    ],
    relatedLinks: [
      { label: "Browse 195/65 R15 options", href: "/tyre-sizes/195-65-r15" },
      { label: "Tyres for Toyota Corolla", href: "/vehicles/toyota-corolla" },
      { label: "Compare tyre brands", href: "/brands" },
    ],
  }),
  guide({
    slug: "tyre-load-index-speed-rating-guide-pakistan",
    title: "Tyre Load Index and Speed Rating Explained for Pakistan",
    category: "TYRE SIZE & FITMENT",
    topicSlug: "tyre-size-and-fitment",
    publishedAt: "2026-10-01",
    image: "/images/guides/load-index-speed-rating.webp",
    imageSmall: "/images/guides/load-index-speed-rating-960.webp",
    imagePosition: "center 56%",
    imageAlt: "Close-up of dimensional markings moulded into a passenger tyre sidewall",
    imageCaption: "Read the full code on the exact tyre, including the load index and speed symbol that follow the dimensional size.",
    imageCredit: {
      photographer: "Erik Mclean",
      sourceUrl: "https://unsplash.com/photos/ebuE2Rhk3Gw",
      licenseName: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
      modified: true,
    },
    takeaway: "Matching width, profile and rim is not enough; the required load index and speed symbol also need verification.",
    excerpt:
      "Learn what the numbers and letters after a tyre size mean, where to find the vehicle requirement and why a higher-looking code is not the only buying decision.",
    readMinutes: 7,
    sections: [
      {
        heading: "Look beyond the dimensional size",
        paragraphs: [
          "A sidewall marking may continue after a size such as 205/55 R16 with a number and a letter. The number is a load-index code and the letter is a speed symbol. They are part of the operating specification, not decoration.",
          "A load index is not the tyre's weight in kilograms. It maps to a rated carrying capacity under defined conditions. Use a current tyre-manufacturer table and the vehicle requirement when interpreting it.",
        ],
      },
      {
        heading: "Start with the vehicle requirement",
        paragraphs: [
          "Check the placard and owner's manual for the exact model, year, trim and wheel package. Imported variants and optional wheels can differ even when the badge on the boot is the same.",
          "If the current tyre has a different rating from the placard, do not assume the fitted tyre proves what is correct. Find out whether the wheels or specification were changed and have the setup checked.",
        ],
        bullets: [
          "Record the complete size, load index and speed symbol",
          "Confirm whether the marking is for a standard-load, reinforced or other specified construction",
          "Check axle, passenger and luggage requirements for the actual vehicle",
          "Ask whether all tyres in a set carry compatible specifications",
        ],
      },
      {
        heading: "Do not compare one code in isolation",
        paragraphs: [
          "A tyre with a higher rating still has to be the correct dimensional size, construction and use category. Ride, pressure guidance, wheel compatibility and vehicle-system requirements do not disappear because one code is higher.",
          "The speed symbol describes a tested capability under specified conditions; it is not permission to drive at that speed. Road limits, tyre condition, pressure, load, heat and vehicle condition remain essential.",
        ],
      },
      {
        heading: "What to send with a rate request",
        bullets: [
          "A clear photo showing the whole sidewall marking",
          "Vehicle make, model, year and exact variant",
          "Whether the wheels are factory fitted or changed",
          "Normal passenger, luggage and motorway use",
          "Any manufacturer requirement shown on the placard or manual",
        ],
      },
    ],
    faqs: [
      {
        question: "Can two tyres with the same size have different load indexes?",
        answer: "Yes. Always compare the complete marking and confirm that the offered rating meets the vehicle requirement.",
      },
      {
        question: "Is a higher speed rating automatically better?",
        answer: "No. The tyre must still suit the vehicle, wheel, load and intended use. Compare the complete specification and tyre category.",
      },
      {
        question: "Where can I find the required rating?",
        answer: "Start with the vehicle placard and owner's manual. If the car has changed wheels or an unclear import specification, arrange a complete fitment check.",
      },
      {
        question: "Can I rely on the rating on my current tyre?",
        answer: "Use it as evidence of what is fitted, not automatic proof of what the vehicle requires. Previous owners may have changed the setup.",
      },
    ],
    relatedLinks: [
      { label: "How to choose the right tyre size", href: "/guides/how-to-choose-the-right-tyre-size-pakistan" },
      { label: "Browse exact tyre-size pages", href: "/tyre-sizes" },
      { label: "Find tyres by vehicle", href: "/vehicles" },
    ],
  }),
  guide({
    slug: "how-to-compare-tyre-prices-pakistan",
    title: "How to Compare Tyre Prices in Pakistan Without Missing the Details",
    category: "TYRE BUYING",
    topicSlug: "buying-tyres-in-pakistan",
    publishedAt: "2026-10-01",
    image: "/images/guides/compare-tyre-prices.jpg",
    imageSmall: "/images/guides/compare-tyre-prices-960.jpg",
    imagePosition: "center 52%",
    imageAlt: "Organised rows of passenger tyres stored in a tyre warehouse",
    imageCaption: "Compare like for like: exact tyre, quantity, verified specification, installation, balancing and written support.",
    imageCredit: {
      photographer: "Andrea Piacquadio",
      sourceUrl: "https://www.pexels.com/photo/stack-of-rubber-tires-3806252/",
      licenseName: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      modified: true,
    },
    takeaway: "A useful price comparison names the exact tyre, full specification, quantity, included services and written support.",
    excerpt:
      "Build a like-for-like tyre quotation by checking the exact pattern, ratings, manufacturing details, quantity, fitting, balancing and warranty terms.",
    readMinutes: 8,
    sections: [
      {
        heading: "Make every seller quote the same requirement",
        paragraphs: [
          "Begin with the complete sidewall size, the vehicle details and the required load and speed ratings. A quote for a different rating, pattern or production source is not a like-for-like comparison even when the brand name matches.",
          "Ask for the exact pattern name. Large brands sell several product families for different priorities, and a general brand quote can hide an important difference.",
        ],
      },
      {
        heading: "Separate tyre price from installed total",
        table: {
          headers: ["Quote item", "What to confirm"],
          rows: [
            ["Tyre quantity", "One tyre, a pair or a set of four"],
            ["Fitting", "Removal, installation and new valves where required"],
            ["Balancing", "Whether all fitted assemblies are balanced"],
            ["Alignment", "Whether it is included, separate or only recommended after inspection"],
            ["Old tyres", "Whether disposal or return of the old set is included"],
            ["Warranty", "Who handles a claim and what written exclusions apply"],
          ],
        },
      },
      {
        heading: "Inspect the exact stock behind the price",
        paragraphs: [
          "Before payment, inspect size, pattern, load index, speed symbol, manufacturing country, identification and date information on the physical tyres offered. Confirm that condition and markings are consistent with the invoice.",
          "A website image is representative unless it identifies the exact stock. Current availability and price should be reconfirmed close to purchase because imported-tyre supply can change.",
        ],
      },
      {
        heading: "Use a simple comparison message",
        bullets: [
          "Vehicle, model year and variant",
          "Complete tyre size plus load and speed rating",
          "Preferred priorities: value, comfort, noise, mileage, grip or road type",
          "Required quantity and whether fitting and balancing are needed",
          "Request for exact brand, pattern, country marking, date information and written total",
        ],
      },
    ],
    faqs: [
      {
        question: "Why can the same tyre size have very different prices?",
        answer: "Brand, pattern, ratings, production source, shipment cost, quantity, condition, warranty and included services can all differ.",
      },
      {
        question: "Should a quote say whether the price is per tyre?",
        answer: "Yes. Confirm the quantity and ask for the set total so there is no ambiguity.",
      },
      {
        question: "Is fitting always included in a tyre price?",
        answer: "No. Ask separately about fitting, valves, balancing, alignment and old-tyre handling.",
      },
      {
        question: "Can an online price guarantee stock?",
        answer: "Only if the seller operates verified live inventory and states the terms. Wheels & Wheels confirms current stock and rate directly for the exact request.",
      },
    ],
    relatedLinks: [
      { label: "Compare tyre brands", href: "/brands" },
      { label: "How to inspect a tyre before buying", href: "/guides/verify-fresh-genuine-tyres-lahore" },
      { label: "Request a current rate", href: "/quote" },
    ],
  }),
  guide({
    slug: "when-to-replace-tyres-pakistan",
    title: "When Should You Replace Tyres? A Pakistan Road-Use Checklist",
    category: "TYRE CARE & SAFETY",
    topicSlug: "tyre-care-and-road-safety",
    publishedAt: "2026-10-01",
    image: "/images/guides/when-to-replace-tyres.jpg",
    imageSmall: "/images/guides/when-to-replace-tyres-960.jpg",
    imagePosition: "center 46%",
    imageAlt: "Close-up of a used passenger tyre tread ready for condition inspection",
    imageCaption: "Condition, tread, age, pressure history and road damage all belong in a professional replacement decision.",
    imageCredit: {
      photographer: "Mike Bird",
      sourceUrl: "https://www.pexels.com/photo/car-tire-closeup-photo-116676/",
      licenseName: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      modified: true,
    },
    takeaway: "Replace based on a complete condition and specification check—not mileage, age or tread appearance alone.",
    excerpt:
      "Use visible damage, tread condition, pressure loss, vibration, age and vehicle behaviour to decide when a tyre needs professional inspection or replacement.",
    readMinutes: 8,
    sections: [
      {
        heading: "Stop and inspect urgent warning signs",
        paragraphs: [
          "A sidewall bulge, exposed cords, deep cut, bead damage, major cracking, sudden pressure loss or a tyre that has run flat can indicate structural damage. Reduce risk and arrange inspection rather than continuing normal driving.",
          "Vibration after an impact can come from a tyre, wheel, hub or suspension problem. Balancing should not be used to disguise visible damage.",
        ],
      },
      {
        heading: "Read tread across the whole tyre",
        paragraphs: [
          "Inspect inner, centre and outer tread zones. One edge can wear rapidly while the visible shoulder still looks acceptable, especially when pressure, alignment or suspension is wrong.",
          "Use the tyre maker's wear indicators and applicable road rules as minimum boundaries, but remember that wet-road performance and damage concerns can justify earlier replacement. If you cannot inspect the inner edge safely, ask a professional.",
        ],
      },
      {
        heading: "Age is context, not a single expiry number",
        paragraphs: [
          "The date code helps identify production timing, but storage, heat exposure, use, maintenance and manufacturer guidance affect condition. A newer tyre can be damaged, and an older tyre still requires a physical inspection rather than a visual guess from one number.",
          "Follow the vehicle and tyre manufacturer's inspection and replacement guidance for the exact product. Include the spare, which can age even when it has never been driven on the road.",
        ],
      },
      {
        heading: "Use this replacement decision checklist",
        bullets: [
          "Inspect for cuts, bulges, cracking, deformation and puncture repairs",
          "Measure tread across the full width and compare all four tyres",
          "Check cold pressure repeatedly for unexplained loss",
          "Investigate vibration, pulling or new road noise",
          "Confirm date information and manufacturer guidance",
          "Check whether the axle pair or all four tyres need compatible replacement",
        ],
      },
    ],
    faqs: [
      {
        question: "Is mileage alone enough to decide replacement?",
        answer: "No. Driving style, pressure, alignment, load, road surface, tyre design, damage and age can make tyres wear very differently.",
      },
      {
        question: "Can a sidewall puncture be repaired?",
        answer: "Sidewall and shoulder damage needs expert assessment and is commonly unsuitable for a standard tread-area repair. Do not rely on a temporary seal as a permanent decision.",
      },
      {
        question: "Should the newest tyres go on the front or rear?",
        answer: "Follow the vehicle and tyre manufacturer's guidance and have the complete set assessed. Stability, drivetrain and remaining tread all matter.",
      },
      {
        question: "Does a tyre need inspection after a pothole impact?",
        answer: "Yes if there is a bulge, pressure loss, vibration, pulling, wheel damage or any change in driving behaviour. Hidden damage can require removal for inspection.",
      },
    ],
    relatedLinks: [
      { label: "Lahore summer and monsoon checklist", href: "/guides/lahore-summer-monsoon-tyre-checklist" },
      { label: "Alignment versus balancing", href: "/guides/wheel-alignment-vs-balancing-lahore" },
      { label: "Browse tyres by exact size", href: "/tyre-sizes" },
    ],
  }),
];

export const GUIDE_TOPICS = GUIDE_TOPIC_DEFINITIONS.map((topic) => {
  const guides = GUIDES.filter((item) => item.topicSlug === topic.slug);
  const path = `/guides/topics/${topic.slug}`;
  return {
    ...topic,
    path,
    guides,
    count: guides.length,
    updatedAt: SEO_CONTENT_UPDATED,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Blog and tyre guides", path: "/guides" },
      { name: topic.name, path },
    ],
  };
});

const slugify = (value = "") => {
  const decoded = (() => {
    try {
      return decodeURIComponent(String(value));
    } catch {
      return String(value);
    }
  })();

  return decoded
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getBrandBySlug = (slug) =>
  SEO_BRANDS.find((item) => item.slug === slugify(slug)) || null;

export const getVehicleBySlug = (slug) =>
  SEO_VEHICLES.find((item) => item.slug === slugify(slug)) || null;

export const getSizeBySlug = (slug) =>
  SEO_SIZES.find((item) => item.slug === slugify(slug)) || null;

export const getRimHubBySlug = (slug) =>
  TYRE_RIM_HUBS.find((item) => item.slug === slugify(slug)) || null;

export const getGuide = (slug) =>
  GUIDES.find((item) => item.slug === slugify(slug)) || null;

export const getGuideTopic = (slug) =>
  GUIDE_TOPICS.find((item) => item.slug === slugify(slug)) || null;

export const getSeoLanding = (kind, slug) => {
  const normalizedKind = slugify(kind);
  if (["brand", "brands"].includes(normalizedKind)) return getBrandBySlug(slug);
  if (["vehicle", "vehicles", "car", "cars"].includes(normalizedKind)) {
    return getVehicleBySlug(slug);
  }
  if (["size", "sizes", "tyre-size", "tyre-sizes"].includes(normalizedKind)) {
    return getSizeBySlug(slug);
  }
  if (["rim", "rims", "rim-size", "rim-sizes"].includes(normalizedKind)) {
    return getRimHubBySlug(slug);
  }
  if (["guide", "guides", "article", "articles"].includes(normalizedKind)) {
    return getGuide(slug);
  }
  if (["guide-topic", "guide-topics", "topic", "topics"].includes(normalizedKind)) {
    return getGuideTopic(slug);
  }
  return null;
};

export default {
  SEO_BRANDS,
  SEO_VEHICLES,
  SEO_SIZES,
  TYRE_RIM_HUBS,
  GUIDES,
  GUIDE_TOPICS,
  getSeoLanding,
  getGuide,
  getGuideTopic,
  getRimHubBySlug,
};
