import "@/styles/globals.css";
import { Inter, Yeseva_One } from "next/font/google";
import { QueryProvider } from "@/lib/queryProvider";
import { StarknetProvider } from "@/lib/starknetProvider";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const yeseva_one = Yeseva_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yeseva-one",
});

export const metadata: Metadata = {
  title: "Falcone",
  description:
    "Your educational resource that will guide you in your onboarding to options and Carmine Finance.",

  openGraph: {
    images: [
      {
        url: "/falcone_social.png",
        width: 843,
        height: 441,
        alt: "Falcone",
      },
    ],
    locale: "en_US",
    type: "website",
    url: "https://falcone.finiam.com",
    siteName: "Falcone",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <QueryProvider>
        <StarknetProvider>
          <body
            className={`${inter.variable} ${yeseva_one.variable} font-inter text-black bg-offwhite`}
          >
            {children}
          </body>
        </StarknetProvider>
      </QueryProvider>
    </html>
  );
}
