import _ from "lodash";
import { InputQuestion, SelectQuestion, data } from "@/data/assessmentData";
import { OptionArg, OptionSide, OptionType } from "@/types/option";
import { isCall, isLong } from "@/lib/units";

const N_SELECT_TYPE_QUESTIONS = 2;
const N_INPUT_TYPE_QUESTIONS = 1;

export type UserQuestion<T> = {
  id: string;
  data: T;
  type: "select" | "input";
  status: "unanswered" | "answered";
  correct?: boolean;
  userAnswer?: string;
};

export type UserSelectQuestion = UserQuestion<SelectQuestion>;
export type UserInputQuestion = UserQuestion<InputQuestion>;

export const getQuestions = (
  optionSide: OptionSide,
  optionType: OptionType
): (UserInputQuestion | UserSelectQuestion)[] => {
  const [side, type] = [
    isLong(optionSide) ? "long" : "short",
    isCall(optionType) ? "call" : "put",
  ];

  const selectTypeQuestions = _.sampleSize(
    data[side][type].selectType,
    N_SELECT_TYPE_QUESTIONS
  );
  const inputTypeQuestions = _.sampleSize(
    data[side][type].inputType,
    N_INPUT_TYPE_QUESTIONS
  );

  return [
    ...selectTypeQuestions.map((item, idx) => ({
      id: idx.toString(),
      data: item,
      type: "select",
      status: "unanswered",
    })),
    ...inputTypeQuestions.map((item, idx) => ({
      id: (N_SELECT_TYPE_QUESTIONS + idx).toString(),
      data: item,
      type: "input",
      status: "unanswered",
    })),
  ] as (UserInputQuestion | UserSelectQuestion)[];
};

export const getAssessmentScore = (
  questions: UserQuestion<InputQuestion | SelectQuestion>[]
) => {
  const red = questions.reduce(
    (acc, { correct }) => (correct ? acc + 1 : acc),
    0
  );
  return red;
};

export const getInputQuestionAnswer = (
  option: OptionArg,
  {
    closingPriceOffset,
    strikePriceOffset,
    profit,
    inputType,
    premium,
  }: InputQuestion,
  ethInUsd: number
): number => {
  if (isLong(option.side)) {
    if (inputType === "loss") return premium;

    if (isCall(option.type)) {
      if (inputType === "profit") {
        return closingPriceOffset - (strikePriceOffset || 0) - premium;
      } else if (inputType === "strike") {
        return closingPriceOffset + ethInUsd - (profit || 0) - premium;
      }
    } else {
      if (inputType === "profit") {
        return (strikePriceOffset || 0) - closingPriceOffset - premium;
      } else if (inputType === "strike") {
        return (profit || 0) + closingPriceOffset + ethInUsd + premium;
      }
    }
  } else {
    if (inputType === "profit") return premium;
    // TODO: calculate answer for other question types
  }

  return 0;
};
