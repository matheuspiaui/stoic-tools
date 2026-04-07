# Stoic Tools

Canivete suíço de ferramentas utilitárias web. Cada ferramenta vive em uma única página, é registrada em um catálogo central, e herda automaticamente o layout e tema do app.

## Stack

- **Astro** — shell do site e rotas estáticas
- **React** — islands interativas (`client:load`) para cada ferramenta
- **Tailwind CSS v4** — styling via Vite plugin
- **shadcn/ui** — componentes base (Button, Input, Select, Card)
- **TypeScript** — tipagem estrita em todo o projeto

## Comandos

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção (output em dist/)
npm run preview    # Preview do build de produção
```

## Estrutura

```
src/
├── components/
│   ├── ui/              # Primitivos shadcn/ui
│   ├── tools/           # Componentes React de cada ferramenta
│   ├── app-sidebar.tsx   # Navegação lateral
│   ├── app-header.tsx    # Cabeçalho reutilizável
│   ├── theme-switcher.tsx
│   ├── tool-page.tsx     # Wrapper de página de ferramenta
│   ├── tool-shell.tsx    # Shell genérico
│   ├── result-panel.tsx  # Bloco de resultado
│   ├── empty-state.tsx   # Estado vazio
│   └── field-group.tsx   # Grupo label + input
├── layouts/
│   └── AppLayout.astro   # Layout principal com sidebar + tema
├── lib/
│   ├── tools.ts          # Registro central de ferramentas
│   ├── themes.ts         # Presets de tema + shuffle
│   └── utils.ts          # cn() helper
├── pages/
│   ├── index.astro       # Home/catálogo
│   └── tools/            # Uma página .astro por ferramenta
├── styles/
│   └── globals.css       # Tailwind + tokens de tema
└── types/
    └── tool.ts           # Contrato de tipo Tool
```

## Regra Principal

**Cada ferramenta cabe em uma página.** Sem sub-rotas, sem micro-sites, sem estruturas paralelas.

## Adicionando uma Ferramenta

Consulte `docs/ai/add-tool-playbook.md` para o passo a passo completo.

## Temas

5 presets disponíveis (Midnight, Ember, Arctic, Verdant, Amethyst) com persistência em localStorage e shuffle aleatório.
