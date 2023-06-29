import { TESTNET_MAIN_CONTRACT_ADDRESS } from "@/lib/addresses";
import { shortInteger } from "@/lib/units";
import { OptionWithPosition } from "@/types/option";
import { useAccount } from "@starknet-react/core";
import AmmAbi from "@/lib/abi/amm_abi.json";
import { getTradeCalldata } from "@/lib/computations";
import { useGetPremia } from "@/lib/hooks/useGetPremia";
import { ChangeEvent, useState } from "react";
import { useSlippage } from "@/lib/stores/useSlippage";
import { useEthToUsd } from "@/lib/hooks/useEthToUsd";
import { ETH_DIGITS } from "@/lib/constants";

function premiaToDisplayValue({
  premia,
  ethInUsd,
  option,
}: {
  premia: number;
  ethInUsd: number;
  option: OptionWithPosition;
}) {
  // Long Call
  if (option.isCall && option.isLong) {
    return `$${(premia * ethInUsd).toFixed(2)}`;
  }
  // Long Put
  if (!option.isCall && option.isLong) {
    return `$${premia.toFixed(2)}`;
  }
  // Short Call
  if (option.isCall && !option.isLong) {
    return `$${((option.positionSize - premia) * ethInUsd).toFixed(2)}`;
  }
  // Short Put
  if (!option.isCall && !option.isLong) {
    return `$${(option.positionSize * ethInUsd - premia).toFixed(2)}`;
  }
  // unreachable
  throw Error('Could not get "premiaToDisplayValue"');
}

export default function PositionDetails({
  option,
  hideDetails,
}: {
  option: OptionWithPosition;
  hideDetails?: () => void;
}) {
  const { account } = useAccount();
  const { slippage } = useSlippage();
  const [size, setSize] = useState(option.positionSize);

  const { premia } = useGetPremia({
    option,
    size,
    isClosing: true,
  });
  const ethInUsd = useEthToUsd();

  if (!premia) {
    return (
      <div className="w-full rounded-xl bg-light-blue py-8 px-12 flex justify-center">
        <span>loading...</span>
      </div>
    );
  }

  const displayPremia = premiaToDisplayValue({
    premia: premia.total,
    ethInUsd,
    option,
  });

  const displayPremiaWithSlippage = premiaToDisplayValue({
    premia: shortInteger(premia.withSlippage.toString(10), ETH_DIGITS),
    ethInUsd,
    option,
  });

  async function execute() {
    if (!account || !premia) return;

    // one hour from now
    const deadline = String(Math.round(new Date().getTime() / 1000) + 60 * 60);

    const closeArgs = {
      contractAddress: TESTNET_MAIN_CONTRACT_ADDRESS,
      entrypoint: "trade_close",
      calldata: [
        ...getTradeCalldata(option.raw, size),
        premia.withSlippage.toString(10),
        deadline,
      ],
    };

    await account.execute([closeArgs], [AmmAbi]).catch((e) => {
      throw Error("Trade open rejected or failed");
    });
  }

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) =>
    setSize(ev.target.valueAsNumber);

  return (
    <div className="w-full rounded-xl bg-light-blue py-6 px-16 relative">
      <div className="absolute top-2 right-2">
        <button
          type="button"
          onClick={hideDetails}
          className="py-1 px-2 leading-1 border-none bg-transparent enabled:shadow-none text-gray-500 hover:text-blue"
        >
          &times;
        </button>
      </div>
      <form onSubmit={execute} className="flex gap-8 items-end justify-between">
        <div className="flex gap-2 items-center">
          <div>
            <p className="text-18 font-500 mb-2">Close Position</p>
            <div className="flex flex-col">
              <span>Amount</span>
              <input
                value={size || ""}
                onChange={handleInputChange}
                className="px-1 w-16 border border-light-blue rounded-sm outline-light-gray"
                type="number"
                min="0"
                step="0.001"
                max={option.positionSize}
                required
              />
              <span className="text-12">
                (max. {option.positionSize.toFixed(3)})
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 mb-2">
          <span>Total received: {displayPremia}</span>
          <span>
            With {slippage}% slippage limit:{" "}
            {slippage ? displayPremiaWithSlippage : "-"}
          </span>
        </div>
        <button
          type="submit"
          className="mx-24 self-center mt-4 enabled:bg-white"
          disabled={!displayPremia || !slippage}
        >
          Confirm
        </button>
      </form>
    </div>
  );
}
