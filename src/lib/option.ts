import { BaseOption, LiveOption, OptionWithPosition } from "@/types/option";
import BN from "bn.js";
import { number, uint256 } from "starknet";
import { ETH_DIGITS, OPTION_IDX } from "./constants";
import {
  getPremium,
  getSide,
  getType,
  getValsFromOptionChunk,
  math64x61toDecimal,
  shortInteger,
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
    id: crypto.randomUUID(),
  };
}

function createId(option: BaseOption) {
  return [option.optionSide, option.optionType, option.strikePrice].toString();
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

export function parseOptionsWithPositions(raw: string[]): OptionWithPosition[] {
  return (
    createBNChunks(raw, 9)
      .map((chunk) => {
        const base = parseBaseOption(chunk);

        const positionSize = shortInteger(
          chunk[OPTION_IDX.positionSize].toString(),
          ETH_DIGITS
        );
        const positionValue = math64x61toDecimal(
          chunk[OPTION_IDX.positionValue].toString(10)
        );

        return {
          raw: chunk,
          ...base,
          positionSize,
          positionValue,
        };
      })
      // remove position with size 0 (BE rounding error)
      .filter((opt) => !!opt.positionSize)
  );
}

export function getStruct(raw: BN[]) {
  return [
    number.toHex(raw[OPTION_IDX.optionSide]),
    new BN(raw[OPTION_IDX.maturity]).toString(10),
    number.toHex(raw[OPTION_IDX.strikePrice]),
    number.toHex(raw[OPTION_IDX.baseToken]),
    number.toHex(raw[OPTION_IDX.quoteToken]),
    number.toHex(raw[OPTION_IDX.optionType]),
  ];
}
