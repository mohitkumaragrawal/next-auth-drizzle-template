import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900", "700", "600"],
  style: "normal",
});

interface TypographyProps {
  className?: string;
  children: React.ReactNode;
  subheading?: React.ReactNode;
}

export function Heading1({ className, children, subheading }: TypographyProps) {
  return (
    <h1 className={className}>
      <p className={cn("text-4xl font-bold", poppins.className)}>{children}</p>
      <p className="mt-1 text-muted-foreground">{subheading}</p>
    </h1>
  );
}

export function Heading2({ className, children, subheading }: TypographyProps) {
  return (
    <h2>
      <p className={cn("text-2xl font-bold", className, poppins.className)}>
        {children}
      </p>
      <p className="text-muted-foreground">{subheading}</p>
    </h2>
  );
}

export function Heading3({ className, children, subheading }: TypographyProps) {
  return (
    <h3>
      <p className={cn("text-xl font-bold", className, poppins.className)}>
        {children}
      </p>
      <p className="text-muted-foreground">{subheading}</p>
    </h3>
  );
}
