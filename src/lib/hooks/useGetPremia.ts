import { useEffect, useState } from "react";
import {
  convertSizeToUint256,
  longInteger,
  math64x61toDecimal,
} from "@/lib/units";
import { LiveOption, OptionWithPosition, PremiaData } from "@/types/option";
import {
  TESTNET_LPTOKEN_CONTRACT_ADDRESS,
  TESTNET_LPTOKEN_CONTRACT_ADDRESS_PUT,
  TESTNET_MAIN_CONTRACT_ADDRESS,
} from "@/lib/addresses";
import AmmAbi from "@/lib/abi/amm_abi.json";
import { useContractRead } from "@starknet-react/core";
import { getPremiaWithSlippage, getStruct } from "../computations";
import { useSlippage } from "../stores/useSlippage";

export function useGetPremia({
  option,
  size,
  isClosing,
}: {
  option: LiveOption | OptionWithPosition;
  size: number;
  isClosing: boolean;
}) {
  const [premia, setPremia] = useState<PremiaData>();
  const { slippage } = useSlippage();

  const lpAddress = option.isCall
    ? TESTNET_LPTOKEN_CONTRACT_ADDRESS
    : TESTNET_LPTOKEN_CONTRACT_ADDRESS_PUT;
  const convertedSize = convertSizeToUint256(size);
  const isClosingString = isClosing ? "0x1" : "0x0";

  const calldata = [
    getStruct(option.raw),
    lpAddress,
    convertedSize,
    isClosingString,
  ];

  const { data } = useContractRead({
    address: TESTNET_MAIN_CONTRACT_ADDRESS,
    abi: AmmAbi,
    functionName: "get_total_premia",
    args: calldata,
  });

  useEffect(() => {
    if (!data) return;

    const totalPremia = (data as any)?.total_premia_including_fees.toString(10);

    if (!totalPremia) {
      throw Error("Response did not include total_premia_including_fees");
    }

    const convertedPremia = math64x61toDecimal(totalPremia);
    const withSlippage = getPremiaWithSlippage({
      premia: longInteger(convertedPremia, option.digits),
      side: option.optionSide,
      isClosing,
      slippage,
    });

    setPremia({
      base: convertedPremia / size,
      total: convertedPremia,
      withSlippage,
    });
  }, [data]);

  return { premia };
}
