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

export function isLong(val: OptionSide) {
  return val === OptionSide.Long;
}

export function getType(val: BN) {
  return val.toNumber() === 1 ? OptionType.Put : OptionType.Call;
}

export function isCall(val: OptionType) {
  return val === OptionType.Call;
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
  const long = new BN(n).mul(PRECISSION_BASE_VALUE).div(BASE_MATH_64_61).toString(10);
  return shortInteger(long, PRECISSION_DIGITS);
}

export function math64x61ToInt(n: string, digits: number) {
  return new BN(n)
    .mul(new BN(10).pow(new BN(digits)))
    .div(BASE_MATH_64_61)
    .toString(10);
}

export function intToMath64x61(n: string, digits: number) {
  return new BN(n)
    .mul(BASE_MATH_64_61)
    .div(new BN(10).pow(new BN(digits)))
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

export function digitsByType(type: OptionType) {
  return isCall(type) ? ETH_DIGITS : USD_DIGITS;
}

export const longInteger = (n: number, digits: number): BN => {
  if (!n) {
    return new BN(0);
  }
  const str = n.toString(10);
  const nonScientificNotation = str.includes("e") ? Number(str).toFixed(50) : str;
  const [lead, dec] = nonScientificNotation.split(".");

  if (!dec) {
    return new BN(lead + "".padEnd(digits, "0"));
  }

  const tail = dec
    .padEnd(digits, "0") // pad ending with 0s
    .substring(0, digits); // if more digits than should be, cut them out

  const withLeadingZeros = lead + tail;
  const leadingZeros = withLeadingZeros.match(/^0*([0-9]+)/);

  return leadingZeros && leadingZeros?.length > 1 ? new BN(leadingZeros[1]) : new BN(0);
};

export function toHex(v: BN) {
  return "0x" + v.toString(16);
}
