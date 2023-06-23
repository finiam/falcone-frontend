"use client";

import { useEthToUsd } from "@/lib/hooks/useEthToUsd";
import { useQuery } from "react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { LiveOption } from "@/types/option";
import { useOptionScenario } from "@/lib/optionScenario";
import { useEffect } from "react";
import { OptionArg } from "@/modules/DynamicAssessment/PageAssessment";
import ScenarioDescription from "@/modules/DynamicAssessment/ScenarioDescription";
import ScenarioControls from "@/modules/DynamicAssessment/ScenarioControls";
import ScenarioQuestion from "@/modules/DynamicAssessment/ScenarioQuestion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = (ethPrice: number): any => ({
  responsive: true,

  interaction: {
    intersect: false,
    mode: "index",
  },

  scales: {
    y: {
      title: {
        display: true,
        text: "Total profit",
      },
      ticks: {
        callback: function (value: number) {
          return Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value);
        },
      },
      grid: {
        color: (value: any) => {
          return value.tick.value === 0 ? "#666" : "#eee";
        },
      },
      border: {
        dash: [4, 4],
        dashOffset: 4,
      },
    },
    x: {
      title: {
        display: true,
        text: "ETH price at expiration date",
      },
      ticks: {
        color: (value: any) => {
          return value.tick.label === Math.round(ethPrice) ? "blue" : "#666";
        },
      },
    },
  },

  plugins: {
    legend: {
      display: false,
    },
  },
});

// This assumes on the order of options from the BE being constant
const optionIdxByType = {
  "long call": 0,
  "short call": 3,
  "long put": 6,
  "short put": 9,
};

export default function ScenarioGraph({
  optionType,
  saveAssessmentAnswer,
}: {
  optionType: OptionArg;
  saveAssessmentAnswer: (val: boolean) => void;
}) {
  const { data } = useQuery<LiveOption[]>("live-options", async () => {
    const data = await fetch("/api/options");
    return data.json();
  });

  const ethToUsd = useEthToUsd();
  const scenario = useOptionScenario();

  useEffect(() => {
    if (data) {
      const option =
        data[optionIdxByType[`${optionType.side} ${optionType.type}`]];
      scenario.init(option, Math.round(ethToUsd));
    }
  }, [data]);

  const cdata = {
    labels: scenario.stops,
    datasets: [
      {
        data: scenario.line,
        borderColor: "#ec7b44",
        backgroundColor: "#ec7b44",
        label: "Total profit",
      },
    ],
  };

  if (!scenario.option)
    return (
      <div className="text-center">
        <p className="text-16 text-blue opacity-50 my-10">Loading options...</p>
      </div>
    );

  return (
    <>
      <ScenarioDescription />
      <Line options={options(scenario.ethToUsd)} data={cdata} />
      <hr />
      <ScenarioControls />
      <ScenarioQuestion saveAssessmentAnswer={saveAssessmentAnswer} />
    </>
  );
}
