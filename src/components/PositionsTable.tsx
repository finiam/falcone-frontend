"use client";

import { useAccount, useContractRead } from "@starknet-react/core";
import AmmAbi from "@/lib/abi/amm_abi.json";
import { TESTNET_MAIN_CONTRACT_ADDRESS } from "@/lib/addresses";
import { parseOptionsWithPositions } from "@/lib/option";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { OptionWithPosition } from "@/types/option";
import { getSideName, getTypeName, isCall } from "@/lib/units";
import PositionDetail from "./PositionDetail";

type SplitPositons = {
  live: OptionWithPosition[];
  expiredInMoney: OptionWithPosition[];
  expiredOutMoney: OptionWithPosition[];
};

function PositionsSection({
  option,
  select,
}: {
  option: OptionWithPosition;
  select: (val: OptionWithPosition) => void;
}) {
  return (
    <div className="flex gap-8">
      <div className="w-1/4">
        {getSideName(option.optionSide)} {getTypeName(option.optionType)},
        strike {option.strikePrice}
      </div>
      <div className="w-1/4">
        {new Date(option.maturity).toLocaleDateString()}
      </div>
      <div className="w-1/4">Size: {option.positionSize}</div>
      <div className="w-1/4">
        Value: {isCall(option.optionType) ? "ETH" : "USD"}{" "}
        {option.positionValue.toFixed(4)}
      </div>
      <button type="button" onClick={() => select(option)}>
        Close
      </button>
    </div>
  );
}

export default function PositionsTable() {
  const [selected, setSelected] = useState<OptionWithPosition | undefined>();

  const { address } = useAccount();
  const { data, isLoading } = useContractRead({
    address: TESTNET_MAIN_CONTRACT_ADDRESS,
    abi: AmmAbi,
    functionName: "get_option_with_position_of_user",
    args: [address],
    watch: false,
  });

  useEffect(() => {
    console.log(`address change`);
  }, [address]);

  const split = useMemo<SplitPositons | null>(() => {
    if (!data) return null;

    const options = parseOptionsWithPositions((data as any).array || []);

    const res: SplitPositons = {
      live: [],
      expiredInMoney: [],
      expiredOutMoney: [],
    };

    options.forEach((option) => {
      if (new Date(option.maturity).getTime() > Date.now()) {
        res.live.push(option);
      }

      if (option.positionValue) {
        res.expiredInMoney.push(option);
      }

      res.expiredOutMoney.push(option);
    });

    return res;
  }, [data]);

  return (
    <section className="flex flex-col gap-2 w-full mt-8">
      <h2 className="font-bold">Live options</h2>

      {isLoading && "Fetching..."}

      {selected && <PositionDetail option={selected} type={"live"} />}

      {split?.live.map((option) => (
        <PositionsSection
          key={option.id}
          option={option}
          select={setSelected}
        />
      ))}
    </section>
  );
}
