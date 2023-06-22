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
          return value.tick.value === 0 ? "blue" : "#eee";
        },
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

/* 
long call
short call
long put
short call
*/

const baseOption = 9;

export default function ScenarioGraph() {
  const { data } = useQuery<LiveOption[]>("live-options", async () => {
    const data = await fetch("/api/options");
    return data.json();
  });
  console.log(data)
  const ethToUsd = useEthToUsd();
  const scenario = useOptionScenario();

  useEffect(() => {
    if (data) scenario.init(data[baseOption], Math.round(ethToUsd));
  }, [data]);

  const cdata = {
    labels: scenario.stops,
    datasets: [
      {
        data: scenario.line,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        label: "Total profit",
      },
    ],
  };

  console.log(ethToUsd);

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
      <p>Assessment</p>
      <Line options={options(scenario.ethToUsd)} data={cdata} />
      <hr />
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
