import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "yellow";
  href?: string;
}

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center gap-2 px-7 py-3 rounded-[10px] font-semibold text-base transition-all duration-200";

  const variants = {
    primary:
      "bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)]",
    secondary:
      "bg-white text-gray-700 border-[1.5px] border-gray-200 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 hover:-translate-y-0.5",
    yellow:
      "bg-yellow-400 text-gray-900 font-bold shadow-[0_2px_8px_rgba(234,179,8,0.25)] hover:bg-yellow-500 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(234,179,8,0.35)]",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
