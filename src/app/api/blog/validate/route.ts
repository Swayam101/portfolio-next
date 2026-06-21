import { NextRequest, NextResponse } from "next/server";
import { parseBlogYaml } from "@/lib/parseBlogYaml";
import { checkApiKey } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const authError = checkApiKey(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { yaml } = body;

    if (!yaml || typeof yaml !== "string") {
      return NextResponse.json(
        { valid: false, error: "Missing or invalid 'yaml' field" },
        { status: 400 }
      );
    }

    const parsed = parseBlogYaml(yaml);
    return NextResponse.json({ valid: true, parsed });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown validation error";
    return NextResponse.json(
      { valid: false, error: "Invalid YAML format", details: message },
      { status: 400 }
    );
  }
}
