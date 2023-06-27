import { TESTNET_MAIN_CONTRACT_ADDRESS } from "@/lib/addresses";
import AmmAbi from "@/lib/abi/amm_abi.json";
import { getTradeCalldata } from "@/lib/computations";
import { ETH_DIGITS } from "@/lib/constants";
import { useGetPremia } from "@/lib/hooks/useGetPremia";
import { useSlippage } from "@/lib/stores/useSlippage";
import { longInteger, shortInteger } from "@/lib/units";
import { OptionWithPosition } from "@/types/option";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { useEthToUsd } from "@/lib/hooks/useEthToUsd";

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

export default function ClosePosition({
  option,
}: {
  option: OptionWithPosition;
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
    return <p>loading...</p>;
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

  return (
    <div className="mb-8">
      <p className="font-bold">Close Position</p>
      <div>
        <p>Total received: {displayPremia}</p>
        <p>
          With {slippage}% slippage limit: {displayPremiaWithSlippage}
        </p>
      </div>

      <label>
        Amount
        <input
          type="number"
          className="bg-slate-800 py-1 px-2 w-20 ml-2"
          min="0"
          max={option.positionSize}
          defaultValue={option.positionSize}
          onChange={(e) => setSize(e.target.valueAsNumber)}
        />
      </label>
      <button
        type="button"
        disabled={!displayPremia}
        onClick={execute}
        className="block underline"
      >
        Ok
      </button>
    </div>
  );
}
