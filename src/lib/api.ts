const BASE_URL = "https://api.carmine.finance/api/v1/testnet";

export async function getRawAvailableOptions() {
  const req = await fetch(`${BASE_URL}/live-options`, {
    next: { revalidate: 10 },
  });

  if (!req.ok) return {};

  const raw = await req.json();

  return raw;
}
