import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="lg:mt-24">
        <p className="text-24 text-blue mb-8">
          We couldn&apos;t find what you were looking for.
        </p>
        <Link href={"/"} className="underline">
          Home
        </Link>
      </div>
    </>
  );
}
