import { OptionSide, OptionType } from "@/types/option";
import BN from "bn.js";
import { isCall, isLong, longInteger, toHex } from "./units";
import { ETH_DIGITS, OPTION_IDX, USD_DIGITS } from "./constants";

export function getAmountToApprove(
  type: OptionType,
  side: OptionSide,
  size: number,
  premiaWithSlippage: BN,
  strike?: number
) {
  if (isLong(side)) {
    // long call / long put - premia with slippage
    return premiaWithSlippage;
  }

  if (isCall(type)) {
    // short call - locked capital minus premia with slippage
    const base = longInteger(size, ETH_DIGITS);

    const res = base.sub(premiaWithSlippage);

    if (res.ltn(0)) {
      // if this is true, users can get more money than they are locking in
      throw Error("Premia greater than size!");
    }

    return res;
  }

  // short put - locked capital minus premia with slippage
  // locked capital is size * strike price
  if (!strike) {
    throw new Error("Short Put did not receive strike price");
  }
  const base = longInteger(size * strike, USD_DIGITS);

  return base.sub(premiaWithSlippage);
}

export function getPremiaWithSlippage(
  premia: BN,
  side: OptionSide,
  isClosing: boolean,
  slippage: number
) {
  const fullInBasisPoints = 10000;
  // slippage is in percentage, with 2 decimal precission
  const slippageInBasisPoints = Math.round(slippage * 100);
  const numerator =
    fullInBasisPoints +
    (isLong(side) !== isClosing ? slippageInBasisPoints : -slippageInBasisPoints);

  return premia.mul(new BN(numerator)).div(new BN(fullInBasisPoints));
}

export function getTradeCalldata(raw: BN[], size: number) {
  return [
    toHex(raw[OPTION_IDX.optionType]),
    toHex(raw[OPTION_IDX.strikePrice]),
    new BN(raw[OPTION_IDX.maturity]).toString(10),
    toHex(raw[OPTION_IDX.optionSide]),
    size,
    toHex(raw[OPTION_IDX.baseToken]),
    toHex(raw[OPTION_IDX.quoteToken]),
  ];
}
