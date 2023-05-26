import {
  TESTNET_ETH_ADDRESS,
  TESTNET_MAIN_CONTRACT_ADDRESS,
  TESTNET_USD_ADDRESS,
} from "@/lib/addresses";
import {
  digitsByType,
  getSideName,
  getTypeName,
  intToMath64x61,
  isCall,
  isLong,
  longInteger,
} from "@/lib/units";
import { LiveOption } from "@/types/option";
import { useAccount } from "@starknet-react/core";
import BN from "bn.js";
import AmmAbi from "@/lib/abi/amm_abi.json";
import LpAbi from "@/lib/abi/lptoken_abi.json";
import {
  getAmountToApprove,
  getPremiaWithSlippage,
  getTradeCalldata,
} from "@/lib/computations";
import { ETH_DIGITS, USD_DIGITS } from "@/lib/constants";
import { useGetPremia } from "@/lib/hooks/useGetPremia";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSlippage } from "@/lib/stores/useSlippage";

export default function OptionDetails({
  option,
  index,
}: {
  option: LiveOption;
  index: number;
}) {
  const { slippage } = useSlippage();
  const [size, setSize] = useState(1);

  const long = isLong(option.optionSide);
  const call = isCall(option.optionType);
  const { isConnected, account } = useAccount();
  const { premia, isLoading: loadingPremia } = useGetPremia(
    option,
    size,
    false
  );

  useEffect(() => {
    setSize(1);
  }, [option]);

  const handleTrade = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!account) return;
    if (!premia) return;

    const digits = isCall(option.optionType) ? ETH_DIGITS : USD_DIGITS;
    const currentPremia = longInteger(Number(premia), digits);

    const premiaWithSlippage = getPremiaWithSlippage(
      currentPremia,
      option.optionSide,
      false,
      slippage
    );

    const approveAmount = getAmountToApprove(
      option.optionType,
      option.optionSide,
      size,
      premiaWithSlippage,
      parseInt(option.strikePrice.toString(), 10)
    );

    const approveArgs = {
      contractAddress: call ? TESTNET_ETH_ADDRESS : TESTNET_USD_ADDRESS,
      entrypoint: "approve",
      calldata: [
        TESTNET_MAIN_CONTRACT_ADDRESS,
        new BN(approveAmount).toString(10),
        "0",
      ],
    };

    // one hour from now
    const deadline = String(Math.round(new Date().getTime() / 1000) + 60 * 60);

    const tradeOpenArgs = {
      contractAddress: TESTNET_MAIN_CONTRACT_ADDRESS,
      entrypoint: "trade_open",
      calldata: [
        ...getTradeCalldata(option.raw, size),
        intToMath64x61(
          premiaWithSlippage.toString(10),
          digitsByType(option.optionType)
        ),
        deadline,
      ],
    };

    await account
      .execute([approveArgs, tradeOpenArgs], [LpAbi, AmmAbi])
      .catch((e) => {
        throw Error("Trade open rejected or failed");
      });
  };

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.value || Number(ev.target.value) > 0)
      setSize(Number(ev.target.value));
  };

  return (
    <div className="w-full mb-24">
      <h2 className="text-xl font-bold">Option {index}</h2>
      <h3>
        {getSideName(option.optionSide)} {getTypeName(option.optionType)} for{" "}
        {option.strikePrice} expiring on{" "}
        {new Date(option.maturity).toLocaleDateString()}
      </h3>
      <form onSubmit={handleTrade} className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <span>size</span>
          <input
            value={size || ""}
            onChange={handleInputChange}
            className="bg-slate-800 py-1 px-2 w-12"
            required
          />
        </div>
        <p>
          Premium: {(call ? premia?.premiaEth : premia?.premiaUsd)?.toFixed(5)}
        </p>

        <button
          type="submit"
          className="bg-slate-700 px-1 py-2 w-fit"
          disabled={!isConnected || loadingPremia}
        >
          {isConnected
            ? `${long ? "Buy" : "Sell"} for ${(call
                ? premia?.premiaEth
                : premia?.premiaUsd
              )?.toFixed(5)}`
            : "Connect to buy options"}
        </button>
      </form>
    </div>
  );
}
