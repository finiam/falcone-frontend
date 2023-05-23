import { BaseOption, OptionSide, OptionType } from "@/types/option";
import BN from "bn.js";
import {
  BASE_MATH_64_61,
  OPTION_IDX,
  ETH_DIGITS,
  PRECISSION_BASE_VALUE,
  PRECISSION_DIGITS,
  USD_DIGITS,
} from "./constants";

export function getSide(val: BN) {
  return val.toNumber() === 1 ? OptionSide.Short : OptionSide.Long;
}

export function getSideName(val: OptionSide) {
  return val === OptionSide.Short ? "short" : "long";
}

export function getType(val: BN) {
  return val.toNumber() === 1 ? OptionType.Put : OptionType.Call;
}

export function getTypeName(val: OptionType) {
  return val === OptionType.Call ? "call" : "put";
}

export function shortInteger(str: string, digits: number) {
  if (!str) {
    return 0;
  }

  const padded = str.padStart(digits, "0");
  const [head, tail] = [
    padded.substring(0, padded.length - digits),
    padded.substring(padded.length - digits),
  ];

  return parseFloat(head + "." + tail);
}

export function math64x61toDecimal(n: string) {
  const long = new BN(n)
    .mul(PRECISSION_BASE_VALUE)
    .div(BASE_MATH_64_61)
    .toString(10);
  return shortInteger(long, PRECISSION_DIGITS);
}

export function math64x61ToInt(n: string, digits: number) {
  return new BN(n)
    .mul(new BN(10).pow(new BN(digits)))
    .div(BASE_MATH_64_61)
    .toString(10);
}

export function getPremium(val: BN, optionType: OptionType) {
  const digits = optionType === OptionType.Call ? ETH_DIGITS : USD_DIGITS;
  const premiumBase = math64x61ToInt(val.toString(10), digits);
  const premiumDecimal = shortInteger(premiumBase, digits);

  return { premiumBase, premiumDecimal };
}

export function getValsFromOptionChunk(rawOption: BN[]) {
  return {
    optionSide: rawOption[OPTION_IDX.optionSide],
    optionType: rawOption[OPTION_IDX.optionType],
    maturity: rawOption[OPTION_IDX.maturity],
    baseToken: rawOption[OPTION_IDX.baseToken],
    quoteToken: rawOption[OPTION_IDX.quoteToken],
    strikePrice: rawOption[OPTION_IDX.strikePrice],
  };
}
