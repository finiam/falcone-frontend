import { useEthToUsd } from "@/lib/hooks/useEthToUsd";
import { useOptionScenario } from "@/lib/optionScenario";
import { LiveOption } from "@/types/option";

export default function ScenarioDescription() {
  const ethToUsd = useEthToUsd();
  const option = useOptionScenario((state) => state.originalOption);

  const action = option.isShort ? "selling" : "buying";
  const optionDesc = `${option.isLong ? "long" : "short"} ${
    option.isCall ? "call" : "put"
  }`;

  return (
    <div>
      <p className="mb-0">
        You are considering {action} a {optionDesc} option. The strike price is{" "}
        {option.strikePrice}, and ETH is currently trading at {ethToUsd}.
      </p>
      <p className="text-20 opacity-50">
        Feel free to tweak the strike price and option size to explore how
        different situations could play out.
      </p>
    </div>
  );
}
