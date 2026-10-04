const SIZE_CODES = [
  "145/70 R12",
  "155/70 R12",
  "145/80 R13",
  "155/80 R13",
  "165/70 R13",
  "155/65 R14",
  "165/60 R14",
  "165/65 R14",
  "175/65 R14",
  "185/65 R14",
  "165/55 R15",
  "175/65 R15",
  "185/55 R15",
  "185/60 R15",
  "185/65 R15",
  "195/55 R15",
  "195/65 R15",
  "185/55 R16",
  "195/55 R16",
  "195/60 R16",
  "205/55 R16",
  "205/60 R16",
  "215/55 R16",
  "265/70 R16",
  "215/50 R17",
  "215/55 R17",
  "225/45 R17",
  "265/65 R17",
  "225/55 R18",
  "225/60 R18",
  "235/40 R18",
  "235/45 R18",
  "235/50 R18",
  "265/60 R18",
  "225/55 R19",
  "235/45 R19",
  "235/55 R19",
  "245/40 R19",
  "245/45 R19",
  "265/50 R20",
  "285/40 R22",
  "305/35 R24",
];

const parseSize = (size) => {
  const match = size.match(/^(\d{3})\/(\d{2}) R(\d{2})$/);
  if (!match) throw new Error(`Invalid tyre-size manifest entry: ${size}`);
  const width = Number(match[1]);
  const profile = Number(match[2]);
  const rim = Number(match[3]);
  return {
    size,
    width,
    profile,
    aspectRatio: profile,
    rim,
    slug: `${width}-${profile}-r${rim}`,
    path: `/tyre-sizes/${width}-${profile}-r${rim}`,
  };
};

export const TYRE_SIZE_MANIFEST = SIZE_CODES.map(parseSize);

export const findTyreSize = ({ width, profile, rim }) =>
  TYRE_SIZE_MANIFEST.find(
    (item) =>
      String(item.width) === String(width) &&
      String(item.profile) === String(profile) &&
      String(item.rim) === String(rim),
  ) || null;

export default TYRE_SIZE_MANIFEST;
