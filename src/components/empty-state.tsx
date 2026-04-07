import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon className="mb-4 h-10 w-10 text-muted/40" />}
      <h3 className="text-sm font-medium text-muted">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-muted/60">{description}</p>
      )}
    </div>
  );
}
