import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signSession } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/auth-constants"; 

// 1. Define Validation Schema
const RegisterSchema = z.object({
  name: z.string().min(2, "Name is too short").max(60),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(24)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req: NextRequest) {
  try {
    // 2. Parse and Validate Request Body
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid input provided.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { name, username, email, password } = parsed.data;

    // 3. Connect to Database
    await connectToDatabase();

    // 4. Check for Existing User
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existingUser) {
      const isEmailTaken = existingUser.email === email.toLowerCase();
      const field = isEmailTaken ? "Email" : "Username";
      return NextResponse.json(
        { error: `${field} is already in use.` },
        { status: 409 }
      );
    }

    // 5. Hash Password and Create User
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash,
      avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(username)}/200/200`,
    });

    // 6. Generate Session Token
    const token = await signSession({ 
      userId: newUser._id.toString(), 
      username: newUser.username 
    });
    
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // 8. Construct Success Response (201 Created)
    return NextResponse.json(
      {
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          username: newUser.username,
          onboardingComplete: newUser.onboardingComplete,
        },
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error("Registration Error:", error);
    
    // Handle MongoDB Validation Errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json(
        { error: `Database Validation Error: ${messages.join(", ")}` }, 
        { status: 400 }
      );
    }
    
    // Handle MongoDB Duplicate Key Errors (Failsafe)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A user with this email or username already exists." }, 
        { status: 409 }
      );
    }

    // Generic Fallback Error
    return NextResponse.json(
      { error: "An unexpected error occurred during registration. Please try again." }, 
      { status: 500 }
    );
  }
}