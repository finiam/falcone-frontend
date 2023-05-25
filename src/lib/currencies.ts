export const getTokenPrice = (id = "ethereum", currency = "usd") =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${currency}`;

export async function getEthInUsd() {
  return fetch(getTokenPrice())
    .then((response) => response.json())
    .then((data) => data.ethereum.usd as number);
}
