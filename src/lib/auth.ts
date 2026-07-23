import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "./mongodb";
import User, { IUser } from "@/models/User";
import { SESSION_COOKIE } from "./auth-constants";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
export { SESSION_COOKIE };

export interface SessionPayload {
  userId: string;
  username: string;
}

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

/** Reads the session cookie (server components / route handlers) and returns the logged-in user, or null. */
export async function getCurrentUser(): Promise<IUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = verifySession(token);
  if (!payload) return null;

  await connectToDatabase();
  const user = await User.findById(payload.userId).lean<IUser>();
  return user || null;
}
