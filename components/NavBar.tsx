"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/course", label: "คอร์สเรียน" },
  { href: "/challenge", label: "โจทย์ฝึกหัด" },
];

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b justify-center flex border-gray-100 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 no-underline text-xl font-bold tracking-tight"
        >
          <span className="text-blue-600">mix</span>
          <span className="text-gray-900">Pie</span>
          <span className="bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-md text-xs font-bold tracking-wider uppercase ml-0.5">
            DEV
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-[10px] no-underline font-medium text-[0.9375rem] transition-all duration-200 ${
                isActive(link.href)
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
