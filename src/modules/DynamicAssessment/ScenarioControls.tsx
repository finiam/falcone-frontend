import SliderInput from "@/components/SliderInput";
import { useOptionScenario } from "@/lib/stores/useScenario";

export default function ScenarioControls() {
  const scenario = useOptionScenario();

  const strikePriceMid =
    (scenario.ethCeil - scenario.ethFloor) / 2 + scenario.ethFloor;

  return (
    <div className="flex justify-around">
      <SliderInput
        label="Strike price"
        name="strike-price"
        min={scenario.ethFloor}
        max={scenario.ethCeil}
        defaultVal={strikePriceMid}
        value={scenario.option.strikePrice}
        setValue={scenario.setStrikePrice}
      />
      <SliderInput
        label="Option size"
        name="opt-size"
        min={1}
        max={10}
        defaultVal={1}
        value={scenario.optSize}
        setValue={scenario.setOptSize}
      />
    </div>
  );
}
