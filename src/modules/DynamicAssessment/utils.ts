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

export const getQuestions = (
  side: string,
  type: string
): UserSelectQuestion[] => {
  const selectTypeQuestions = _.sampleSize(
    data[side][type].selectType,
    N_SELECT_TYPE_QUESTIONS
  );

  return [
    ...selectTypeQuestions.map((item, idx) => ({
      id: idx.toString(),
      data: item,
      type: "select",
      status: "unanswered",
    })),
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
