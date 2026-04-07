# Stoic Tools Foundation Design

**Date:** 2026-04-07

## Goal

Construir um web app em Astro que funcione como um canivete suíço de ferramentas utilitárias, onde cada ferramenta vive em uma única página e pode ser adicionada pela IA seguindo uma estrutura previsível, com navegação lateral, tema consistente e documentação operacional embutida no repositório.

## Product Shape

O produto será um único site com sidebar persistente e uma área principal de conteúdo. Cada item da sidebar representa uma ferramenta. A regra principal do projeto é que cada nova ferramenta deve caber em uma página, sem criar um microsite ou uma estrutura paralela dentro do app.

A home deve servir como índice das ferramentas disponíveis e ponto de entrada para descobrir o catálogo. O foco do produto não é marketing, mas utilidade operacional: abrir, usar a ferramenta, copiar o resultado e seguir para a próxima.

## Recommended Architecture

### Stack

- Astro como shell do site
- React islands para ferramentas interativas
- Tailwind CSS para styling
- shadcn/ui como base de componentes
- Registro central de ferramentas para alimentar navegação e catálogo

### Why This Approach

Astro mantém o site leve e organizado, enquanto React entra apenas nas páginas que realmente precisarem de estado local, inputs dinâmicos ou interações mais ricas. Isso preserva a vantagem de performance do Astro e evita transformar o projeto inteiro em uma SPA sem necessidade.

O uso de um registro central reduz ambiguidade para agentes e para futuras manutenções. Em vez de editar manualmente menu, home e rotas de maneiras diferentes, a adição de uma nova ferramenta segue um contrato claro.

## Project Structure

Estrutura proposta:

- `src/layouts/` para a moldura principal do app
- `src/components/` para blocos reutilizáveis e wrappers de ferramenta
- `src/components/ui/` para componentes do shadcn/ui
- `src/lib/tools.ts` para o catálogo central de ferramentas
- `src/lib/themes.ts` para presets de tema e shuffle
- `src/pages/` para rotas Astro
- `src/pages/tools/` para páginas das ferramentas
- `docs/ai/` para instruções operacionais voltadas a agentes

## Tool Contract

Cada ferramenta deve:

- existir em uma única página
- aparecer no menu lateral
- ser registrada no catálogo central
- reutilizar o layout global do projeto
- respeitar o tema ativo
- usar componentes existentes antes de criar novos padrões

Formato esperado da página:

- cabeçalho curto com nome e descrição
- bloco de entrada
- bloco de resultado
- ações secundárias, quando necessário

## Navigation Model

A navegação principal será uma sidebar fixa no desktop e adaptável no mobile. O menu lateral será derivado do registro central de ferramentas, garantindo que o estado da navegação e o catálogo visual usem a mesma fonte de verdade.

Isso permite que a IA adicione uma ferramenta nova com baixo risco de inconsistência: cria a página, registra a ferramenta, e o item já passa a existir onde precisa existir.

## Visual System

Não haverá design system próprio nesta fase. O projeto usará shadcn/ui como base para inputs, botões, selects, diálogos e blocos de interface.

Em vez de investir em um sistema visual proprietário, a fundação terá:

- alguns presets de tema globais
- troca de tema com persistência local
- uma ação de shuffle para alternar entre temas disponíveis

O objetivo é acelerar a criação de novas ferramentas sem custo extra de manutenção visual.

## Agent Documentation

O repositório deve incluir documentação explícita para agentes:

- `README.md` com visão geral, stack, estrutura e regra principal do projeto
- `docs/ai/project-rules.md` com regras permanentes
- `docs/ai/add-tool-playbook.md` com o passo a passo para criar uma nova ferramenta
- `docs/ai/tool-template.md` com o formato esperado de uma tool
- `docs/ai/design-guidelines.md` com diretrizes de uso de tema, layout e componentes do shadcn/ui

Esses arquivos existem para tornar o comportamento esperado implícito: ao pedir para a IA criar uma ferramenta, ela deve entender que a feature precisa caber em uma página, entrar no catálogo, herdar o layout e respeitar o tema atual.

## V1 Scope

A primeira versão deve entregar:

- base Astro funcional
- React configurado para islands
- Tailwind + shadcn/ui integrados
- layout principal com sidebar
- home do catálogo
- registro central de ferramentas
- suporte a temas com shuffle
- uma ou duas ferramentas de exemplo
- documentação para agentes dentro do repositório

## Quality Criteria

A fundação estará correta quando:

- adicionar uma nova ferramenta exigir mudanças pequenas e previsíveis
- a nova ferramenta entrar no menu lateral sem retrabalho estrutural
- a UI se manter consistente usando shadcn/ui e os temas globais
- desktop e mobile funcionarem de forma adequada
- agentes consigam seguir a estrutura apenas lendo a documentação do projeto

## Deferred Decisions

Ficam fora da V1, a menos que surjam como necessidade real:

- autenticação
- backend próprio
- busca avançada
- favoritos
- analytics
- persistência remota
- categorização complexa

O princípio é manter a base enxuta e otimizada para crescer por adição de ferramentas pequenas.
