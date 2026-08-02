import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const posts = await Post.find({}).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, excerpt, content } = body;

    if (!title || !category || !excerpt) {
      return NextResponse.json(
        { error: "Title, category, and excerpt are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newPost = await Post.create({
      title: title.trim(),
      category: category.trim(),
      excerpt: excerpt.trim(),
      content: content ? content.trim() : excerpt.trim(),
      authorName: user.name,
      authorAvatar: user.avatarUrl || "https://picsum.photos/seed/author/100/100",
      author: user._id,
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
