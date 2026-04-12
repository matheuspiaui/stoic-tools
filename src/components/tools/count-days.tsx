import { useState } from "react";
import { ToolPage } from "@/components/tool-page";
import { FieldGroup } from "@/components/field-group";
import { ResultPanel } from "@/components/result-panel";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

const QUICK_DAYS = [7, 10, 15, 30, 60, 90] as const;

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86_400_000;
  const dateA = new Date(a + "T00:00:00");
  const dateB = new Date(b + "T00:00:00");
  return Math.round(Math.abs(dateB.getTime() - dateA.getTime()) / msPerDay);
}

export function CountDaysTool() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeStart, setIncludeStart] = useState(false);
  const [includeEnd, setIncludeEnd] = useState(false);

  const hasResult = startDate !== "" && endDate !== "";

  let totalDays = 0;
  if (hasResult) {
    totalDays = daysBetween(startDate, endDate);
    if (includeStart) totalDays += 1;
    if (includeEnd) totalDays += 1;
  }

  function handleQuickAdd(days: number) {
    if (!startDate) return;
    setEndDate(addDays(startDate, days));
  }

  // Determine which date is earlier for display
  const earlier =
    hasResult && startDate <= endDate ? startDate : endDate;
  const later =
    hasResult && startDate <= endDate ? endDate : startDate;
  const isStartEarlier = hasResult && startDate <= endDate;

  return (
    <ToolPage
      title="Contador de Dias"
      description="Calcule a quantidade de dias entre duas datas."
    >
      <FieldGroup label="Data de início" htmlFor="start-date">
        <Input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </FieldGroup>

      <FieldGroup label="Data de fim" htmlFor="end-date">
        <Input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        {startDate && (
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_DAYS.map((d) => (
              <Button
                key={d}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd(d)}
              >
                +{d} dias
              </Button>
            ))}
          </div>
        )}
      </FieldGroup>

      <FieldGroup label="Incluir na contagem">
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={includeStart}
              onChange={(e) => setIncludeStart(e.target.checked)}
              className="h-4 w-4 rounded border-muted/30 accent-accent"
              aria-label="Contar data de início"
            />
            Data de início
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={includeEnd}
              onChange={(e) => setIncludeEnd(e.target.checked)}
              className="h-4 w-4 rounded border-muted/30 accent-accent"
              aria-label="Contar data de fim"
            />
            Data de fim
          </label>
        </div>
      </FieldGroup>

      {hasResult ? (
        <>
          <ResultPanel title="Resultado">
            <p className="text-2xl font-bold text-accent font-mono">
              {totalDays} {totalDays === 1 ? "dia" : "dias"}
            </p>
            <p className="mt-1 text-sm text-muted">
              De {formatDate(earlier)} até {formatDate(later)}
              {(includeStart || includeEnd) && (
                <span>
                  {" "}
                  (incluindo{" "}
                  {includeStart && includeEnd
                    ? "ambas as datas"
                    : includeStart
                      ? "data de início"
                      : "data de fim"}
                  )
                </span>
              )}
            </p>
          </ResultPanel>

          {/* Roadmap visualization */}
          <div
            data-testid="roadmap-visualization"
            className="rounded-xl border border-muted/20 bg-panel p-5"
          >
            <h3 className="mb-4 text-sm font-medium text-muted">Linha do tempo</h3>
            <div className="flex items-center gap-0">
              {/* Start marker */}
              <div className="flex flex-col items-center">
                <div
                  data-testid="roadmap-start-circle"
                  data-included={String(
                    isStartEarlier ? includeStart : includeEnd
                  )}
                  className={`h-5 w-5 rounded-full border-2 border-accent ${
                    (isStartEarlier ? includeStart : includeEnd)
                      ? "bg-accent"
                      : "bg-transparent"
                  }`}
                />
                <span className="mt-2 text-xs text-muted whitespace-nowrap">
                  {formatDate(earlier)}
                </span>
              </div>

              {/* Connecting line with day count */}
              <div className="relative flex-1 mx-2">
                <div className="h-0.5 w-full bg-accent/40" />
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium text-accent whitespace-nowrap">
                  {totalDays} {totalDays === 1 ? "dia" : "dias"}
                </span>
              </div>

              {/* End marker */}
              <div className="flex flex-col items-center">
                <div
                  data-testid="roadmap-end-circle"
                  data-included={String(
                    isStartEarlier ? includeEnd : includeStart
                  )}
                  className={`h-5 w-5 rounded-full border-2 border-accent ${
                    (isStartEarlier ? includeEnd : includeStart)
                      ? "bg-accent"
                      : "bg-transparent"
                  }`}
                />
                <span className="mt-2 text-xs text-muted whitespace-nowrap">
                  {formatDate(later)}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="Aguardando datas"
          description="Selecione as datas de início e fim para calcular."
        />
      )}
    </ToolPage>
  );
}
