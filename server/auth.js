import crypto from "node:crypto";

const isProduction =
  process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

const secret = () => {
  const configured = String(process.env.JWT_SECRET || "").trim();
  if (configured.length >= 32) return configured;
  if (isProduction)
    throw new Error(
      "JWT_SECRET must be configured with at least 32 characters in production",
    );
  return configured || "development-only-change-this-secret";
};
const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

export function hashPassword(
  password,
  salt = crypto.randomBytes(16).toString("hex"),
) {
  return { salt, hash: crypto.scryptSync(password, salt, 64).toString("hex") };
}

const scrypt = (password, salt) =>
  new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });

export async function verifyPassword(password, salt, stored) {
  const actual = Buffer.from((await scrypt(password, salt)).toString("hex"));
  const expected = Buffer.from(stored);
  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(actual, expected)
  );
}

export function signToken(admin) {
  const payload = encode({
    id: admin._id,
    email: admin.email,
    exp: Date.now() + 1000 * 60 * 60 * 12,
  });
  const signature = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function requireAdmin(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const token = authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : "";
    const [payload, signature] = token?.split(".") || [];
    if (!payload || !signature) throw new Error();
    const expected = crypto
      .createHmac("sha256", secret())
      .update(payload)
      .digest("base64url");
    if (
      !signature ||
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    )
      throw new Error();
    const user = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (user.exp < Date.now()) throw new Error();
    req.admin = user;
    next();
  } catch {
    res.status(401).json({ message: "Admin authentication required" });
  }
}
