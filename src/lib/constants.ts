import BN from "bn.js";

export const ETH_DIGITS = 18;
export const USD_DIGITS = 6;
export const BASE_MATH_64_61 = new BN(2).pow(new BN(61));
export const PRECISION_DIGITS = 20;
export const PRECISION_BASE_VALUE = new BN(10).pow(new BN(PRECISION_DIGITS));
export const OPTION_IDX = {
  optionSide: 0,
  maturity: 1,
  strikePrice: 2,
  baseToken: 4,
  quoteToken: 3,
  optionType: 5,
  premium: 6,
  positionSize: 6,
  positionValue: 8,
};
