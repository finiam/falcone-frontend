import { BaseOption, LiveOption } from "@/types/option";
import BN from "bn.js";
import { number } from "starknet";
import { OPTION_IDX } from "./constants";
import {
  getPremium,
  getSide,
  getType,
  getValsFromOptionChunk,
  math64x61toDecimal,
  toHex,
} from "./units";

function createBNChunks(raw: string[], size: number) {
  const out = [];

  for (let i = 0; i < raw.length / size; i++) {
    const idx = i * size;
    const chunk = raw.slice(idx, idx + size).map((val) => new BN(val));
    out.push(chunk);
  }

  return out;
}

export function parseBaseOption(rawOption: BN[]): BaseOption {
  const bn = getValsFromOptionChunk(rawOption);

  return {
    optionSide: getSide(bn.optionSide),
    optionType: getType(bn.optionType),
    maturity: Number(bn.maturity.toString()) * 1000,
    baseToken: number.toHex(bn.baseToken),
    quoteToken: number.toHex(bn.quoteToken),
    strikePrice: math64x61toDecimal(bn.strikePrice.toString(10)),
  };
}

export function parseLiveOptions(raw: string[]): LiveOption[] {
  return createBNChunks(raw, 7).map((chunk) => {
    const base = parseBaseOption(chunk);
    const { premiumBase, premiumDecimal } = getPremium(
      chunk[OPTION_IDX.premium],
      base.optionType
    );

    return {
      raw: chunk,
      ...base,
      premiumBase,
      premiumDecimal,
    };
  });
}

export function getStruct(raw: BN[]) {
  return [
    toHex(raw[OPTION_IDX.optionSide]),
    new BN(raw[OPTION_IDX.maturity]).toString(10),
    toHex(raw[OPTION_IDX.strikePrice]),
    toHex(raw[OPTION_IDX.baseToken]),
    toHex(raw[OPTION_IDX.quoteToken]),
    toHex(raw[OPTION_IDX.optionType]),
  ];
}
