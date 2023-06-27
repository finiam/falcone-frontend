import BN from "bn.js";

export enum OptionSide {
  "Long" = 0,
  "Short" = 1,
}

export enum OptionType {
  "Call" = 0,
  "Put" = 1,
}

export type OptionArg = {
  side: OptionSide;
  type: OptionType;
};

export type OptionTextArg = {
  side: "long" | "short";
  type: "call" | "put";
};

export type RawOption = {
  optionSide: BN;
  optionType: BN;
  strikePrice: BN;
  quoteToken: BN;
  baseToken: BN;
  maturity: BN;
};

export type BaseOption = {
  id: string;
  optionSide: OptionSide;
  optionType: OptionType;
  strikePrice: number;
  quoteToken: string;
  baseToken: string;
  maturity: number;
  isCall: boolean;
  isPut: boolean;
  isLong: boolean;
  isShort: boolean;
  digits: number;
  raw: RawOption;
};

export type LiveOption = BaseOption & {
  premiumBase: string;
  premiumDecimal: number;
};

export type PremiaData = {
  base: number;
  total: number;
  withSlippage: BN;
};

export type OptionWithPosition = BaseOption & {
  positionSize: number;
  positionValue: number;
};
