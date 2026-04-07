import { useState } from "react";
import { ToolPage } from "@/components/tool-page";
import { FieldGroup } from "@/components/field-group";
import { ResultPanel } from "@/components/result-panel";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRightLeft, Ruler } from "lucide-react";

type UnitCategory = "length" | "weight" | "temperature";

interface UnitDef {
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const units: Record<UnitCategory, Record<string, UnitDef>> = {
  length: {
    m: { label: "Metros", toBase: (v) => v, fromBase: (v) => v },
    km: { label: "Quilômetros", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    cm: { label: "Centímetros", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    ft: { label: "Pés", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    in: { label: "Polegadas", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    mi: { label: "Milhas", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  },
  weight: {
    kg: { label: "Quilogramas", toBase: (v) => v, fromBase: (v) => v },
    g: { label: "Gramas", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    lb: { label: "Libras", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    oz: { label: "Onças", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
  },
  temperature: {
    c: { label: "Celsius", toBase: (v) => v, fromBase: (v) => v },
    f: { label: "Fahrenheit", toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
    k: { label: "Kelvin", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
};

const categoryLabels: Record<UnitCategory, string> = {
  length: "Comprimento",
  weight: "Peso",
  temperature: "Temperatura",
};

export function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [value, setValue] = useState("");

  const categoryUnits = units[category];
  const numValue = parseFloat(value);
  const hasResult = value !== "" && !isNaN(numValue);

  let result: number | null = null;
  if (hasResult) {
    const base = categoryUnits[fromUnit].toBase(numValue);
    result = categoryUnits[toUnit].fromBase(base);
  }

  function handleCategoryChange(cat: string) {
    setCategory(cat as UnitCategory);
    const keys = Object.keys(units[cat as UnitCategory]);
    setFromUnit(keys[0]);
    setToUnit(keys[1] ?? keys[0]);
    setValue("");
  }

  function handleSwap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  return (
    <ToolPage
      title="Conversor de Unidades"
      description="Converta valores entre diferentes unidades de medida."
    >
      <FieldGroup label="Categoria">
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger aria-label="Categoria">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldGroup>

      <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-3">
        <FieldGroup label="De">
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger aria-label="Unidade de origem">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryUnits).map(([key, def]) => (
                <SelectItem key={key} value={key}>
                  {def.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldGroup>

        <Button variant="ghost" size="icon" onClick={handleSwap} title="Trocar">
          <ArrowRightLeft className="h-4 w-4" />
        </Button>

        <FieldGroup label="Para">
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger aria-label="Unidade de destino">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryUnits).map(([key, def]) => (
                <SelectItem key={key} value={key}>
                  {def.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldGroup>
      </div>

      <FieldGroup label="Valor" htmlFor="unit-value">
        <Input
          id="unit-value"
          type="number"
          placeholder="Digite o valor..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </FieldGroup>

      {hasResult && result !== null ? (
        <ResultPanel title="Resultado">
          <p className="text-2xl font-bold text-accent font-mono">
            {result.toLocaleString("pt-BR", { maximumFractionDigits: 6 })}
          </p>
          <p className="mt-1 text-sm text-muted">
            {numValue} {categoryUnits[fromUnit].label} = {result.toLocaleString("pt-BR", { maximumFractionDigits: 6 })}{" "}
            {categoryUnits[toUnit].label}
          </p>
        </ResultPanel>
      ) : (
        <EmptyState
          icon={Ruler}
          title="Aguardando valor"
          description="Digite um número acima para ver a conversão."
        />
      )}
    </ToolPage>
  );
}
