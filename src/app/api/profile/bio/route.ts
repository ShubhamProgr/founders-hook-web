import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

const BioSchema = z.object({
  bio: z.string().trim().min(80, "Bio is too short").max(1200, "Bio is too long"),
});

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const session = token ? verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Please log in first" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = BioSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid bio" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updated = await User.findByIdAndUpdate(
      session.userId,
      { bio: parsed.data.bio },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, bio: updated.bio });
  } catch (error) {
    console.error("Bio save error:", error);
    return NextResponse.json({ error: "Something went wrong saving your bio" }, { status: 500 });
  }
}
