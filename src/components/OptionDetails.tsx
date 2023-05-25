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
  math64x61toDecimal,
} from "@/lib/units";
import { LiveOption, OptionSide, OptionType } from "@/types/option";
import { useAccount } from "@starknet-react/core";
import BN from "bn.js";
import AmmAbi from "@/lib/abi/amm_abi.json";
import LpAbi from "@/lib/abi/lptoken_abi.json";
import {
  financialDataEth,
  financialDataUsd,
  getAmountToApprove,
  getPremiaWithSlippage,
  getTradeCalldata,
} from "@/lib/computations";
import { ETH_DIGITS, USD_DIGITS } from "@/lib/constants";
import { useEffect, useMemo, useState } from "react";
import { getEthInUsd } from "@/lib/currencies";
import { getPremia } from "@/lib/premia";

export default function OptionDetails({
  option,
  index,
}: {
  option: LiveOption;
  index: number;
}) {
  const long = isLong(option.optionSide);
  const call = isCall(option.optionType);
  const { isConnected, account } = useAccount();
  const [ethInUsd, setEthInUsd] = useState<number>();
  const [premia, setPremia] = useState<number | null>();

  const size = 1;
  const slippage = 1;

  useEffect(() => {
    getEthInUsd().then((res) => setEthInUsd(res));
  }, [option]);

  useEffect(() => {
    setPremia(null);
    if (!ethInUsd) return;

    getPremia(option, size, false).then((res) => {
      const convertedPremia = math64x61toDecimal(res);

      setPremia(
        call
          ? financialDataEth(size, convertedPremia, ethInUsd).premiaEth
          : financialDataUsd(size, convertedPremia, ethInUsd).premiaUsd
      );
    });
  }, [ethInUsd, option]);

  const handleTrade = async () => {
    if (!account) return;
    if (!premia) return;

    const digits = isCall(option.optionType) ? ETH_DIGITS : USD_DIGITS;
    const currentPremia = longInteger(Number(premia), digits);

    let premiaWithSlippage = getPremiaWithSlippage(
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

  return (
    <div className="w-full mb-24">
      <h2 className="text-xl font-bold">Option {index}</h2>
      <h3>
        {getSideName(option.optionSide)} {getTypeName(option.optionType)} for{" "}
        {option.strikePrice} expiring on{" "}
        {new Date(option.maturity).toLocaleDateString()}
      </h3>
      <div className="flex flex-col gap-2">
        <p>Premium: {premia?.toFixed(5)}</p>

        <button
          type="button"
          className="bg-slate-700 px-1 py-2 w-fit"
          onClick={handleTrade}
          disabled={!isConnected || !premia}
        >
          {isConnected
            ? `${long ? "Buy" : "Sell"} for ${premia?.toFixed(5) || "xxxx"}`
            : "Connect to buy options"}
        </button>
      </div>
    </div>
  );
}
