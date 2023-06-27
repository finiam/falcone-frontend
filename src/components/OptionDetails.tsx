import {
  TESTNET_ETH_ADDRESS,
  TESTNET_MAIN_CONTRACT_ADDRESS,
  TESTNET_USD_ADDRESS,
} from "@/lib/addresses";
import { getSideName, getTypeName, intToMath64x61 } from "@/lib/units";
import { LiveOption } from "@/types/option";
import { useAccount } from "@starknet-react/core";
import BN from "bn.js";
import AmmAbi from "@/lib/abi/amm_abi.json";
import LpAbi from "@/lib/abi/lptoken_abi.json";
import { getAmountToApprove, getTradeCalldata } from "@/lib/computations";
import { useGetPremia } from "@/lib/hooks/useGetPremia";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function OptionDetails({
  option,
  hideDetails,
}: {
  option: LiveOption;
  hideDetails: () => void;
}) {
  const [size, setSize] = useState("1");
  const parsedSize = parseFloat(size);
  const { isConnected, account } = useAccount();
  const [loadingPremia, setLoadingPremia] = useState<boolean>(false);
  const { premia } = useGetPremia({
    option,
    size: parsedSize,
    isClosing: false,
  });

  useEffect(() => {
    setSize("1");
  }, [option]);

  const handleTrade = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!account || !premia) return;

    const approveAmount = getAmountToApprove({
      type: option.optionType,
      side: option.optionSide,
      size: parsedSize,
      premiaWithSlippage: premia.withSlippage,
      strike: parseInt(option.strikePrice.toString(), 10),
    });

    const approveArgs = {
      contractAddress: option.isCall
        ? TESTNET_ETH_ADDRESS
        : TESTNET_USD_ADDRESS,
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
        ...getTradeCalldata(option.raw, parsedSize),
        intToMath64x61(premia.withSlippage.toString(10), option.digits),
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
    if (!ev.target.value || ev.target.value.match(/^\d*\.?\d*$/)) {
      setLoadingPremia(true);
      setSize(ev.target.value);
    }
  };

  useEffect(() => {
    if (premia?.total) setLoadingPremia(false);
  }, [premia?.total]);

  useEffect(() => {
    console.log(loadingPremia);
  }, [loadingPremia]);

  return (
    <div className="w-full rounded-xl bg-light-blue py-8 px-12 relative">
      <div className="absolute top-2 right-2">
        <button
          type="button"
          onClick={hideDetails}
          className="py-1 px-2 leading-1 border-none bg-transparent enabled:shadow-none text-gray-500 hover:text-blue"
        >
          &times;
        </button>
      </div>
      <form
        onSubmit={handleTrade}
        className="flex gap-8 items-center justify-between"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            <span>Size</span>
            <input
              value={size || ""}
              onChange={handleInputChange}
              className="px-1 w-16 border border-light-blue rounded-sm outline-light-gray"
              required
            />
          </div>
          <span>
            Premium: {loadingPremia ? "..." : premia?.total.toFixed(4)}
          </span>
        </div>

        <button
          type="submit"
          className="mx-12"
          disabled={!isConnected || !premia?.total || loadingPremia}
        >
          {isConnected
            ? `${option.isLong ? "Buy" : "Sell"} for ${premia?.total?.toFixed(
                5
              )}`
            : "Connect to buy options"}
        </button>
      </form>
    </div>
  );
}
