import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Startup from "@/models/Startup";

export async function GET() {
  await connectToDatabase();

  const [founderCount, startupCount, roleAgg] = await Promise.all([
    User.countDocuments({}),
    Startup.countDocuments({}),
    Startup.aggregate([
      { $project: { count: { $size: { $ifNull: ["$openRoles", []] } } } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]),
  ]);

  const openRoles = roleAgg[0]?.total || 0;

  return NextResponse.json({
    founders: founderCount,
    startups: startupCount,
    openRoles,
  });
}
