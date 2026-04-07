import { useState } from "react";
import { ToolPage } from "@/components/tool-page";
import { FieldGroup } from "@/components/field-group";
import { ResultPanel } from "@/components/result-panel";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { CaseSensitive, Copy, Check } from "lucide-react";

type CaseType =
  | "uppercase"
  | "lowercase"
  | "title"
  | "sentence"
  | "camel"
  | "snake"
  | "kebab";

const caseLabels: Record<CaseType, string> = {
  uppercase: "MAIÚSCULAS",
  lowercase: "minúsculas",
  title: "Título",
  sentence: "Frase",
  camel: "camelCase",
  snake: "snake_case",
  kebab: "kebab-case",
};

function toTitleCase(text: string): string {
  return text.replace(
    /\w\S*/g,
    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  );
}

function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}

function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toCamelCase(text: string): string {
  const words = toWords(text);
  return words
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join("");
}

function toSnakeCase(text: string): string {
  return toWords(text).map((w) => w.toLowerCase()).join("_");
}

function toKebabCase(text: string): string {
  return toWords(text).map((w) => w.toLowerCase()).join("-");
}

function convertCase(text: string, caseType: CaseType): string {
  switch (caseType) {
    case "uppercase":
      return text.toUpperCase();
    case "lowercase":
      return text.toLowerCase();
    case "title":
      return toTitleCase(text);
    case "sentence":
      return toSentenceCase(text);
    case "camel":
      return toCamelCase(text);
    case "snake":
      return toSnakeCase(text);
    case "kebab":
      return toKebabCase(text);
  }
}

export function TextCaseConverterTool() {
  const [text, setText] = useState("");
  const [caseType, setCaseType] = useState<CaseType>("uppercase");
  const [copied, setCopied] = useState(false);

  const hasInput = text.trim().length > 0;
  const result = hasInput ? convertCase(text, caseType) : "";

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ToolPage
      title="Conversor de Texto"
      description="Transforme texto entre diferentes formatos de capitalização."
    >
      <FieldGroup label="Texto de entrada" htmlFor="text-input">
        <textarea
          id="text-input"
          className="flex min-h-[100px] w-full rounded-md border border-muted/30 bg-surface px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent resize-y"
          placeholder="Cole ou digite seu texto aqui..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </FieldGroup>

      <FieldGroup label="Formato de saída">
        <div className="flex flex-wrap gap-2">
          {(Object.entries(caseLabels) as [CaseType, string][]).map(
            ([key, label]) => (
              <Button
                key={key}
                variant={caseType === key ? "default" : "outline"}
                size="sm"
                onClick={() => setCaseType(key)}
              >
                {label}
              </Button>
            )
          )}
        </div>
      </FieldGroup>

      {hasInput ? (
        <ResultPanel title="Resultado">
          <pre className="whitespace-pre-wrap break-all text-sm text-foreground font-mono">
            {result}
          </pre>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="mr-1 h-3 w-3" />
              ) : (
                <Copy className="mr-1 h-3 w-3" />
              )}
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </div>
        </ResultPanel>
      ) : (
        <EmptyState
          icon={CaseSensitive}
          title="Aguardando texto"
          description="Digite ou cole um texto acima para transformar."
        />
      )}
    </ToolPage>
  );
}
