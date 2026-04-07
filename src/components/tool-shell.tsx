import type { ReactNode } from "react";
import { AppHeader } from "./app-header";

interface ToolShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ToolShell({ title, description, children }: ToolShellProps) {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title={title} description={description} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
