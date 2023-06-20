import { getRawAvailableOptions } from "@/lib/api";
import { parseLiveOptions } from "@/lib/option";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const raw = await getRawAvailableOptions();
  
  const parsed = parseLiveOptions(raw.data);

  return NextResponse.json(parsed);
}
