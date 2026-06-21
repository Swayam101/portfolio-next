import { NextRequest, NextResponse } from "next/server";

export function checkApiKey(req: NextRequest): NextResponse | null {
  const expectedApiKey = process.env.BLOG_API_KEY;
  if (!expectedApiKey) {
    return NextResponse.json(
      { error: "Blog API is not configured" },
      { status: 503 }
    );
  }
  const providedApiKey = req.headers.get("x-api-key");
  if (providedApiKey !== expectedApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
