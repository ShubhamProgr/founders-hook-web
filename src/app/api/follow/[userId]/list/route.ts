import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/follow/[userId]/list?type=followers|following
// Returns the list of users who are followers or following a given user
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type !== "followers" && type !== "following") {
      return NextResponse.json({ error: "type must be 'followers' or 'following'" }, { status: 400 });
    }

    await connectToDatabase();

    const targetUser = await User.findById(userId)
      .select(`${type}`)
      .lean<{ followers?: any[]; following?: any[] }>();

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ids: any[] = targetUser[type] ?? [];

    if (ids.length === 0) {
      return NextResponse.json({ users: [] });
    }

    const users = await User.find({ _id: { $in: ids } })
      .select("name username avatarUrl")
      .lean();

    const result = users.map((u: any) => ({
      _id: u._id.toString(),
      name: u.name,
      username: u.username,
      avatarUrl: u.avatarUrl || "",
    }));

    return NextResponse.json({ users: result });
  } catch (error) {
    console.error("Error fetching follow list:", error);
    return NextResponse.json({ error: "Failed to fetch follow list" }, { status: 500 });
  }
}
