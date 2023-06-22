import { LiveOption } from "@/types/option";
import { create } from "zustand";

type OptionScenario = {
  option: LiveOption;
  ethFloor: number;
  ethCeil: number;
  optSize: number;
  stops: number[];
  line: number[];
  ethToUsd: number;

  init: (option: LiveOption, ethPrice: number) => void;
  setStrikePrice: (val: number) => void;
  setOptSize: (size: number) => void;
  setEthToUsd: (val: number) => void;
  regenLine: () => void;
};

const ETH_RANGE_VARIANCE = 300;
const STOP_SIZE = 10;

function genEthPriceStops(ethPrice: number) {
  const stops: number[] = [];

  for (
    let i = ethPrice - ETH_RANGE_VARIANCE;
    i < ethPrice + ETH_RANGE_VARIANCE;
    i += STOP_SIZE
  ) {
    stops.push(i);
  }

  return stops;
}

function genResultForPoint(
  point: number,
  option: LiveOption,
  optSize: number,
  ethToUsd: number
) {
  if (option.isCall && option.isLong) {
    const fixedCost = option.premiumDecimal * ethToUsd * optSize;

    if (point < option.strikePrice) {
      return fixedCost * -1;
    }

    return point - option.strikePrice - fixedCost;
  }

  if (option.isCall && option.isShort) {
    const maxProfit = option.premiumDecimal * ethToUsd * optSize;

    if (point < option.strikePrice) {
      return maxProfit;
    }

    return option.strikePrice - point + maxProfit;
  }

  if (option.isPut && option.isLong) {
    const fixedCost = option.premiumDecimal * optSize;

    if (point < option.strikePrice) {
      return option.strikePrice - point - fixedCost;
    }

    return fixedCost * -1;
  }

  if (option.isPut && option.isShort) {
    const maxProfit = option.premiumDecimal * optSize;

    if (point < option.strikePrice) {
      return (option.strikePrice - point) * -1 + maxProfit;
    }

    return maxProfit;
  }

  return 0;
}

const useOptionScenario = create<OptionScenario>((set, get) => ({
  option: undefined as unknown as LiveOption,
  ethFloor: 0,
  ethCeil: 0,
  optSize: 1,
  stops: [],
  line: [],
  ethToUsd: 0,

  init(option, ethToUsd) {
    const stops = genEthPriceStops(option.strikePrice);

    set(() => ({
      option,
      optSize: 1,
      stops,
      ethToUsd,
      ethFloor: stops[0],
      ethCeil: stops[stops.length - 1],
    }));

    get().regenLine();
  },

  regenLine() {
    const { stops, option, ethToUsd, optSize } = get();

    const line = stops.map((price) =>
      genResultForPoint(price, option, optSize, ethToUsd)
    );

    set((store) => ({
      ...store,
      line,
    }));
  },

  setStrikePrice(val) {
    if (val < 0) return;

    const { ethFloor, ethCeil, ethToUsd } = get();

    set((store) => ({
      ...store,
      option: {
        ...store.option,
        strikePrice: val,
      },
    }));

    if (val > ethCeil || val < ethFloor) {
      const stops = genEthPriceStops(ethToUsd);

      set((store) => ({
        ...store,
        stops,
        ethFloor: stops[0],
        ethCeil: stops[stops.length - 1],
      }));
    }

    get().regenLine();
  },

  setOptSize(size: number) {
    if (size <= 0) return;

    set((store) => ({
      ...store,
      optSize: size,
    }));

    get().regenLine();
  },

  setEthToUsd(val: number) {
    if (!val) return;

    const stops = genEthPriceStops(val);

    set((store) => ({
      ...store,
      stops,
      ethToUsd: val,
    }));

    get().regenLine();
  },
}));

export { useOptionScenario };
