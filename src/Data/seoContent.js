export const SEO_CONTENT_UPDATED = "2026-09-30";

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
  const categoryLink = ["dunlop", "yokohama", "bridgestone", "toyo", "falken"].includes(slug)
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

export const SEO_SIZES = [
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

const guide = ({
  slug,
  title,
  excerpt,
  readMinutes,
  category,
  publishedAt,
  image,
  imageAlt,
  imageCaption,
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
  publishedAt,
  updatedAt: SEO_CONTENT_UPDATED,
  author: { name: "Wheels & Wheels tyre team", url: "/about" },
  image,
  imageAlt,
  imageCaption,
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
    image: "/tyre.jpg",
    imageAlt: "Representative stack of passenger tyres for a tyre-size guide",
    imageCaption: "Representative tyres. Read the complete sidewall specification on the exact tyre and verify it against the vehicle before purchase.",
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
    image: "/tyre.jpg",
    imageAlt: "Representative stack of passenger tyres for comparing tyre categories",
    imageCaption: "Representative tyres. Compare exact patterns and specifications rather than relying on origin or price alone.",
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
    image: "/tyreinstallation.jpg",
    imageAlt: "Tyre inspection during professional installation",
    imageCaption: "Inspect the physical tyre, sidewall markings and invoice details before accepting supply.",
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
    image: "/wheelalignment.jpeg",
    imageAlt: "Computerised wheel alignment inspection in Lahore",
    imageCaption: "Alignment corrects wheel angles; balancing corrects rotating weight distribution.",
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
    image: "/wheel.jpg",
    imageAlt: "Representative tyre and wheel for a seasonal tyre-care guide",
    imageCaption: "Representative image. Pressure, tread, damage and the spare deserve a repeatable seasonal check.",
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
    image: "/15inch.png",
    imageAlt: "Representative passenger tyre and alloy wheel for a 195/65 R15 guide",
    imageCaption: "Representative image only. For 195/65 R15, load and speed markings still need verification on the exact tyre.",
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
];

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

export const getGuide = (slug) =>
  GUIDES.find((item) => item.slug === slugify(slug)) || null;

export const getSeoLanding = (kind, slug) => {
  const normalizedKind = slugify(kind);
  if (["brand", "brands"].includes(normalizedKind)) return getBrandBySlug(slug);
  if (["vehicle", "vehicles", "car", "cars"].includes(normalizedKind)) {
    return getVehicleBySlug(slug);
  }
  if (["size", "sizes", "tyre-size", "tyre-sizes"].includes(normalizedKind)) {
    return getSizeBySlug(slug);
  }
  if (["guide", "guides", "article", "articles"].includes(normalizedKind)) {
    return getGuide(slug);
  }
  return null;
};

export default {
  SEO_BRANDS,
  SEO_VEHICLES,
  SEO_SIZES,
  GUIDES,
  getSeoLanding,
  getGuide,
};
