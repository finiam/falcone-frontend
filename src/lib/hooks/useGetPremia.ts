import { useEffect, useState } from "react";
import { convertSizeToUint256, isCall, math64x61toDecimal } from "@/lib/units";
import { LiveOption, PremiaData } from "@/types/option";
import {
  TESTNET_LPTOKEN_CONTRACT_ADDRESS,
  TESTNET_LPTOKEN_CONTRACT_ADDRESS_PUT,
  TESTNET_MAIN_CONTRACT_ADDRESS,
} from "@/lib/addresses";
import { getStruct } from "@/lib/option";
import AmmAbi from "@/lib/abi/amm_abi.json";
import { useEthToUsd } from "@/lib/hooks/useEthToUsd";
import { useContractRead } from "@starknet-react/core";

const premiaDataEth = (premia: number, size: number, ethToUsd: number) => {
  const premiaEth = premia;
  const premiaUsd = premia * ethToUsd;
  const basePremiaEth = premia / size;
  const basePremiaUsd = premiaUsd / size;

  return { basePremiaEth, premiaUsd, basePremiaUsd, premiaEth };
};

const premiaDataUsd = (premia: number, size: number, ethToUsd: number) => {
  const premiaEth = premia / ethToUsd;
  const premiaUsd = premia;
  const basePremiaEth = premiaEth / size;
  const basePremiaUsd = premia / size;

  return { basePremiaEth, premiaUsd, basePremiaUsd, premiaEth };
};

export function useGetPremia(
  option: LiveOption,
  size: number,
  isClosing: boolean
) {
  const ethToUsd = useEthToUsd();
  const [premia, setPremia] = useState<PremiaData>();

  const lpAddress = isCall(option.optionType)
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

  const { data, isLoading } = useContractRead({
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

    setPremia(
      isCall(option.optionType)
        ? premiaDataEth(convertedPremia, size, ethToUsd)
        : premiaDataUsd(convertedPremia, size, ethToUsd)
    );
  }, [data]);

  return { premia, isLoading };
}
