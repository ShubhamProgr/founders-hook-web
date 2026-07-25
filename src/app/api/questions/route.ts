import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Question from "@/models/Question";

export async function GET() {
  try {
    // 1. Open the connection to MongoDB
    await connectToDatabase();

    // 2. Fetch all questions and sort them by the "order" number you set
    const questions = await Question.find({}).sort({ order: 1 });

    // 3. Send them back to the frontend
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return NextResponse.json(
      { error: "Failed to load onboarding questions" }, 
      { status: 500 }
    );
  }
}