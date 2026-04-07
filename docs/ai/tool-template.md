# Tool Template

Estrutura esperada de uma ferramenta Stoic Tools.

## Componente React (`src/components/tools/<slug>.tsx`)

```tsx
import { useState } from "react";
import { ToolPage } from "@/components/tool-page";
import { FieldGroup } from "@/components/field-group";
import { ResultPanel } from "@/components/result-panel";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SomeIcon } from "lucide-react";

export function MyToolName() {
  const [input, setInput] = useState("");

  const hasResult = input.trim().length > 0;
  const result = hasResult ? processInput(input) : null;

  return (
    <ToolPage
      title="Nome da Ferramenta"
      description="Uma frase descrevendo o que faz."
    >
      <FieldGroup label="Entrada" htmlFor="my-input">
        <Input
          id="my-input"
          placeholder="Digite algo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </FieldGroup>

      {hasResult && result ? (
        <ResultPanel title="Resultado">
          <p className="text-2xl font-bold text-accent font-mono">{result}</p>
        </ResultPanel>
      ) : (
        <EmptyState
          icon={SomeIcon}
          title="Aguardando entrada"
          description="Preencha os campos acima."
        />
      )}
    </ToolPage>
  );
}
```

## Página Astro (`src/pages/tools/<slug>.astro`)

```astro
---
import AppLayout from "../../layouts/AppLayout.astro";
import { MyToolName } from "../../components/tools/<slug>";
---

<AppLayout title="Nome — Stoic Tools">
  <MyToolName client:load />
</AppLayout>
```

## Registro (`src/lib/tools.ts`)

```ts
{
  slug: "<slug>",
  name: "Nome da Ferramenta",
  description: "Uma frase descrevendo o que faz.",
  icon: SomeIcon,
  category: "Categoria",
},
```

## Padrões

- **Estado local:** `useState` para inputs e resultado derivado
- **Resultado reativo:** calcular resultado no corpo do componente, sem useEffect
- **Empty state:** sempre mostrar um estado vazio quando não há input
- **Copiar resultado:** incluir botão de copiar quando o resultado é texto
- **Responsivo:** testar em mobile (o layout já cuida do sidebar)
