# Add Tool Playbook

Passo a passo para adicionar uma nova ferramenta ao Stoic Tools.

## Checklist

### 1. Criar o componente React

Arquivo: `src/components/tools/<slug>.tsx`

```tsx
import { useState } from "react";
import { ToolPage } from "@/components/tool-page";
import { FieldGroup } from "@/components/field-group";
import { ResultPanel } from "@/components/result-panel";
import { EmptyState } from "@/components/empty-state";

export function MyTool() {
  // estado local
  return (
    <ToolPage title="Nome da Ferramenta" description="Descrição curta.">
      {/* FieldGroups para inputs */}
      {/* ResultPanel ou EmptyState para output */}
    </ToolPage>
  );
}
```

### 2. Criar a página Astro

Arquivo: `src/pages/tools/<slug>.astro`

```astro
---
import AppLayout from "../../layouts/AppLayout.astro";
import { MyTool } from "../../components/tools/<slug>";
---

<AppLayout title="Nome — Stoic Tools">
  <MyTool client:load />
</AppLayout>
```

### 3. Registrar no catálogo

Arquivo: `src/lib/tools.ts`

Adicione uma entrada ao array `tools`:

```ts
{
  slug: "<slug>",
  name: "Nome da Ferramenta",
  description: "Descrição curta.",
  icon: SomeIcon, // de lucide-react
  category: "Categoria",
},
```

### 4. Verificar

```bash
npm run build   # deve compilar sem erros
npm run dev     # verificar visualmente
```

### 5. Confirmar

- [ ] Ferramenta aparece no sidebar
- [ ] Ferramenta aparece no catálogo (home)
- [ ] Herda o tema ativo
- [ ] Funciona em mobile
- [ ] Cabe em uma página (sem sub-rotas)
