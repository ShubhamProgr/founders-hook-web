import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Startup from "@/models/Startup";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? verifySession(token) : null;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  // Match startups collection where founder ObjectId equals current user's ID
  const startups = await Startup.find({
    founder: new mongoose.Types.ObjectId(session.userId),
  })
    .sort({ createdAt: -1 })
    .populate("founder", "name username avatarUrl")
    .populate("members", "name username avatarUrl")
    .lean();

  return NextResponse.json({ startups });
}
