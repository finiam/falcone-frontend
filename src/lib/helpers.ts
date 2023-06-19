export function displayPriceWithCurrency(
  value: number | string,
  currency: "USD" | "ETH"
) {
  return currency === "USD" ? "$" : `${currency} ` + value;
}
