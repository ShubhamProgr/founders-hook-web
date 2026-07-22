import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { role, field, experience, skills, lookingFor, availability } = await req.json();

  await dbConnect();
  const user = await User.findByIdAndUpdate(
    session.userId,
    {
      role,
      field,
      experience,
      skills,
      lookingFor,
      availability,
      onboardingComplete: true,
    },
    { new: true }
  ).select("-password");

  return NextResponse.json({ user });
}
