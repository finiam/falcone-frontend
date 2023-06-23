export type SelectQuestion = {
  question: string;
  correctAnswer: string;
  options: { id: string; value: string }[];
};

export type InputQuestionArgs = {
  ethPrice: number;
  strikePriceOffset?: number;
  profit?: number;
  closingPriceOffset: number;
  premium: number;
};

export type InputQuestion = {
  inputType: "profit" | "strike" | "loss";
  strikePriceOffset?: number;
  profit?: number;
  closingPriceOffset: number;
  premium: number;
  question: (args: InputQuestionArgs) => string;
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
          question: "What is a call option?",
          correctAnswer: "2",
          options: [
            {
              id: "1",
              value:
                "A contract that gives the holder the right to sell an asset at a specified price within a specific time period.",
            },
            {
              id: "2",
              value:
                "A contract that gives the holder the right to buy an asset at a specified price within a specific time period.",
            },
            {
              id: "3",
              value:
                "A contract that gives the holder the right to exchange an asset for cash at a specified price within a specific time period.",
            },
            {
              id: "4",
              value:
                "A contract that gives the holder the right to lease an asset at a specified price within a specific time period.",
            },
          ],
        },
        {
          question: "What is the 'strike price' of a call option?",
          correctAnswer: "3",
          options: [
            {
              id: "1",
              value:
                "The price at which the call option is initially purchased.",
            },
            {
              id: "2",
              value:
                "The price at which the underlying asset is currently trading in the market.",
            },
            {
              id: "3",
              value:
                "The price at which the underlying asset can be bought or sold when exercising the option.",
            },
            { id: "4", value: "The price at which the call option expires." },
          ],
        },
        {
          question:
            "What is the maximum potential loss for a buyer of a call option?",
          correctAnswer: "1",
          options: [
            { id: "1", value: "The premium paid to purchase the call option." },
            { id: "2", value: "Unlimited loss." },
            {
              id: "3",
              value:
                "The difference between the strike price and the market price of the underlying asset.",
            },
            {
              id: "4",
              value:
                "The difference between the strike price and the expiration price of the option.",
            },
          ],
        },
        {
          question: "What is the breakeven price for a buyer of a call option?",
          correctAnswer: "3",
          options: [
            {
              id: "1",
              value: "The market price of the underlying asset at expiration.",
            },
            {
              id: "2",
              value:
                "The difference between the strike price and the market price of the underlying asset.",
            },
            {
              id: "3",
              value:
                "The strike price plus the premium paid for the call option.",
            },
            {
              id: "4",
              value:
                "The difference between the strike price and the expiration price of the option.",
            },
          ],
        },
        {
          question:
            "What is the potential profit for a buyer of a call option?",
          correctAnswer: "4",
          options: [
            {
              id: "1",
              value:
                "The difference between the strike price and the market price of the underlying asset.",
            },
            {
              id: "2",
              value: "The premium received from selling the call option.",
            },
            {
              id: "3",
              value:
                "The difference between the strike price and the expiration price of the option.",
            },
            { id: "4", value: "Unlimited profit potential." },
          ],
        },
        {
          question: "What is the expiration date of a call option?",
          correctAnswer: "2",
          options: [
            {
              id: "1",
              value: "The date when the call option is initially purchased.",
            },
            {
              id: "2",
              value: "The date when the call option contract expires.",
            },
            {
              id: "3",
              value:
                "The date when the underlying asset can be bought or sold.",
            },
            { id: "4", value: "The date when the call option is exercised." },
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
            strikePriceOffset,
            closingPriceOffset,
            premium,
          }: InputQuestionArgs) =>
            `You believe that the price of ETH, currently trading at $${ethPrice}, will increase in the near future so you buy a call option with a strike price of $${
              ethPrice + Number(strikePriceOffset)
            } for a premium of $${premium}. At the expiration date ETH is valued at $${
              ethPrice + closingPriceOffset
            } so you decide to exercise your option, what is your profit? A: $400`,
        },
        {
          inputType: "strike",
          profit: 450,
          closingPriceOffset: 800,
          premium: 80,
          question: ({
            ethPrice,
            profit,
            closingPriceOffset,
            premium,
          }: InputQuestionArgs) =>
            `You believe that the price of ETH, currently trading at $${ethPrice}, will increase in the near future so you buy a call option for a premium of $${premium}. At the expiration date ETH is valued at $${
              ethPrice + closingPriceOffset
            } so you decide to exercise your option with a profit of $${profit}. What was strike price? A: ETH + $270`,
        },
      ],
    },
    put: {
      selectType: [
        {
          question: "What is a put option?",
          correctAnswer: "2",
          options: [
            {
              id: "1",
              value:
                "A contract that gives the holder the right to buy an asset at a specified price within a specific time period.",
            },
            {
              id: "2",
              value:
                "A contract that gives the holder the right to sell an asset at a specified price within a specific time period.",
            },
            {
              id: "3",
              value:
                "A contract that gives the holder the right to exchange an asset for cash at a specified price within a specific time period.",
            },
            {
              id: "4",
              value:
                "A contract that gives the holder the right to lease an asset at a specified price within a specific time period.",
            },
          ],
        },
        {
          question:
            "What is the maximum potential loss for a buyer of a put option?",
          correctAnswer: "1",
          options: [
            { id: "1", value: "The premium paid to purchase the put option." },
            { id: "2", value: "Unlimited loss." },
            {
              id: "3",
              value:
                "The difference between the strike price and the market price of the underlying asset.",
            },
            {
              id: "4",
              value:
                "The difference between the strike price and the expiration price of the option.",
            },
          ],
        },
        {
          question: "What is the 'strike price' of a put option?",
          correctAnswer: "3",
          options: [
            {
              id: "1",
              value:
                "The price at which the put option is initially purchased.",
            },
            {
              id: "2",
              value:
                "The price at which the underlying asset is currently trading in the market.",
            },
            {
              id: "3",
              value:
                "The price at which the underlying asset can be sold when exercising the option.",
            },
            { id: "4", value: "The price at which the put option expires." },
          ],
        },
        {
          question: "What is the breakeven price for a buyer of a put option?",
          correctAnswer: "4",
          options: [
            {
              id: "1",
              value: "The market price of the underlying asset at expiration.",
            },
            {
              id: "2",
              value:
                "The difference between the strike price and the market price of the underlying asset.",
            },
            {
              id: "3",
              value:
                "The strike price minus the premium paid for the put option.",
            },
            {
              id: "4",
              value:
                "The strike price minus the premium paid for the put option.",
            },
          ],
        },
        {
          question: "What is the potential profit for a buyer of a put option?",
          correctAnswer: "2",
          options: [
            {
              id: "1",
              value:
                "The difference between the strike price and the market price of the underlying asset.",
            },
            {
              id: "2",
              value:
                "The difference between the strike price and the expiration price of the option.",
            },
            {
              id: "3",
              value: "The premium received from selling the put option.",
            },
            { id: "4", value: "Unlimited profit potential." },
          ],
        },
        {
          question:
            "What happens if the underlying asset's price is above the strike price of a put option at expiration?",
          correctAnswer: "1",
          options: [
            {
              id: "1",
              value:
                "The put option expires worthless, and the buyer loses the premium paid.",
            },
            {
              id: "2",
              value:
                "The buyer can exercise the put option and sell the underlying asset at a profit.",
            },
            {
              id: "3",
              value:
                "The buyer can extend the expiration date of the put option.",
            },
            {
              id: "4",
              value:
                "The put option automatically gets exercised, and the buyer receives the difference between the strike price and the market price.",
            },
          ],
        },
      ],
      inputType: [
        {
          inputType: "loss",
          strikePriceOffset: -150,
          closingPriceOffset: -100,
          premium: 150,
          question: ({
            ethPrice,
            strikePriceOffset,
            closingPriceOffset,
            premium,
          }: InputQuestionArgs) =>
            `You believe that the price of ETH, currently trading at $${ethPrice}, will decrease in the near future,
           so you decide to buy a put option with a strike price of $${
             ethPrice + Number(strikePriceOffset)
           } for a premium of $${premium}.
           At the expiration date, ETH is valued at $${closingPriceOffset}, so that option is out-of-the-money. What is your loss? A: $100`,
        },
        {
          inputType: "strike",
          profit: 120,
          closingPriceOffset: -250,
          premium: 70,
          question: ({
            ethPrice,
            closingPriceOffset,
            profit,
            premium,
          }: InputQuestionArgs) =>
            `You believe that the price of ETH, currently trading at $${ethPrice}, will decrease in the near future so you buy a put a call option for a premium of $${premium}. At the expiration date ETH is valued at $${
              ethPrice + closingPriceOffset
            } so you decide to exercise your option with a profit of $${profit}. What was strike price? A: ETH - $100 `,
        },
      ],
    },
  },
  short: {
    call: {
      selectType: [
        {
          question:
            "When selling a call option, the seller receives a premium in exchange for:",
          correctAnswer: "2",
          options: [
            {
              id: "1",
              value:
                "The right to buy the underlying asset at a specified price.",
            },
            {
              id: "2",
              value:
                "The obligation to sell the underlying asset at a specified price.",
            },
            {
              id: "3",
              value:
                "The right to sell the underlying asset at a specified price.",
            },
            {
              id: "4",
              value:
                "The obligation to buy the underlying asset at a specified price.",
            },
          ],
        },
        {
          question:
            "What is the maximum potential profit for a seller of a call option?",
          correctAnswer: "1",
          options: [
            {
              id: "1",
              value: "The premium received from selling the call option.",
            },
            { id: "2", value: "Unlimited profit potential." },
            {
              id: "3",
              value:
                "The difference between the strike price and the market price of the underlying asset.",
            },
            {
              id: "4",
              value:
                "The difference between the strike price and the expiration price of the option.",
            },
          ],
        },
        {
          question:
            "As a seller of a call option, the breakeven point is reached when the:",
          correctAnswer: "3",
          options: [
            {
              id: "1",
              value:
                "Market price of the underlying asset is equal to the strike price.",
            },
            {
              id: "2",
              value:
                "Premium received from selling the call option equals zero.",
            },
            {
              id: "3",
              value:
                "Market price of the underlying asset plus the premium received equals the strike price.",
            },
            {
              id: "4",
              value:
                "Market price of the underlying asset exceeds the strike price.",
            },
          ],
        },
        {
          question:
            "What is the maximum potential loss for a seller of a call option?",
          correctAnswer: "2",
          options: [
            {
              id: "1",
              value: "The premium received from selling the call option.",
            },
            { id: "2", value: "Unlimited loss." },
            {
              id: "3",
              value:
                "The difference between the strike price and the market price of the underlying asset.",
            },
            {
              id: "4",
              value:
                "The difference between the strike price and the expiration price of the option.",
            },
          ],
        },
        {
          question:
            "When selling a call option, the seller hopes that the market price of the underlying asset will:",
          correctAnswer: "4",
          options: [
            { id: "1", value: "Remain the same as the strike price." },
            { id: "2", value: "Exceed the strike price." },
            { id: "3", value: "Be less than the strike price." },
            { id: "4", value: "Be below or equal to the strike price." },
          ],
        },
        {
          question:
            "What happens if the underlying asset's price is above the strike price of a call option at expiration for the seller?",
          correctAnswer: "1",
          options: [
            {
              id: "1",
              value:
                "The call option expires worthless, and the seller keeps the premium received.",
            },
            {
              id: "2",
              value:
                "The seller must buy the underlying asset at a higher market price and sell it at the strike price.",
            },
            {
              id: "3",
              value:
                "The seller receives the difference between the strike price and the market price of the underlying asset.",
            },
            {
              id: "4",
              value:
                "The call option automatically gets exercised, and the seller must deliver the underlying asset.",
            },
          ],
        },
      ],
      inputType: [
        {
          inputType: "profit",
          strikePriceOffset: -50,
          closingPriceOffset: -100,
          premium: 100,
          question: ({
            ethPrice,
            strikePriceOffset,
            closingPriceOffset,
            premium,
          }: InputQuestionArgs) =>
            `You believe that the price of ETH, currently trading at $${ethPrice}, will remain relatively stable in the near future, so you decide to sell a call option with a strike price of $${
              ethPrice + Number(strikePriceOffset)
            } for a premium of $${premium}. At the expiration date, ETH is valued at $${
              ethPrice + closingPriceOffset
            }. What is your profit? A: $100`,
        },
      ],
    },
    put: {
      selectType: [
        {
          question:
            "When selling a put option, the seller receives a premium in exchange for:",
          correctAnswer: "1",
          options: [
            {
              id: "1",
              value:
                "The obligation to buy the underlying asset at a specified price.",
            },
            {
              id: "2",
              value:
                "The right to sell the underlying asset at a specified price.",
            },
            {
              id: "3",
              value:
                "The right to buy the underlying asset at a specified price.",
            },
            {
              id: "4",
              value:
                "The obligation to sell the underlying asset at a specified price.",
            },
          ],
        },
        {
          question:
            "What is the maximum potential profit for a seller of a put option?",
          correctAnswer: "2",
          options: [
            {
              id: "1",
              value: "The premium received from selling the put option.",
            },
            {
              id: "2",
              value: "The premium received from selling the put option.",
            },
            {
              id: "3",
              value:
                "The difference between the strike price and the market price of the underlying asset.",
            },
            { id: "4", value: "Unlimited profit potential." },
          ],
        },
        {
          question:
            "As a seller of a put option, the breakeven point is reached when the:",
          correctAnswer: "3",
          options: [
            {
              id: "1",
              value:
                "Market price of the underlying asset is equal to the strike price.",
            },
            {
              id: "2",
              value:
                "Premium received from selling the put option equals zero.",
            },
            {
              id: "3",
              value:
                "Market price of the underlying asset minus the premium received equals the strike price.",
            },
            {
              id: "4",
              value:
                "Market price of the underlying asset exceeds the strike price.",
            },
          ],
        },
        {
          question:
            "What is the maximum potential loss for a seller of a put option?",
          correctAnswer: "1",
          options: [
            {
              id: "1",
              value:
                "The difference between the strike price and the market price of the underlying asset.",
            },
            {
              id: "2",
              value: "The premium received from selling the put option.",
            },
            { id: "3", value: "Unlimited loss." },
            {
              id: "4",
              value:
                "The difference between the strike price and the expiration price of the option.",
            },
          ],
        },
        {
          question:
            "When selling a put option, the seller hopes that the market price of the underlying asset will:",
          correctAnswer: "4",
          options: [
            { id: "1", value: "Remain the same as the strike price." },
            { id: "2", value: "Exceed the strike price." },
            { id: "3", value: "Be less than the strike price." },
            { id: "4", value: "Be above or equal to the strike price." },
          ],
        },
        {
          question:
            "What happens if the underlying asset's price is below the strike price of a put option at expiration for the seller?",
          correctAnswer: "1",
          options: [
            {
              id: "1",
              value:
                "The put option expires worthless, and the seller keeps the premium received.",
            },
            {
              id: "2",
              value:
                "The seller must sell the underlying asset at a lower market price than the strike price.",
            },
            {
              id: "3",
              value:
                "The seller receives the difference between the strike price and the market price of the underlying asset.",
            },
            {
              id: "4",
              value:
                "The put option automatically gets exercised, and the seller must deliver the underlying asset.",
            },
          ],
        },
      ],
      inputType: [
        {
          inputType: "profit",
          strikePriceOffset: 50,
          closingPriceOffset: 100,
          premium: 120,
          question: ({
            ethPrice,
            strikePriceOffset,
            closingPriceOffset,
            premium,
          }: InputQuestionArgs) =>
            `You believe that the price of ETH, currently trading at $${ethPrice}, will remain stable or increase in the near future, so you decide to sell a put option with a strike price of $${
              ethPrice + Number(strikePriceOffset)
            } for a premium of $${premium}. At the expiration date, ETH is valued at $${
              ethPrice + closingPriceOffset
            }. What is your profit? A: 120`,
        },
      ],
    },
  },
};
