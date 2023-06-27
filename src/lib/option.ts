import {
  BaseOption,
  LiveOption,
  OptionSide,
  OptionType,
  OptionWithPosition,
  RawOption,
} from "@/types/option";
import BN from "bn.js";
import { number } from "starknet";
import { ETH_DIGITS, OPTION_IDX, USD_DIGITS } from "./constants";
import {
  getPremium,
  getSide,
  getType,
  isCall,
  isLong,
  longInteger,
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

function parseRawOption(raw: BN[]) {
  return {
    optionSide: raw[OPTION_IDX.optionSide],
    optionType: raw[OPTION_IDX.optionType],
    maturity: raw[OPTION_IDX.maturity],
    baseToken: raw[OPTION_IDX.baseToken],
    quoteToken: raw[OPTION_IDX.quoteToken],
    strikePrice: raw[OPTION_IDX.strikePrice],
  };
}

function parseBaseOption(rawOption: RawOption): BaseOption {
  const data = {
    id: crypto.randomUUID(),
    optionSide: getSide(rawOption.optionSide),
    optionType: getType(rawOption.optionType),
    maturity: Number(rawOption.maturity.toString()) * 1000,
    baseToken: number.toHex(rawOption.baseToken),
    quoteToken: number.toHex(rawOption.quoteToken),
    strikePrice: math64x61toDecimal(rawOption.strikePrice.toString(10)),
  };

  return {
    ...data,
    digits: isCall(data.optionType) ? ETH_DIGITS : USD_DIGITS,
    isLong: isLong(data.optionSide),
    isShort: !isLong(data.optionSide),
    isCall: isCall(data.optionType),
    isPut: !isCall(data.optionType),
    raw: rawOption,
  };
}

export function parseLiveOptions(raw: string[]): LiveOption[] {
  return createBNChunks(raw, 7).map((chunk) => {
    const rawData = parseRawOption(chunk);
    const base = parseBaseOption(rawData);
    const { premiumBase, premiumDecimal } = getPremium(
      chunk[OPTION_IDX.premium],
      base.optionType
    );

    return {
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
        const rawData = parseRawOption(chunk);
        const base = parseBaseOption(rawData);

        const positionSize = shortInteger(
          chunk[OPTION_IDX.positionSize].toString(),
          ETH_DIGITS
        );
        const positionValue = math64x61toDecimal(
          chunk[OPTION_IDX.positionValue].toString(10)
        );

        return {
          ...base,
          positionSize,
          positionValue,
        };
      })
      // remove position with size 0 (BE rounding error)
      .filter((opt) => !!opt.positionSize)
  );
}

export function filterOptions(
  options: LiveOption[],
  {
    type,
    side,
  }: {
    type: OptionType;
    side: OptionSide;
  }
) {
  return options.filter(
    ({ optionSide, optionType }) => optionSide === side && optionType === type
  );
}

export function getOptionArgs({
  type,
  side,
}: {
  type: "call" | "put";
  side: "long" | "short";
}) {
  return {
    type: type == "call" ? OptionType.Call : OptionType.Put,
    side: side == "long" ? OptionSide.Long : OptionSide.Short,
  };
}
