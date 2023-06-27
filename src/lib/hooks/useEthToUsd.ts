import { useQuery } from "react-query";

export const getTokenPrice = (id = "ethereum", currency = "usd") =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${currency}`;

export async function getEthToUsd() {
  return fetch(getTokenPrice())
    .then((response) => response.json())
    .then((data) => {
      return data.ethereum.usd as number;
    });
}

export function useEthToUsd() {
  const { data: currency } = useQuery("ethInUsd", getEthToUsd, {
    refetchInterval: 60 * 60 * 1000, // 1h
    refetchOnWindowFocus: false,
  });

  return currency as number;
}
