import OptionsList from "@/components/OptionsList";
import { getRawAvailableOptions } from "@/lib/api";

export default async function Home() {
  const { data } = await getRawAvailableOptions();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <OptionsList rawData={data} />
    </main>
  );
}
