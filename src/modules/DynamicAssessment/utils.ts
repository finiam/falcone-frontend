import _ from "lodash";
import { SelectQuestion, data } from "@/data/assessmentData";
import { OptionArg } from "./PageAssessment";

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
/* export type UserInputQuestion = UserQuestion<InputQuestion>; */

export const getQuestions = (
  side: string,
  type: string
): UserSelectQuestion[] => {
  const selectTypeQuestions = _.sampleSize(
    data[side][type].selectType,
    N_SELECT_TYPE_QUESTIONS
  );
  /* const inputTypeQuestions = _.sampleSize(
    data[side][type].inputType,
    N_INPUT_TYPE_QUESTIONS
  ); */

  return [
    ...selectTypeQuestions.map((item, idx) => ({
      id: idx.toString(),
      data: item,
      type: "select",
      status: "unanswered",
    })),
    /* ...inputTypeQuestions.map((item, idx) => ({
      id: (N_SELECT_TYPE_QUESTIONS + idx).toString(),
      data: item,
      type: "input",
      status: "unanswered",
    })), */
    {
      id: "scenario",
      type: "scenario",
      status: "unanswered",
    },
  ] as UserSelectQuestion[];
};

export const getAssessmentScore = (
  questions: UserQuestion<SelectQuestion>[]
) => {
  const red = questions.reduce(
    (acc, { correct }) => (correct ? acc + 1 : acc),
    0
  );
  return red;
};

//TODO kill
/* export const getInputQuestionAnswer = (
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
  if (option.side === "long") {
    if (inputType === "loss") return premium;

    if (option.type === "call") {
      if (inputType === "profit") {
        return closingPriceOffset - (strikePriceOffset || 0) - premium;
      } else if (inputType === "strike") {
        return closingPriceOffset + ethInUsd - (profit || 0) - premium;
      }
    } else if (option.type === "put") {
      if (inputType === "profit") {
        return (strikePriceOffset || 0) - closingPriceOffset - premium;
      } else if (inputType === "strike") {
        return (profit || 0) + closingPriceOffset + ethInUsd + premium;
      }
    }
  } else if (option.side === "short") {
    if (inputType === "profit") return premium;
    // TODO: calculate answer for other question types
  }

  return 0;
};
 */