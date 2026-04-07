import type { ReactNode } from "react";

interface ToolPageProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ToolPage({ title, description, children }: ToolPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-muted/20 px-6 py-4">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">{children}</div>
      </main>
    </div>
  );
}
