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
import { ChangeEvent, useEffect } from "react";
import SliderInput from "./SliderInput";

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

type OptionType = "long call" | "short call" | "long put" | "short put";
const optionIdxByType = {
  "long call": 0,
  "short call": 3,
  "long put": 6,
  "short put": 9,
};

const baseOption = 9;

export default function ScenarioGraph({
  optionType,
}: {
  optionType: OptionType;
}) {
  const { data } = useQuery<LiveOption[]>("live-options", async () => {
    const data = await fetch("/api/options");
    return data.json();
  });

  /* console.log(data); */

  const ethToUsd = useEthToUsd();
  const scenario = useOptionScenario();

  useEffect(() => {
    if (data) {
      const option = data[optionIdxByType[optionType]];
      console.log(option);
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

  function handleEdit(event: ChangeEvent<HTMLInputElement>) {
    const { name, valueAsNumber } = event.currentTarget;

    if (!valueAsNumber) return;

    if (name === "strikePrice") {
      scenario.setStrikePrice(valueAsNumber);

      return;
    }

    if (name === "optSize") {
      scenario.setOptSize(valueAsNumber);

      return;
    }

    if (name === "ethToUsd") {
      scenario.setEthToUsd(valueAsNumber);

      return;
    }
  }

  return (
    <div className="mt-16">
      <h2 className="mb-20">Assessment</h2>
      <Line options={options(scenario.ethToUsd)} data={cdata} />
      <hr />
      <div className="my-20">
        <SliderInput
          name="test"
          min={scenario.ethFloor}
          max={scenario.ethCeil}
        />
      </div>
      <div>
        <label>
          Strike price
          <input
            type="number"
            step="any"
            name="strikePrice"
            defaultValue={scenario.option?.strikePrice || 0}
            onChange={handleEdit}
          />
        </label>
      </div>
      <div>
        <label>
          Option size
          <input
            type="number"
            name="optSize"
            defaultValue={scenario.optSize}
            onChange={handleEdit}
          />
        </label>
      </div>
      <div>
        <label>
          Eth price
          <input
            type="number"
            name="ethToUsd"
            defaultValue={scenario.ethToUsd}
            onChange={handleEdit}
          />
        </label>
      </div>
    </div>
  );
}
