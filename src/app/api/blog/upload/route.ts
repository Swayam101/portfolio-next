import { NextRequest, NextResponse } from "next/server";
import { checkApiKey } from "@/lib/adminAuth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const authError = checkApiKey(req);
    if (authError) return authError;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a safe unique filename
    const ext = path.extname(file.name) || ".jpg";
    const basename = path.basename(file.name, ext).replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const filename = `${Date.now()}-${basename}${ext}`;
    
    // Ensure the directory exists
    const uploadDir = path.join(process.cwd(), "public", "images", "blog");
    await mkdir(uploadDir, { recursive: true });
    
    // Save the file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const url = `/images/blog/${filename}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[API /api/blog/upload] Error uploading image:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
