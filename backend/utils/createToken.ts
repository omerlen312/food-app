import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

export function createToken(userEmail: string) {
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const payload = {
    email: userEmail,
  };
  const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });
  return token;
}
