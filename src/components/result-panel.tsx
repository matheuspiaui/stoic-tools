import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResultPanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function ResultPanel({ title, children, className }: ResultPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-muted/20 bg-panel p-5",
        className
      )}
    >
      {title && (
        <h3 className="mb-3 text-sm font-medium text-muted">{title}</h3>
      )}
      {children}
    </div>
  );
}
