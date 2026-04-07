import { tools, getToolUrl } from "@/lib/tools";
import { cn } from "@/lib/utils";
import { PanelLeft, X } from "lucide-react";
import { useState } from "react";

interface AppSidebarProps {
  currentPath: string;
}

export function AppSidebar({ currentPath }: AppSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 left-3 z-50 rounded-md p-2 text-muted hover:text-foreground hover:bg-panel md:hidden"
        aria-label="Abrir menu"
      >
        <PanelLeft className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-muted/20 bg-panel transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-muted/20 px-4 py-3">
          <a href="/" className="text-lg font-bold text-foreground tracking-tight">
            Stoic Tools
          </a>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-muted hover:text-foreground md:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {tools.map((tool) => {
              const href = getToolUrl(tool);
              const isActive = currentPath === href;
              const Icon = tool.icon;
              return (
                <li key={tool.slug}>
                  <a
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-muted hover:bg-muted/10 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {tool.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-muted/20 px-4 py-3 text-xs text-muted">
          Ferramentas utilitárias
        </div>
      </aside>
    </>
  );
}
