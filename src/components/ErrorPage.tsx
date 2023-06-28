import Image from "next/image";

export default function ErrorPage() {
  return (
    <div className="w-full h-full flex items-center justify-center text-center">
      <section>
        <Image
          src={"/falcone_logo.png"}
          alt="Falcone logo"
          className="mx-auto"
          width={104}
          height={34}
        />
        <p className="mb-0 mt-10">Something went wrong!</p>
        <p className="text-16">
          We&apos;re sorry for the inconvenience. Please come back later.
        </p>
      </section>
    </div>
  );
}
