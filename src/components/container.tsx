import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export default function Container({ className, children }: ContainerProps) {
  return (
    <div className={cn("mx-auto mt-16 w-full max-w-[80rem] px-2", className)}>
      {children}
    </div>
  );
}
