"use client";

import { useEffect, useState } from "react";
import { AssessmentType } from "@/data/assessments";
import { useEthToUsd } from "@/lib/hooks/useEthToUsd";
import { isCall, isLong } from "@/lib/units";

export default function AssessmentContext({
  assessment,
}: {
  assessment: AssessmentType;
}) {
  const [expiration, setExpiration] = useState<Date>();
  const ethInUsd = useEthToUsd();

  useEffect(() => {
    setExpiration(
      new Date(Math.round(new Date().getTime()) + 60 * 60 * 24 * 1000)
    );
  }, []);

  const expectedBehavior =
    isCall(assessment.optionType) === isLong(assessment.optionSide)
      ? "increase"
      : "decrease";

  const type = isCall(assessment.optionType) ? "Call" : "Put";
  const side = isLong(assessment.optionSide) ? "Long" : "Short";

  return (
    <p>
      You believe that the price of Ethereum, currently trading at{" "}
      <span className="font-500">${ethInUsd}</span>, will {expectedBehavior} in
      the near future, so you go{" "}
      <span className="font-500 text-orange">
        {side} on a {type}
      </span>
      .
      <br />
      <br />
      There is a Long Call with{" "}
      <span className="font-500">
        strike price ${Math.floor(ethInUsd) + assessment.strikePriceOffset}{" "}
        expiring on{" "}
        {expiration?.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </span>{" "}
      at <span className="font-500">{expiration?.toLocaleTimeString()}</span> on
      Carmine.
      <br />
      <br />
      The premium for the call option is ${assessment.premium}.
    </p>
  );
}
