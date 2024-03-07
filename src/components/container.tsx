import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export default function Container({ className, children }: ContainerProps) {
  return (
    <div className={cn("mx-auto px-2 w-full mt-10 max-w-[70rem]", className)}>
      {children}
    </div>
  );
}
