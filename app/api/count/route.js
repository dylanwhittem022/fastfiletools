import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const data = await pdf(buffer);

    const text = data.text || "";

    // Count words
    const words = text
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return NextResponse.json({
      wordCount: words.length,
      charCount: text.length
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
