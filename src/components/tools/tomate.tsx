import { useState, useEffect, useRef, useCallback } from "react";
import { ToolPage } from "@/components/tool-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MIN_MINUTES = 5;
const MAX_MINUTES = 60;
const STEP_MINUTES = 5;
const DEFAULT_MINUTES = 25;

type Mode = "pomodoro" | "break";
type TimerStatus = "idle" | "running" | "paused" | "finished";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ProgressRing({
  progress,
  size = 240,
  strokeWidth = 8,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg
      data-testid="progress-ring"
      width={size}
      height={size}
      className="mx-auto -rotate-90"
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-muted/20"
        strokeWidth={strokeWidth}
      />
      <circle
        data-testid="progress-ring-circle"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-accent transition-[stroke-dashoffset] duration-1000 ease-linear"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TomateTool() {
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_MINUTES * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_MINUTES * 60);
  const [showCustomBreak, setShowCustomBreak] = useState(false);
  const [customBreakMinutes, setCustomBreakMinutes] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const finishTimer = useCallback(() => {
    clearTimer();
    setRemainingSeconds(0);
    setStatus("finished");
    audioRef.current?.play().catch(() => {});
  }, [clearTimer]);

  const startInterval = useCallback(() => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          finishTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, finishTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // Test hook: force-finish
  useEffect(() => {
    function handleForceFinish() {
      finishTimer();
    }
    window.addEventListener("__test_force_finish", handleForceFinish);
    return () =>
      window.removeEventListener("__test_force_finish", handleForceFinish);
  }, [finishTimer]);

  // Create audio element
  useEffect(() => {
    audioRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczGEF0rN3VjEQcJlqQwtPFdC4QLk2Bs87MhkMcGkl6r8zKgUYiHUV2rMfGfkgoIkR0q8XEe0ssJ0VzqsLBd04yLklxqL++cVA5NEhvpry6alQ/OkpsorgAAA=="
    );
    return () => {
      audioRef.current = null;
    };
  }, []);

  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const label = mode === "break" ? "Pausa" : "Pomodoro";

  function handleAdjust(delta: number) {
    const currentTotal = totalSeconds / 60;
    const newTotal = Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, currentTotal + delta));
    const newTotalSeconds = newTotal * 60;

    if (status === "running" || status === "paused") {
      const diff = (newTotal - currentTotal) * 60;
      setRemainingSeconds((prev) => Math.max(0, prev + diff));
      setTotalSeconds(newTotalSeconds);
    } else {
      setTotalSeconds(newTotalSeconds);
      setRemainingSeconds(newTotalSeconds);
    }
  }

  function handleStart() {
    setStatus("running");
    startInterval();
  }

  function handlePause() {
    clearTimer();
    setStatus("paused");
  }

  function handleResume() {
    setStatus("running");
    startInterval();
  }

  function handleReset() {
    clearTimer();
    setShowCustomBreak(false);
    setCustomBreakMinutes("");
    setMode("pomodoro");
    setStatus("idle");
    setTotalSeconds(DEFAULT_MINUTES * 60);
    setRemainingSeconds(DEFAULT_MINUTES * 60);
  }

  function handleStartBreak(minutes: number) {
    clearTimer();
    setShowCustomBreak(false);
    setCustomBreakMinutes("");
    const breakSeconds = minutes * 60;
    setMode("break");
    setTotalSeconds(breakSeconds);
    setRemainingSeconds(breakSeconds);
    setStatus("running");
    // Need to start interval after state updates
    setTimeout(() => startInterval(), 0);
  }

  function handleConfirmCustomBreak() {
    const mins = parseInt(customBreakMinutes, 10);
    if (mins > 0) {
      handleStartBreak(mins);
    }
  }

  const canDecrease = totalSeconds / 60 > MIN_MINUTES;
  const canIncrease = totalSeconds / 60 < MAX_MINUTES;
  const showAdjustButtons =
    mode === "pomodoro" &&
    (status === "idle" || status === "running" || status === "paused");

  return (
    <ToolPage
      title="Tomate Timer"
      description="Controle o tempo de suas tarefas com foco usando a técnica Pomodoro."
    >
      {status === "finished" ? (
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="relative">
            <ProgressRing progress={0} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                data-testid="timer-display"
                className="text-4xl font-bold text-accent font-mono"
              >
                00:00
              </span>
            </div>
          </div>

          <p className="text-lg font-medium text-accent">Tempo concluído</p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={handleReset}>Reiniciar Pomodoro</Button>
            <Button variant="outline" onClick={() => handleStartBreak(3)}>
              Pausa 3 min
            </Button>
            <Button variant="outline" onClick={() => handleStartBreak(15)}>
              Pausa 15 min
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCustomBreak(!showCustomBreak)}
            >
              Pausa personalizada
            </Button>
          </div>

          {showCustomBreak && (
            <div className="flex items-center gap-3">
              <Input
                data-testid="custom-break-input"
                type="number"
                min={1}
                placeholder="Minutos"
                value={customBreakMinutes}
                onChange={(e) => setCustomBreakMinutes(e.target.value)}
                className="w-24 text-center"
              />
              <Button size="sm" onClick={handleConfirmCustomBreak}>
                Confirmar
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 py-4">
          <span className="text-sm text-muted">{label}</span>

          <div className="relative">
            <ProgressRing progress={progress} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span
                data-testid="timer-display"
                className="text-4xl font-bold text-accent font-mono"
              >
                {formatTime(remainingSeconds)}
              </span>

              {showAdjustButtons && (
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!canDecrease}
                    onClick={() => handleAdjust(-STEP_MINUTES)}
                  >
                    -5 min
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!canIncrease}
                    onClick={() => handleAdjust(STEP_MINUTES)}
                  >
                    +5 min
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {status === "idle" && (
              <Button onClick={handleStart}>Iniciar</Button>
            )}
            {status === "running" && (
              <Button onClick={handlePause}>Pausar</Button>
            )}
            {status === "paused" && (
              <Button onClick={handleResume}>Continuar</Button>
            )}
            <Button variant="outline" onClick={handleReset}>
              Reiniciar
            </Button>
          </div>
        </div>
      )}
    </ToolPage>
  );
}
