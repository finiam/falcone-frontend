"use client";

import { useAccount, useContractRead } from "@starknet-react/core";
import AmmAbi from "@/lib/abi/amm_abi.json";
import { TESTNET_MAIN_CONTRACT_ADDRESS } from "@/lib/addresses";
import { parseOptionsWithPositions } from "@/lib/option";
import { useMemo, useState } from "react";
import { OptionWithPosition } from "@/types/option";
import { getSideName, getTypeName, isCall } from "@/lib/units";
import ClosePosition from "./ClosePosition";
import { getTradeCalldata } from "@/lib/computations";

type SplitPositons = {
  live: OptionWithPosition[];
  expiredInMoney: OptionWithPosition[];
  expiredOutMoney: OptionWithPosition[];
};

function PositionsSection({
  option,
  select,
  action,
}: {
  option: OptionWithPosition;
  select: (val: OptionWithPosition) => void;
  action: string;
}) {
  return (
    <div className="flex gap-8 mb-8">
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
        {action}
      </button>
    </div>
  );
}

export default function PositionsTable() {
  const [selected, setSelected] = useState<OptionWithPosition | undefined>();

  const { address, account } = useAccount();
  const { data, isLoading } = useContractRead({
    address: TESTNET_MAIN_CONTRACT_ADDRESS,
    abi: AmmAbi,
    functionName: "get_option_with_position_of_user",
    args: [address],
    watch: false,
  });

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
      } else if (option.positionValue) {
        res.expiredInMoney.push(option);
      } else {
        res.expiredOutMoney.push(option);
      }
    });

    return res;
  }, [data]);

  async function settleOption(option: OptionWithPosition) {
    const args = {
      contractAddress: TESTNET_MAIN_CONTRACT_ADDRESS,
      entrypoint: "trade_settle",
      calldata: getTradeCalldata(option.raw, option.positionSize),
    };

    account?.execute([args], [AmmAbi]);
  }

  return (
    <section className="flex flex-col gap-2 w-full mt-8">
      {selected && <ClosePosition option={selected} />}

      {isLoading && "Fetching..."}

      <h2 className="font-bold">Live options</h2>
      {split?.live.map((option) => (
        <PositionsSection
          key={option.id}
          option={option}
          select={setSelected}
          action="Close"
        />
      ))}

      <h2 className="font-bold">Expired in money</h2>
      {split?.expiredInMoney.length === 0
        ? "None"
        : split?.expiredInMoney.map((option) => (
            <PositionsSection
              key={option.id}
              option={option}
              select={settleOption}
              action="Settle"
            />
          ))}

      <h2 className="font-bold">Expired out of money</h2>
      {split?.expiredOutMoney.length === 0
        ? "None"
        : split?.expiredOutMoney.map((option) => (
            <PositionsSection
              key={option.id}
              option={option}
              select={settleOption}
              action="Settle"
            />
          ))}
    </section>
  );
}
