import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

// POST /api/follow — follow a user
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
    }

    const currentId = (currentUser._id as any).toString();
    if (currentId === targetUserId) {
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
    }

    await connectToDatabase();

    // Add targetUserId to currentUser's following (idempotent via $addToSet)
    await User.findByIdAndUpdate(currentId, {
      $addToSet: { following: targetUserId },
    });

    // Add currentUser's id to target user's followers (idempotent via $addToSet)
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentId },
    });

    return NextResponse.json({ success: true, action: "followed" });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
  }
}

// DELETE /api/follow — unfollow a user
export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
    }

    await connectToDatabase();

    const currentId = (currentUser._id as any).toString();

    // Remove targetUserId from currentUser's following
    await User.findByIdAndUpdate(currentId, {
      $pull: { following: targetUserId },
    });

    // Remove currentUser's id from target's followers
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentId },
    });

    return NextResponse.json({ success: true, action: "unfollowed" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 });
  }
}
