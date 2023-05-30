import { TESTNET_MAIN_CONTRACT_ADDRESS } from "@/lib/addresses";
import AmmAbi from "@/lib/abi/amm_abi.json";
import { getPremiaWithSlippage, getTradeCalldata } from "@/lib/computations";
import { ETH_DIGITS, USD_DIGITS } from "@/lib/constants";
import { useGetPremia } from "@/lib/hooks/useGetPremia";
import { useSlippage } from "@/lib/stores/useSlippage";
import { isCall, isLong, longInteger, shortInteger } from "@/lib/units";
import { OptionWithPosition } from "@/types/option";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { useEthToUsd } from "@/lib/hooks/useEthToUsd";

function premiaToDisplayValue(
  premia: number,
  ethInUsd: number,
  option: OptionWithPosition
) {
  const call = isCall(option.optionType);
  const long = isLong(option.optionSide);

  // Long Call
  if (call && long) {
    return `$${(premia * ethInUsd).toFixed(2)}`;
  }
  // Long Put
  if (!call && long) {
    return `$${premia.toFixed(2)}`;
  }
  // Short Call
  if (call && !long) {
    return `$${((option.positionSize - premia) * ethInUsd).toFixed(2)}`;
  }
  // Short Put
  if (!call && !long) {
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

  const { premia, isLoading: loadingPremia } = useGetPremia(option, size, true);
  const ethInUsd = useEthToUsd();

  if (!premia) {
    return <p>loading...</p>;
  }

  const digits = isCall(option.optionType) ? ETH_DIGITS : USD_DIGITS;
  const currentPremia = longInteger(
    isCall(option.optionType) ? premia.premiaEth : premia.premiaUsd,
    digits
  );
  const premiaWithSlippage = getPremiaWithSlippage(
    currentPremia,
    option.optionSide,
    true,
    slippage
  );

  const displayPremia = premiaToDisplayValue(
    premia?.premiaEth || 0,
    ethInUsd,
    option
  );

  const displayPremiaWithSlippage = premiaToDisplayValue(
    shortInteger(premiaWithSlippage.toString(10), ETH_DIGITS),
    ethInUsd,
    option
  );

  async function execute() {
    if (!account || !premia) return;

    // one hour from now
    const deadline = String(Math.round(new Date().getTime() / 1000) + 60 * 60);

    const closeArgs = {
      contractAddress: TESTNET_MAIN_CONTRACT_ADDRESS,
      entrypoint: "trade_close",
      calldata: [
        ...getTradeCalldata(
          option.raw,
          longInteger(size, ETH_DIGITS).toString()
        ),
        premiaWithSlippage.toString(10),
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
        disabled={loadingPremia}
        onClick={execute}
        className=" block underline"
      >
        Ok
      </button>
    </div>
  );
}
