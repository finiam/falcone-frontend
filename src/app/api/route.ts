import { NextResponse } from "next/server";

const BASE_URL = "https://api.carmine.finance/api/v1/testnet";

export async function GET() {
  const res = await fetch(`${BASE_URL}/live-options`, {
    next: { revalidate: 10 },
  });
  const data = await res.json();

  return NextResponse.json({ data });
}
