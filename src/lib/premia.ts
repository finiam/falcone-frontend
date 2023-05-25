import { isBN } from "bn.js";
import { convertSizeToUint256, isCall } from "./units";
import { LiveOption } from "@/types/option";
import {
  TESTNET_LPTOKEN_CONTRACT_ADDRESS,
  TESTNET_LPTOKEN_CONTRACT_ADDRESS_PUT,
  TESTNET_MAIN_CONTRACT_ADDRESS,
} from "./addresses";
import { getStruct } from "./option";
import { Contract, Provider } from "starknet";
import AmmAbi from "@/lib/abi/amm_abi.json";

const provider = new Provider({
  sequencer: {
    network: "goerli-alpha",
  },
});
const contract = new Contract(AmmAbi, TESTNET_MAIN_CONTRACT_ADDRESS, provider);

export async function getPremia(
  option: LiveOption,
  size: number,
  isClosing: boolean
) {
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

  const res = await contract
    .call("get_total_premia", calldata)
    .then((res) => {
      console.log("success", res);
      return res;
    })
    .catch((e: Error) => {
      throw Error(e.message);
    });

  if (!isBN(res?.total_premia_including_fees)) {
    throw Error("Response did not include total_premia_including_fees");
  }

  return res.total_premia_including_fees.toString(10);
}
