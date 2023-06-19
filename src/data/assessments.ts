import { OptionSide, OptionType } from "@/types/option";

export enum AnswerOptions {
  In = "In-the-money",
  Out = "Out-of-the-money",
}

export type AssessmentType = {
  id: string;
  optionSide: OptionSide;
  optionType: OptionType;
  strikePriceOffset: number;
  premium: { value: number; currency: "USD" | "ETH" };
  closingPriceOffset: number;
  position: AnswerOptions;
  answerDescription: string;
};

const data: { buying: AssessmentType[]; selling: AssessmentType[] } = {
  buying: [
    {
      id: "1",
      optionSide: OptionSide.Long,
      optionType: OptionType.Call,
      strikePriceOffset: 150,
      premium: { value: 0.0073, currency: "ETH" },
      closingPriceOffset: 250,
      position: AnswerOptions.In,
      answerDescription:
        "You can exercise the Call option and buy the stock at the lower strike price, potentially making a profit.",
    },
    {
      id: "2",
      optionSide: OptionSide.Long,
      optionType: OptionType.Call,
      strikePriceOffset: 150,
      premium: { value: 0.0068, currency: "ETH" },
      closingPriceOffset: -50,
      position: AnswerOptions.Out,
      answerDescription: "",
    },
  ],
  selling: [
    {
      id: "3",
      optionSide: OptionSide.Short,
      optionType: OptionType.Call,
      strikePriceOffset: 150,
      premium: { value: 0.0073, currency: "ETH" },
      closingPriceOffset: 250,
      position: AnswerOptions.In,
      answerDescription: "",
    },
    {
      id: "4",
      optionSide: OptionSide.Short,
      optionType: OptionType.Put,
      strikePriceOffset: 100,
      premium: { value: 5.012, currency: "USD" },
      closingPriceOffset: 150,
      position: AnswerOptions.Out,
      answerDescription: "",
    },
  ],
};

export default data;
