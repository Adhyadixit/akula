import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("container mx-auto px-4 md:px-6 max-w-7xl", className)}
      {...props}
    />
  );
}
