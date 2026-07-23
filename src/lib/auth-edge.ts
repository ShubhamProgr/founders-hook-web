import { jwtVerify } from "jose";

// middleware.ts runs on the Edge runtime, which can't use the `jsonwebtoken`
// package (it relies on Node's crypto module). `jose` works in both runtimes,
// so it's used here just for the lightweight "is this cookie valid" check.
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me"
);

export async function verifySessionEdge(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; username: string };
  } catch {
    return null;
  }
}
