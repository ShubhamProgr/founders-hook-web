import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

// Schema now just checks that the body is an object of key/value pairs
const DynamicOnboardingSchema = z.record(z.string(), z.any());

export async function POST(req: NextRequest) {
  try {
    // FIX: Await the cookies() function before calling .get()
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const session = token ? verifySession(token) : null;
    
    if (!session) {
      return NextResponse.json({ error: "Please log in first" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = DynamicOnboardingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    await connectToDatabase();

    const updated = await User.findByIdAndUpdate(
      session.userId,
      { 
        onboardingAnswers: parsed.data, 
        onboardingComplete: true 
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
    
  } catch (error) {
    console.error("Onboarding submission error:", error);
    return NextResponse.json({ error: "Something went wrong saving your answers" }, { status: 500 });
  }
}