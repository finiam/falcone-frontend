const BASE_URL = "https://api.carmine-dev.eu/api/v1/testnet";

export async function getRawAvailableOptions() {
  const req = await fetch(`${BASE_URL}/live-options`, {
    next: { revalidate: 10 },
  });
  const raw = await req.json();

  return raw;
}
