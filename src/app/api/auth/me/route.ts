import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  await dbConnect();
  const user = await User.findById(session.userId).select("-password");
  return NextResponse.json({ user });
}
