"use client";

import { useAccount, useContractRead } from "@starknet-react/core";
import AmmAbi from "@/lib/abi/amm_abi.json";
import { TESTNET_MAIN_CONTRACT_ADDRESS } from "@/lib/addresses";
import { parseOptionsWithPositions } from "@/lib/option";
import { useMemo, useState } from "react";
import { OptionWithPosition } from "@/types/option";
import { getSideName, getTypeName, isCall } from "@/lib/units";
import { getTradeCalldata } from "@/lib/computations";
import SlippageInput from "./SlippageInput";
import PositionDetails from "./PositionDetails";

type SplitPositions = {
  live: OptionWithPosition[];
  expiredInMoney: OptionWithPosition[];
  expiredOutMoney: OptionWithPosition[];
};

function EmptySection() {
  return (
    <div className="my-8">
      <span>No options</span>
    </div>
  );
}

function PositionsList({
  options,
  select,
  type: { status, action },
  fetching,
  selectedIdx,
  closeDetails,
}: {
  options: OptionWithPosition[];
  select: (val: OptionWithPosition) => void;
  type: { status: "expired" | "live"; action: string };
  fetching: boolean;
  selectedIdx?: string;
  closeDetails?: () => void;
}) {
  if (fetching) return null;
  return (
    <div className="border border-light-gray rounded-lg pt-6 px-6">
      <div className="flex gap-4 font-600 border-b border-light-gray pb-4">
        <span className="w-1/5">Option</span>
        <span className="w-1/5">
          {status === "expired" ? "Expired at" : "Maturity"}
        </span>
        <span className="w-1/5">Size</span>
        <span className="w-1/5">Value</span>
      </div>
      {options.length > 0 ? (
        options?.map((option) => {
          const isSelected = status === "live" && selectedIdx === option.id;
          return (
            <div
              className="flex flex-col gap-4 py-6 border-b border-light-gray last-of-type:border-none"
              key={option.id}
            >
              <div className="flex gap-4 items-center ">
                <div className="w-1/5">
                  <span className="capitalize">
                    {getSideName(option.optionSide)}{" "}
                    {getTypeName(option.optionType)}
                  </span>
                  , strike ${option.strikePrice}
                </div>
                <div className="w-1/5">
                  {new Date(option.maturity).toLocaleDateString()}
                </div>
                <div className="w-1/5">{option.positionSize.toFixed(3)}</div>
                <div className="w-1/5">
                  {isCall(option.optionType) ? "ETH" : "USD"}{" "}
                  {option.positionValue.toFixed(4)}
                </div>
                <button
                  type="button"
                  onClick={() => select(option)}
                  hidden={isSelected}
                  disabled={isSelected}
                >
                  {action}
                </button>
              </div>
              {selectedIdx && isSelected && (
                <PositionDetails hideDetails={closeDetails} option={option} />
              )}
            </div>
          );
        })
      ) : (
        <EmptySection />
      )}
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

  const split = useMemo<SplitPositions | null>(() => {
    if (!data) return null;

    const options = parseOptionsWithPositions((data as any).array || []);

    const res: SplitPositions = {
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

  const closeDetails = () => setSelected(undefined);

  return (
    <div className="flex flex-col gap-8 mt-8">
      {isLoading && "Fetching..."}

      <section>
        <h2 className="text-24 font-500">Live options</h2>
        <div className="flex justify-between items-center mb-4">
          <span>
            These options have not matured yet. You can close your position or
            wait for them to mature.
          </span>
          {!isLoading && <SlippageInput />}
        </div>
        <PositionsList
          fetching={isLoading}
          options={split?.live || []}
          select={setSelected}
          type={{ status: "live", action: "Close" }}
          selectedIdx={selected?.id}
          closeDetails={closeDetails}
        />
      </section>
      <section>
        <h2 className="text-24 font-500">Expired in the money</h2>
        <span className="block mb-4">
          These options expired in the money. Get your funds by settling them.
        </span>
        <PositionsList
          fetching={isLoading}
          options={split?.expiredInMoney || []}
          select={settleOption}
          type={{ status: "expired", action: "Settle" }}
        />
      </section>
      <section>
        <h2 className="text-24 font-500">Expired out of the money</h2>
        <span className="block mb-4">
          These options expired out of the money.
        </span>
        <PositionsList
          fetching={isLoading}
          options={split?.expiredOutMoney || []}
          select={settleOption}
          type={{ status: "expired", action: "Settle" }}
        />
      </section>
    </div>
  );
}
