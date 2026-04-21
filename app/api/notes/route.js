import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";

// GET /api/notes — fetch all notes, optional ?search=query
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = {};
    if (search && search.trim()) {
      query = {
        title: { $regex: search.trim(), $options: "i" },
      };
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: notes }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/notes — create a new note
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    const note = await Note.create({ title, description });
    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
