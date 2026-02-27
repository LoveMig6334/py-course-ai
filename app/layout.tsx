import NavBar from "@/components/NavBar";
import type { Metadata } from "next";
import { Kodchasan } from "next/font/google";
import "./globals.css";

const kodchasan = Kodchasan({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kodchasan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "mixPie DEV — เรียน Python จากพื้นฐานสู่การประยุกต์ใช้",
  description:
    "แพลตฟอร์มสอน Python ภาษาไทย ครบตั้งแต่พื้นฐานไปจนถึงการนำไปใช้จริง พร้อม IDE ในเบราว์เซอร์และโจทย์ฝึกหัด",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${kodchasan.variable} font-sans bg-white text-gray-900 antialiased min-h-screen flex flex-col`}
      >
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
