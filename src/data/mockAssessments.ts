export type SelectQuestion = {
  question: string;
  correctAnswer: string;
  options: { id: string; value: string }[];
};

export type QuestionArgs = {
  ethPrice: number;
  strikeOffset?: number;
  profit?: number;
  closingOffset: number;
  premium: number;
};

export type InputQuestion = {
  inputType: "profit" | "strike";
  strikePriceOffset?: number;
  profit?: number;
  closingPriceOffset: number;
  premium: number;
  question: ({
    ethPrice,
    strikeOffset,
    profit,
    closingOffset,
    premium,
  }: QuestionArgs) => string;
};

export type Assessment = {
  selectType: SelectQuestion[];
  inputType: InputQuestion[];
};

export type AssessmentData = {
  [key: string]: {
    [key: string]: Assessment;
  };
};

export const data: AssessmentData = {
  long: {
    call: {
      selectType: [
        {
          question: "Buying Call - MC question 1",
          correctAnswer: "2",
          options: [
            { id: "1", value: "wrong answer" },
            { id: "2", value: "right answer" },
            { id: "3", value: "wrong answer" },
            { id: "4", value: "wrong answer" },
          ],
        },
        {
          question: "Buying Call - MC question 2",
          correctAnswer: "4",
          options: [
            { id: "1", value: "wrong answer" },
            { id: "2", value: "wrong answer" },
            { id: "3", value: "wrong answer" },
            { id: "4", value: "right answer" },
          ],
        },
        {
          question: "Buying Call - MC question 3",
          correctAnswer: "1",
          options: [
            { id: "1", value: "right answer" },
            { id: "2", value: "wrong answer" },
            { id: "3", value: "wrong answer" },
            { id: "4", value: "wrong answer" },
          ],
        },
        {
          question: "Buying Call - MC question 4",
          correctAnswer: "3",
          options: [
            { id: "1", value: "wrong answer" },
            { id: "2", value: "wrong answer" },
            { id: "3", value: "right answer" },
            { id: "4", value: "wrong answer" },
          ],
        },
      ],
      inputType: [
        {
          inputType: "profit",
          strikePriceOffset: 200,
          closingPriceOffset: 700,
          premium: 100,
          question: ({
            ethPrice,
            strikeOffset,
            closingOffset,
            premium,
          }: QuestionArgs) =>
            `You believe that the price of ETH, currently trading at ${ethPrice}, will increase in the near future so you buy a call option with a strike price of ${
              ethPrice + Number(strikeOffset)
            } for a premium of ${premium}. At the expiration date ETH is valued at ${
              ethPrice + closingOffset
            } so you decide to exercise your option, what is your profit?`,
        },
        {
          inputType: "strike",
          profit: 450,
          closingPriceOffset: 800,
          premium: 80,
          question: ({
            ethPrice,
            profit,
            closingOffset,
            premium,
          }: QuestionArgs) =>
            `You believe that the price of ETH, currently trading at ${ethPrice}, will increase in the near future so you buy a call option for a premium of ${premium}. At the expiration date ETH is valued at ${
              ethPrice + closingOffset
            } so you decide to exercise your option with a profit of ${profit}. What was strike price?`,
        },
      ],
    },
    put: {
      selectType: [
        {
          question: "Buying Put - MC question 1",
          correctAnswer: "2",
          options: [
            { id: "1", value: "wrong answer" },
            { id: "2", value: "right answer" },
            { id: "3", value: "wrong answer" },
            { id: "4", value: "wrong answer" },
          ],
        },
        {
          question: "Buying Put - MC question 2",
          correctAnswer: "4",
          options: [
            { id: "1", value: "wrong answer" },
            { id: "2", value: "wrong answer" },
            { id: "3", value: "wrong answer" },
            { id: "4", value: "right answer" },
          ],
        },
        {
          question: "Buying Put - MC question 3",
          correctAnswer: "1",
          options: [
            { id: "1", value: "right answer" },
            { id: "2", value: "wrong answer" },
            { id: "3", value: "wrong answer" },
            { id: "4", value: "wrong answer" },
          ],
        },
        {
          question: "Buying Put - MC question 4",
          correctAnswer: "3",
          options: [
            { id: "1", value: "wrong answer" },
            { id: "2", value: "wrong answer" },
            { id: "3", value: "right answer" },
            { id: "4", value: "wrong answer" },
          ],
        },
      ],
      inputType: [
        {
          inputType: "profit",
          strikePriceOffset: 200,
          closingPriceOffset: 700,
          premium: 100,
          question: ({
            ethPrice,
            strikeOffset,
            closingOffset,
            premium,
          }: QuestionArgs) =>
            `You believe that the price of ETH, currently trading at ${ethPrice}, will increase in the near future so you buy a call option with a strike price of ${
              ethPrice + Number(strikeOffset)
            } for a premium of ${premium}. At the expiration date ETH is valued at ${
              ethPrice + closingOffset
            } so you decide to exercise your option, what is your profit?`,
        },
        {
          inputType: "profit",
          strikePriceOffset: 200,
          closingPriceOffset: 700,
          premium: 100,
          question: ({
            ethPrice,
            strikeOffset,
            closingOffset,
            premium,
          }: QuestionArgs) =>
            `You believe that the price of ETH, currently trading at ${ethPrice}, will increase in the near future so you buy a call option with a strike price of ${
              ethPrice + Number(strikeOffset)
            } for a premium of ${premium}. At the expiration date ETH is valued at ${
              ethPrice + closingOffset
            } so you decide to exercise your option, what is your profit?`,
        },
      ],
    },
  },
};
