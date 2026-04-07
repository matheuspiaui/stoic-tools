import { Ruler, CaseSensitive } from "lucide-react";
import type { Tool } from "@/types/tool";

export const tools: Tool[] = [
  {
    slug: "unit-converter",
    name: "Conversor de Unidades",
    description: "Converta valores entre diferentes unidades de medida.",
    icon: Ruler,
    category: "Utilidades",
  },
  {
    slug: "text-case-converter",
    name: "Conversor de Texto",
    description: "Transforme texto entre diferentes formatos de capitalização.",
    icon: CaseSensitive,
    category: "Texto",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolUrl(tool: Tool): string {
  return `/tools/${tool.slug}`;
}
