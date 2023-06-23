"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

export default function SliderInput({
  name,
  min,
  max,
}: {
  name: string;
  min: number;
  max: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const mid = (max - min) / 2 + min;

  const [translate, setTranslate] = useState(mid);

  function updateTranslate(value: number) {
    if (!ref.current) return;

    const width = ref.current.getBoundingClientRect().width;

    const range = max - min;
    const val = value - min;
    const tr = (val * width) / range;

    setTranslate(tr);
  }

  useEffect(() => {
    updateTranslate(mid);
  }, [max, min]);

  return (
    <div className="relative w-96 h-5">
      <div className="absolute w-full h-1 bg-gray-400 rounded-sm"></div>
      <div
        className="absolute h-9 w-9 bg-orange -translate-y-1/2 -translate-x-1/2 rounded-full cursor-pointer"
        style={{ translate: `${translate}px` }}
      />
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        defaultValue={mid}
        name={name}
        className="range-slider_input absolute w-full appearance-none h-1 opacity-0 m-0 "
        onChange={(e) => updateTranslate(e.target.valueAsNumber)}
      />
    </div>
  );
}
