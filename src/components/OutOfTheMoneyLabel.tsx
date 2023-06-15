import Image from "next/image";

export default function OutOfTheMoneyLabel({
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
          src="/out_of_the_money.png"
          alt="Out the money symbol"
          width={56}
          height={56}
        />
      </div>
      <span
        className={`text-24 uppercase text-red whitespace-nowrap ${labelCss}`}
      >
        Out-of-the-money
      </span>
    </div>
  );
}
