import { TESTNET_MAIN_CONTRACT_ADDRESS } from "@/lib/addresses";
import AmmAbi from "@/lib/abi/amm_abi.json";
import { getPremiaWithSlippage, getTradeCalldata } from "@/lib/computations";
import { ETH_DIGITS, USD_DIGITS } from "@/lib/constants";
import { useGetPremia } from "@/lib/hooks/useGetPremia";
import { useSlippage } from "@/lib/stores/useSlippage";
import {
  digitsByType,
  intToMath64x61,
  isCall,
  isLong,
  longInteger,
  math64x61toDecimal,
} from "@/lib/units";
import { OptionWithPosition } from "@/types/option";
import { useAccount } from "@starknet-react/core";
import { useMemo, useState } from "react";
import BN from "bn.js";

export default function PositionDetail({
  option,
  type,
}: {
  option: OptionWithPosition;
  type: "live" | "expired";
}) {
  const actionName = type === "expired" ? "Settle" : "Close";

  const { account } = useAccount();
  const { slippage } = useSlippage();
  const [size, setSize] = useState(option.positionSize);

  const { premia, isLoading: loadingPremia } = useGetPremia(option, size, true);

  async function execute() {
    if (!account || !premia) return;

    // one hour from now
    const deadline = String(Math.round(new Date().getTime() / 1000) + 60 * 60);

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

    const closeArgs = {
      contractAddress: TESTNET_MAIN_CONTRACT_ADDRESS,
      entrypoint: "trade_close",
      calldata: [
        ...getTradeCalldata(option.raw, longInteger(size, ETH_DIGITS).toString()),
        premiaWithSlippage.toString(10),
        deadline,
      ],
    };

    console.log(closeArgs);
    
    await account.execute([closeArgs], [AmmAbi]).catch((e) => {
      throw Error("Trade open rejected or failed");
    });
  }
  

  return (
    <div>
      <button type="button" disabled={loadingPremia} onClick={execute}>
        {actionName} position
      </button>
    </div>
  );
}
