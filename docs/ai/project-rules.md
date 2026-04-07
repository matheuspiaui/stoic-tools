# Project Rules

Regras permanentes para qualquer agente operando neste repositório.

## Arquitetura

1. **Astro é o shell.** Cada ferramenta é uma página `.astro` em `src/pages/tools/` que monta um componente React via `client:load`.
2. **React é para interatividade.** Lógica de UI, estado local e inputs vivem em componentes React em `src/components/tools/`.
3. **Uma página por ferramenta.** Sem sub-rotas, sem navegação interna, sem estado compartilhado entre ferramentas.
4. **Registro central.** Toda ferramenta deve estar em `src/lib/tools.ts`. Sidebar e catálogo derivam dessa lista.

## Componentes

5. **Reutilizar antes de criar.** Use `ToolPage`, `FieldGroup`, `ResultPanel`, `EmptyState` e os componentes `ui/` antes de criar abstrações novas.
6. **shadcn/ui é a base.** Novos componentes UI devem seguir o padrão shadcn (CVA + cn + Radix). Adicione em `src/components/ui/`.
7. **Não criar design system paralelo.** O sistema visual é Tailwind + tokens de tema + shadcn/ui.

## Temas

8. **Respeitar os tokens de tema.** Use as cores semânticas (`surface`, `panel`, `accent`, `muted`, `foreground`, etc.) — nunca hardcode cores.
9. **Não adicionar temas sem necessidade.** Os presets existentes cobrem a maioria dos casos.

## Qualidade

10. **Build deve passar.** `npm run build` deve completar sem erros antes de qualquer commit.
11. **TypeScript estrito.** Sem `any`, sem `@ts-ignore` sem justificativa.
12. **UI em português.** Textos visíveis ao usuário em pt-BR.
