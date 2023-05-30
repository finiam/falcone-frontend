import { OptionSide, OptionType, RawOption } from "@/types/option";
import BN from "bn.js";
import { isCall, isLong, longInteger } from "./units";
import { ETH_DIGITS, USD_DIGITS } from "./constants";
import { number } from "starknet";

export function getAmountToApprove({
  type,
  side,
  size,
  premiaWithSlippage,
  strike,
}: {
  type: OptionType;
  side: OptionSide;
  size: number;
  premiaWithSlippage: BN;
  strike?: number;
}) {
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

export function getPremiaWithSlippage({
  premia,
  side,
  isClosing,
  slippage,
}: {
  premia: BN;
  side: OptionSide;
  isClosing: boolean;
  slippage: number;
}) {
  const fullInBasisPoints = 10000;
  // slippage is in percentage, with 2 decimal precission
  const slippageInBasisPoints = Math.round(slippage * 100);

  const numerator =
    fullInBasisPoints +
    (isLong(side) !== isClosing
      ? slippageInBasisPoints
      : -slippageInBasisPoints);

  return premia.mul(new BN(numerator)).div(new BN(fullInBasisPoints));
}

export function getStruct(raw: RawOption) {
  return [
    number.toHex(raw.optionSide),
    new BN(raw.maturity).toString(10),
    number.toHex(raw.strikePrice),
    number.toHex(raw.baseToken),
    number.toHex(raw.quoteToken),
    number.toHex(raw.optionType),
  ];
}

export function getTradeCalldata(raw: RawOption, size: number) {
  const parsedSize = longInteger(size, ETH_DIGITS).toString();

  return [
    number.toHex(raw.optionType),
    number.toHex(raw.strikePrice),
    new BN(raw.maturity).toString(10),
    number.toHex(raw.optionSide),
    parsedSize,
    number.toHex(raw.baseToken),
    number.toHex(raw.quoteToken),
  ];
}
