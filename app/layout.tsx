import NavBar from "@/components/NavBar";
import type { Metadata, Viewport } from "next";
import { Kodchasan } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const kodchasan = Kodchasan({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kodchasan",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "mixPie DEV — เรียน Python จากพื้นฐานสู่การประยุกต์ใช้",
    template: "%s | mixPie DEV",
  },
  description:
    "แพลตฟอร์มสอน Python ภาษาไทย ครบตั้งแต่พื้นฐานไปจนถึงการนำไปใช้จริง พร้อม IDE ในเบราว์เซอร์และโจทย์ฝึกหัด",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
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
        <Suspense fallback={<NavBarSkeleton />}>
          <NavBar />
        </Suspense>
        <main>{children}</main>
      </body>
    </html>
  );
}

function NavBarSkeleton() {
  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm h-16" />
  );
}
