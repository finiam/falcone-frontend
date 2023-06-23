"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function SliderInput({
  name,
  min,
  max,
  defaultVal,
  label,
  setValue,
  value,
}: {
  name: string;
  min: number;
  max: number;
  defaultVal: number;
  label: string;
  setValue: (val: number) => void;
  value: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [translate, setTranslate] = useState(0);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { valueAsNumber } = event.target;

    setValue(valueAsNumber);
    updateTranslate(valueAsNumber);
  }

  function updateTranslate(value: number) {
    if (!ref.current) return;

    const width = ref.current.getBoundingClientRect().width;

    const range = max - min;
    const val = value - min;
    const tr = (val * width) / range;

    setTranslate(tr);
  }

  useEffect(() => {
    updateTranslate(defaultVal);
  }, [max, min]);

  return (
    <section className="w-fit">
      <div className="flex justify-between mb-2">
        <p className="mb-0 text-16 text-blue">{label}</p>
        <p className="mb-0 text-16 text-blue opacity-50">{value}</p>
      </div>
      <div className="relative w-96 h-5">
        <div className="absolute w-full h-1 bg-gray-400 rounded-sm"></div>
        <div
          className="absolute h-7 w-7 bg-orange -translate-y-1/2 -translate-x-1/2 rounded-full cursor-pointer"
          style={{ translate: `${translate}px` }}
        />
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          defaultValue={defaultVal}
          name={name}
          className="range-slider_input absolute w-full appearance-none h-1 opacity-0 m-0 "
          onChange={handleChange}
        />
      </div>
    </section>
  );
}
