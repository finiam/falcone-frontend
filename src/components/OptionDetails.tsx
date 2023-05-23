import { getSideName, getTypeName, isLong } from "@/lib/units";
import { LiveOption } from "@/types/option";

export default function OptionDetails({ option, index }: { option: LiveOption; index: number }) {
  const long = isLong(option.optionSide);

  return (
    <div className="w-full mb-24">
      <h2 className="text-xl font-bold">Option {index}</h2>
      <h3>
        {getSideName(option.optionSide)} {getTypeName(option.optionType)} for {option.strikePrice}{" "}
        expiring on {new Date(option.maturity).toLocaleDateString()}
      </h3>
      <div className="flex flex-col gap-2">
        <p>Premium: {option.premiumDecimal.toFixed(4)}</p>

        <button type="button" className="bg-slate-700 px-1 py-2 w-fit">
          {long ? "Buy" : "Sell"} for {option.premiumDecimal.toFixed(4)}
        </button>
      </div>
    </div>
  );
}
