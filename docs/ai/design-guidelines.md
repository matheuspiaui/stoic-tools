# Design Guidelines

Diretrizes visuais para ferramentas Stoic Tools.

## Layout

- Cada ferramenta usa `ToolPage` como wrapper principal
- Conteúdo centrado com `max-w-2xl` dentro do ToolPage
- Seções empilhadas verticalmente com `space-y-6`
- Inputs em `FieldGroup`, resultados em `ResultPanel`

## Cores

Use apenas tokens semânticos do tema. Nunca hardcode hex.

| Token | Uso |
|-------|-----|
| `surface` | Background da página |
| `panel` | Background de cards e painéis |
| `accent` | Destaques, valores importantes, links ativos |
| `foreground` | Texto principal |
| `muted` | Texto secundário, labels, hints |
| `success` | Indicadores positivos |
| `danger` | Indicadores negativos, erros |
| `warning` | Avisos, atenção |

## Tipografia

- **Sans (Inter):** corpo do texto, labels, botões
- **Mono (JetBrains Mono):** valores numéricos, código, resultados

## Componentes UI

Prioridade de uso:

1. Componentes `src/components/ui/` (Button, Input, Select, Card)
2. Wrappers de ferramenta (ToolPage, FieldGroup, ResultPanel, EmptyState)
3. HTML semântico com classes Tailwind
4. Novos componentes shadcn/ui (seguir padrão CVA + cn)

## Responsividade

- Sidebar colapsa em mobile (já tratado pelo AppLayout)
- Ferramentas devem funcionar em telas estreitas (min 320px)
- Preferir layouts empilhados a grids complexos

## Anti-patterns

- Não criar modais ou drawers para exibir resultados
- Não usar cores hardcoded
- Não adicionar animações complexas
- Não criar navegação interna dentro de uma ferramenta
