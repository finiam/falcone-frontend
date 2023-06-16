import { StarknetProvider } from "@/lib/starknetProvider";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { QueryProvider } from "@/lib/queryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Carmine",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <QueryProvider>
    <StarknetProvider>
      <Header />
      {children}
    </StarknetProvider>
    // </QueryProvider>
  );
}
