interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function FeatureCard({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl p-7 transition-all duration-200 hover:border-blue-600 hover:shadow-md hover:-translate-y-0.75 ${className}`}
    >
      {children}
    </div>
  );
}

export function CourseCard({
  children,
  className = "",
  href,
}: CardProps & { href?: string }) {
  const CardContainer = href ? "a" : "div";
  return (
    <CardContainer
      href={href}
      className={`flex flex-col bg-white border-[1.5px] border-gray-200 rounded-2xl p-6 text-inherit transition-all duration-200 hover:border-blue-600 hover:shadow-md hover:-translate-y-0.75 no-underline ${className}`}
    >
      {children}
    </CardContainer>
  );
}
