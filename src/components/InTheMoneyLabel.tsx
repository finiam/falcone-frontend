import Image from "next/image";

export default function InTheMoneyLabel({
  className,
  iconCss,
  labelCss,
}: {
  className?: string;
  iconCss?: string;
  labelCss?: string;
}) {
  return (
    <div
      className={`w-fit flex gap-6 items-center justify-center ${className}`}
    >
      <div className={iconCss}>
        <Image
          src="/in_the_money.svg"
          alt="In the money symbol"
          width={56}
          height={56}
        />
      </div>
      <span
        className={`text-24 uppercase text-green whitespace-nowrap ${labelCss}`}
      >
        In-the-money
      </span>
    </div>
  );
}
