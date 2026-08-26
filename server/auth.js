import crypto from "node:crypto";

const secret = () =>
  process.env.JWT_SECRET || "change-this-secret-in-production";
const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

export function hashPassword(
  password,
  salt = crypto.randomBytes(16).toString("hex"),
) {
  return { salt, hash: crypto.scryptSync(password, salt, 64).toString("hex") };
}

export function verifyPassword(password, salt, stored) {
  const actual = Buffer.from(
    crypto.scryptSync(password, salt, 64).toString("hex"),
  );
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
    const token = req.headers.authorization?.replace("Bearer ", "");
    const [payload, signature] = token?.split(".") || [];
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
