import OptionsList from "@/components/OptionsList";
import { getAvailableOptions } from "@/lib/api";

export default async function Home() {
  const options = await getAvailableOptions();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <OptionsList data={options?.data} />
    </main>
  );
}
