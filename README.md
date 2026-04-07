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
npm run dev              # Servidor de desenvolvimento
npm run build            # Build de produção (output em dist/)
npm run preview          # Preview do build de produção
npm run test:e2e         # Testes E2E (todos os browsers)
npm run test:e2e:ui      # Testes E2E com interface visual
npm run test:visual      # Visual regression (comparação de screenshots)
npm run test:visual:update  # Atualizar screenshots de referência
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

## Testes

O projeto usa **Playwright** para testes E2E cobrindo 6 pilares, testados em 5 targets (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari).

### Testes automáticos (CI)

Rodam em todo push/PR via GitHub Actions (`--ignore-snapshots`):

| Pilar | O que valida |
|-------|-------------|
| Acessibilidade | axe-core WCAG 2.1 AA (contraste, labels, roles) |
| SEO | meta tags, sitemap, robots.txt, canonical, Open Graph, headings |
| Mobile | viewport sem overflow, conteúdo visível, sidebar responsiva |
| Cross-browser | sem erros JS, status 200, imagens carregadas |
| PWA | manifest.json, icons, theme-color, meta tags |
| Negócio | lógica específica de cada tool |

Toda tool adicionada ao registry (`src/lib/tools.ts`) e ao fixtures (`__tests__/utils/fixtures.ts`) é automaticamente coberta pelos 5 primeiros pilares.

### Visual regression (local)

Screenshots comparativos rodam **apenas localmente** para evitar lentidão no CI.

```bash
# Rodar comparação contra screenshots de referência
npm run test:visual

# Atualizar screenshots após mudança visual intencional
npm run test:visual:update
```

**Fluxo ao alterar o visual de um componente:**

1. Fazer a mudança no código
2. Rodar `npm run test:visual` — vai **falhar** (screenshots divergem)
3. Verificar os diffs em `test-results/` (contém `expected.png`, `actual.png`, `diff.png`)
4. Se o resultado está correto: `npm run test:visual:update` para aceitar o novo baseline
5. Commitar os novos snapshots junto com a mudança de código

Os snapshots ficam em `__tests__/snapshots/{browser}/` e devem ser commitados no repo. Cada browser tem seus próprios baselines.

### Adicionando testes para uma nova tool

1. Copiar `__tests__/templates/tool-test.template.ts` para `__tests__/tools/<slug>.spec.ts`
2. Adicionar a tool em `__tests__/utils/fixtures.ts`
3. Preencher os testes de negócio no arquivo copiado
4. Os testes base (a11y, SEO, mobile, cross-browser, PWA, visual) cobrem a nova tool automaticamente

## Temas

5 presets disponíveis (Midnight, Ember, Arctic, Verdant, Amethyst) com persistência em localStorage e shuffle aleatório.
