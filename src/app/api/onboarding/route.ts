import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import User, {
  PROFESSIONAL_STATUSES,
  TECH_FIELDS,
  EXPERTISE_LEVELS,
  LOOKING_FOR_OPTIONS,
} from "@/models/User";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

const OnboardingSchema = z.object({
  professionalStatus: z.enum(PROFESSIONAL_STATUSES),
  techFields: z.array(z.enum(TECH_FIELDS)).min(1, "Pick at least one field"),
  expertiseLevel: z.enum(EXPERTISE_LEVELS),
  lookingFor: z.enum(LOOKING_FOR_OPTIONS),
  college: z.string().max(120).optional(),
  bio: z.string().max(280).optional(),
});

export async function POST(req: NextRequest) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? verifySession(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Please log in first" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = OnboardingSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Please answer every question";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  await connectToDatabase();

  const updated = await User.findByIdAndUpdate(
    session.userId,
    { ...parsed.data, onboardingComplete: true },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
