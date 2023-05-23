import { parseLiveOptions } from "./option";

const BASE_URL = "https://api.carmine-dev.eu/api/v1/testnet";

export async function getAvailableOptions() {
  const req = await fetch(`${BASE_URL}/live-options`);
  const raw = await req.json();

  const options = parseLiveOptions(raw.data);

  return options;
}
