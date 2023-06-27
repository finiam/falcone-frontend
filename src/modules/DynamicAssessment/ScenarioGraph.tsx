"use client";

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
import { useOptionScenario } from "@/lib/stores/useScenario";
import { useEffect } from "react";
import { OptionArg } from "@/types/option";
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

  animation: false,

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

export default function ScenarioGraph({
  optionType,
  saveAssessmentAnswer,
  option,
  ethToUsd,
}: {
  optionType: OptionArg;
  saveAssessmentAnswer: (val: boolean) => void;
  option: LiveOption;
  ethToUsd: number;
}) {
  const scenario = useOptionScenario();

  useEffect(() => {
    if (option) {
      scenario.init(option, Math.round(ethToUsd));
    }
  }, []);

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
      <ScenarioDescription ethToUsd={ethToUsd} />
      <Line options={options(scenario.ethToUsd)} data={cdata} />
      <hr />
      <ScenarioControls />
      <ScenarioQuestion
        saveAssessmentAnswer={saveAssessmentAnswer}
        ethToUsd={ethToUsd}
      />
    </>
  );
}
