interface AppHeaderProps {
  title: string;
  description?: string;
}

export function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="border-b border-muted/20 px-6 py-4">
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-muted">{description}</p>
      )}
    </header>
  );
}
