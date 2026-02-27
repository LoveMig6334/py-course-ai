interface BadgeProps {
  variant?: "basic" | "application";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "basic",
  children,
  className = "",
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.8125rem] font-semibold";

  const variants = {
    basic: "bg-blue-50 text-blue-600",
    application: "bg-yellow-50 text-yellow-600",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
