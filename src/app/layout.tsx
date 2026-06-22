import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "nedviga — Недвижимость в Ирновии (Артемовск)",
  description: "nedviga - полная копия Авито для недвижимости. Купить, продать или снять жилье в Ирновии. Самая свежая база объявлений в Артемовске и других городах.",
  keywords: ["nedviga", "недвига", "недвижимость ирновия", "артемовск недвижимость", "купить квартиру", "аренда жилья", "авито недвижимость"],
  openGraph: {
    title: "nedviga — Маркетплейс недвижимости",
    description: "Продажа и аренда недвижимости в Ирновии. Удобный поиск и живой чат.",
    type: "website",
    locale: "ru_RU",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
