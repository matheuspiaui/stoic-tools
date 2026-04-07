# Stoic Tools Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Astro foundation for a reusable multi-tool web app with a sidebar, centralized tool registry, shadcn/ui-based UI, theme presets with shuffle, and built-in AI documentation for adding future one-page tools.

**Architecture:** Astro provides the app shell, route structure, and page rendering. React islands are used only where interactivity is needed, with a centralized tool registry powering navigation and discovery. Theme presets live in a small shared layer so every future tool inherits the same layout and visual system automatically.

**Tech Stack:** Astro, React, Tailwind CSS, shadcn/ui, TypeScript, localStorage for theme persistence

---

### Task 1: Scaffold the Astro app

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `.gitignore`

**Step 1: Scaffold the base project files**

Create the Astro project configuration with React support and the package scripts required for local development and build.

**Step 2: Install the core app dependencies**

Run: `npm install astro @astrojs/react react react-dom`
Expected: install completes successfully and generates `package-lock.json`

**Step 3: Verify Astro config loads**

Run: `npm run astro -- --version`
Expected: Astro CLI prints the installed version

**Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/env.d.ts .gitignore
git commit -m "chore: scaffold Astro foundation"
```

### Task 2: Add Tailwind and the base styling layer

**Files:**
- Create: `tailwind.config.mjs`
- Create: `postcss.config.cjs`
- Create: `src/styles/globals.css`
- Modify: `package.json`

**Step 1: Add styling dependencies**

Run: `npm install -D tailwindcss postcss autoprefixer`
Expected: dependencies are added to `package.json`

**Step 2: Configure Tailwind scanning and base tokens**

Add Tailwind config for Astro and React files, and create a global stylesheet with base app tokens and theme hooks.

**Step 3: Verify the CSS pipeline**

Run: `npm run build`
Expected: build succeeds with generated CSS output

**Step 4: Commit**

```bash
git add package.json package-lock.json tailwind.config.mjs postcss.config.cjs src/styles/globals.css
git commit -m "style: add Tailwind base layer"
```

### Task 3: Integrate shadcn/ui-ready primitives

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/components/ui/card.tsx`
- Modify: `package.json`

**Step 1: Add UI helper dependencies**

Run: `npm install clsx tailwind-merge lucide-react class-variance-authority`
Expected: helper packages are available for shadcn-style components

**Step 2: Add shadcn-compatible config and utilities**

Create `components.json` and shared utility helpers so future components can follow the same conventions.

**Step 3: Add the first reusable UI primitives**

Create a minimal starting kit of shadcn-style components needed by the app shell and sample tools.

**Step 4: Verify TypeScript compilation**

Run: `npm run build`
Expected: build succeeds without component import errors

**Step 5: Commit**

```bash
git add package.json package-lock.json components.json src/lib/utils.ts src/components/ui
git commit -m "feat: add shadcn-style UI primitives"
```

### Task 4: Create the centralized tool registry

**Files:**
- Create: `src/lib/tools.ts`
- Create: `src/types/tool.ts`
- Test: `src/lib/tools.ts`

**Step 1: Define the tool type contract**

Create a single TypeScript type describing the fields every tool must provide.

**Step 2: Create the registry module**

Add the initial tool list with one or two examples and export helpers for lookup and navigation.

**Step 3: Validate registry usage**

Run: `npm run build`
Expected: the app compiles with typed registry exports and no unresolved imports

**Step 4: Commit**

```bash
git add src/types/tool.ts src/lib/tools.ts
git commit -m "feat: add centralized tool registry"
```

### Task 5: Build the app shell with sidebar navigation

**Files:**
- Create: `src/layouts/AppLayout.astro`
- Create: `src/components/app-sidebar.tsx`
- Create: `src/components/app-header.tsx`
- Create: `src/components/tool-shell.tsx`
- Create: `src/pages/index.astro`

**Step 1: Create the shared layout**

Build the main Astro layout with sidebar, content region, and responsive structure.

**Step 2: Bind navigation to the tool registry**

Make the sidebar and home page render from `src/lib/tools.ts`.

**Step 3: Verify responsive rendering**

Run: `npm run build`
Expected: all pages render successfully using the shared layout

**Step 4: Commit**

```bash
git add src/layouts/AppLayout.astro src/components/app-sidebar.tsx src/components/app-header.tsx src/components/tool-shell.tsx src/pages/index.astro
git commit -m "feat: add app shell and sidebar navigation"
```

### Task 6: Add theme presets and shuffle behavior

**Files:**
- Create: `src/lib/themes.ts`
- Create: `src/components/theme-switcher.tsx`
- Modify: `src/layouts/AppLayout.astro`
- Modify: `src/styles/globals.css`

**Step 1: Define theme presets**

Create a small set of app-wide themes with token mappings for surfaces, accents, and text.

**Step 2: Implement theme persistence and shuffle**

Add a client component that can switch themes, shuffle among presets, and persist the selected theme in `localStorage`.

**Step 3: Apply theme tokens globally**

Wire the active theme into the layout so all routes and future tools inherit it automatically.

**Step 4: Verify the client behavior**

Run: `npm run build`
Expected: build succeeds and client hydration targets compile successfully

**Step 5: Commit**

```bash
git add src/lib/themes.ts src/components/theme-switcher.tsx src/layouts/AppLayout.astro src/styles/globals.css
git commit -m "feat: add app themes with shuffle"
```

### Task 7: Create reusable one-page tool scaffolding

**Files:**
- Create: `src/components/tool-page.tsx`
- Create: `src/components/result-panel.tsx`
- Create: `src/components/empty-state.tsx`
- Create: `src/components/field-group.tsx`

**Step 1: Build the structural components for tools**

Create wrappers that standardize page title, description, input sections, and result display.

**Step 2: Keep the abstraction intentionally small**

Avoid overbuilding a design system. Only add the pieces needed to make future tools fast to ship.

**Step 3: Verify imports and composition**

Run: `npm run build`
Expected: shared tool components compile cleanly

**Step 4: Commit**

```bash
git add src/components/tool-page.tsx src/components/result-panel.tsx src/components/empty-state.tsx src/components/field-group.tsx
git commit -m "feat: add reusable one-page tool scaffolding"
```

### Task 8: Add sample tools as reference implementations

**Files:**
- Create: `src/pages/tools/unit-converter.astro`
- Create: `src/pages/tools/text-case-converter.astro`
- Create: `src/components/tools/unit-converter.tsx`
- Create: `src/components/tools/text-case-converter.tsx`
- Modify: `src/lib/tools.ts`

**Step 1: Add the first simple utility tool**

Implement a converter example that demonstrates form inputs and derived output.

**Step 2: Add a second tool with different interaction shape**

Implement a text transformation example that demonstrates client-side editing and copyable output.

**Step 3: Register both tools**

Add them to the centralized tool registry so the menu and home page update automatically.

**Step 4: Verify end-to-end integration**

Run: `npm run build`
Expected: both sample tools render and are included in navigation

**Step 5: Commit**

```bash
git add src/pages/tools src/components/tools src/lib/tools.ts
git commit -m "feat: add sample one-page tools"
```

### Task 9: Write agent-facing project documentation

**Files:**
- Create: `README.md`
- Create: `docs/ai/project-rules.md`
- Create: `docs/ai/add-tool-playbook.md`
- Create: `docs/ai/tool-template.md`
- Create: `docs/ai/design-guidelines.md`

**Step 1: Write the root README**

Document the project goal, stack, commands, folder structure, and the rule that every tool must fit within a single page.

**Step 2: Write persistent AI guidance**

Create the `docs/ai` documents that explain how to add tools correctly and when not to introduce new patterns.

**Step 3: Verify docs against the actual structure**

Check that all referenced files, commands, and conventions match the implemented codebase.

**Step 4: Commit**

```bash
git add README.md docs/ai
git commit -m "docs: add AI playbooks for future tools"
```

### Task 10: Final verification

**Files:**
- Test: `package.json`
- Test: `src/`
- Test: `docs/`

**Step 1: Run the full production build**

Run: `npm run build`
Expected: Astro build completes successfully

**Step 2: Run the local dev server smoke check**

Run: `npm run dev`
Expected: local server starts without config or import errors

**Step 3: Review the final UX checklist**

Confirm:
- the sidebar is populated from the registry
- themes can be switched and shuffled
- tools fit within one page
- sample tools follow the same structure future tools should use
- agent docs match the implemented workflow

**Step 4: Commit**

```bash
git add .
git commit -m "feat: deliver Stoic Tools foundation"
```
