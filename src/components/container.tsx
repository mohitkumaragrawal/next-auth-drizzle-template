import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export default function Container({ className, children }: ContainerProps) {
  return (
    <div className={cn("mx-auto mt-10 w-full max-w-[70rem] px-2", className)}>
      {children}
    </div>
  );
}
