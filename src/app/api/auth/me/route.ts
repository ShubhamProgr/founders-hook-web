import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
      onboardingComplete: user.onboardingComplete,
      professionalStatus: user.professionalStatus,
      techFields: user.techFields,
      expertiseLevel: user.expertiseLevel,
      lookingFor: user.lookingFor,
    },
  });
}
