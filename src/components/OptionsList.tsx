import { getAvailableOptions } from "@/lib/api";
import { getSideName, getTypeName } from "@/lib/units";
import { useQuery } from "react-query";

export default function OptionsList() {
  const { data, isLoading } = useQuery("live-options", getAvailableOptions, {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold">Options</h2>

      {isLoading && "fetching..."}

      <section className="flex flex-col gap-2 w-full">
        <div className="flex gap-8">
          <p className="w-1/4 font-bold">Type</p>
          <p className="w-1/4 font-bold">Strike price</p>
          <p className="w-1/4 font-bold">Maturity</p>
          <p className="w-1/4 font-bold">Premium</p>
        </div>
        {data &&
          data.map((option, idx) => (
            <div key={idx} className="flex gap-8">
              <div className="w-1/4">
                {getTypeName(option.optionType)} /{" "}
                {getSideName(option.optionSide)}
              </div>
              <div className="w-1/4">{option.strikePrice}</div>
              <div className="w-1/4">
                {new Date(option.maturity).toLocaleDateString()}
              </div>
              <div className="w-1/4">{option.premiumDecimal.toFixed(4)}</div>
            </div>
          ))}
      </section>
    </div>
  );
}
