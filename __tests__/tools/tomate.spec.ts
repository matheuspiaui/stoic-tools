import { test, expect } from "@playwright/test";

const PATH = "/tools/tomate";

test.describe("Tomate Timer — estado idle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("exibe label 'Pomodoro' no estado idle", async ({ page }) => {
    await expect(page.getByText("Pomodoro", { exact: true })).toBeVisible();
  });

  test("exibe timer com valor inicial 25:00", async ({ page }) => {
    await expect(page.getByTestId("timer-display")).toHaveText("25:00");
  });

  test("exibe progress bar circular", async ({ page }) => {
    await expect(page.getByTestId("progress-ring")).toBeVisible();
  });

  test("exibe botao Iniciar", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Iniciar", exact: true })
    ).toBeVisible();
  });

  test("exibe botao Reiniciar", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Reiniciar", exact: true })
    ).toBeVisible();
  });

  test("exibe botoes -5 min e +5 min", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "-5 min" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "+5 min" })
    ).toBeVisible();
  });
});

test.describe("Tomate Timer — ajuste de tempo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("incrementa tempo em 5 min ao clicar +5 min", async ({ page }) => {
    await page.getByRole("button", { name: "+5 min" }).click();
    await expect(page.getByTestId("timer-display")).toHaveText("30:00");
  });

  test("decrementa tempo em 5 min ao clicar -5 min", async ({ page }) => {
    await page.getByRole("button", { name: "-5 min" }).click();
    await expect(page.getByTestId("timer-display")).toHaveText("20:00");
  });

  test("nao permite tempo menor que 5 min", async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await page.getByRole("button", { name: "-5 min" }).click();
    }
    await expect(page.getByTestId("timer-display")).toHaveText("05:00");
    await expect(
      page.getByRole("button", { name: "-5 min" })
    ).toBeDisabled();
  });

  test("nao permite tempo maior que 60 min", async ({ page }) => {
    for (let i = 0; i < 7; i++) {
      await page.getByRole("button", { name: "+5 min" }).click();
    }
    await expect(page.getByTestId("timer-display")).toHaveText("60:00");
    await expect(
      page.getByRole("button", { name: "+5 min" })
    ).toBeDisabled();
  });
});

test.describe("Tomate Timer — estado running", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("botao muda para Pausar ao iniciar", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Pausar", exact: true })
    ).toBeVisible();
  });

  test("timer decrementa durante execucao", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await page.waitForTimeout(1500);
    const text = await page.getByTestId("timer-display").textContent();
    expect(text).not.toBe("25:00");
  });

  test("botao Reiniciar permanece visivel durante execucao", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Reiniciar", exact: true })
    ).toBeVisible();
  });

  test("botoes +5/-5 funcionam durante execucao", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await page.getByRole("button", { name: "+5 min" }).click();
    const text = await page.getByTestId("timer-display").textContent();
    expect(text).toBeTruthy();
    const [min] = text!.split(":").map(Number);
    expect(min).toBeGreaterThanOrEqual(29);
  });
});

test.describe("Tomate Timer — estado pausado", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("botao muda para Continuar ao pausar", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await page.getByRole("button", { name: "Pausar", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Continuar" })
    ).toBeVisible();
  });

  test("timer congela quando pausado", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Pausar", exact: true }).click();
    const frozenText = await page.getByTestId("timer-display").textContent();
    await page.waitForTimeout(1500);
    const afterText = await page.getByTestId("timer-display").textContent();
    expect(frozenText).toBe(afterText);
  });

  test("timer retoma ao clicar Continuar", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Pausar", exact: true }).click();
    const frozenText = await page.getByTestId("timer-display").textContent();
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.waitForTimeout(1500);
    const afterText = await page.getByTestId("timer-display").textContent();
    expect(frozenText).not.toBe(afterText);
  });
});

test.describe("Tomate Timer — reiniciar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("Reiniciar volta ao estado idle com tempo padrao", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Reiniciar", exact: true }).click();
    await expect(page.getByTestId("timer-display")).toHaveText("25:00");
    await expect(
      page.getByRole("button", { name: "Iniciar", exact: true })
    ).toBeVisible();
  });
});

test.describe("Tomate Timer — timer finalizado", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("exibe mensagem e opcoes de pausa ao finalizar", async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("__test_force_finish"));
    });

    await expect(page.getByText("Tempo concluído")).toBeVisible({ timeout: 3000 });
    await expect(
      page.getByRole("button", { name: "Reiniciar Pomodoro" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Pausa 3 min" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Pausa 15 min" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Pausa personalizada" })
    ).toBeVisible();
  });

  test("Reiniciar Pomodoro volta ao estado idle", async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("__test_force_finish"));
    });

    await expect(page.getByText("Tempo concluído")).toBeVisible({ timeout: 3000 });
    await page
      .getByRole("button", { name: "Reiniciar Pomodoro" })
      .click();
    await expect(page.getByTestId("timer-display")).toHaveText("25:00");
    await expect(
      page.getByRole("button", { name: "Iniciar", exact: true })
    ).toBeVisible();
  });

  test("Pausa 3 min inicia break de 3 minutos", async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("__test_force_finish"));
    });

    await expect(page.getByText("Tempo concluído")).toBeVisible({ timeout: 3000 });
    await page.getByRole("button", { name: "Pausa 3 min" }).click();
    await expect(page.getByText("Pausa", { exact: true })).toBeVisible();
    await expect(page.getByTestId("timer-display")).toHaveText("03:00");
  });

  test("Pausa 15 min inicia break de 15 minutos", async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("__test_force_finish"));
    });

    await expect(page.getByText("Tempo concluído")).toBeVisible({ timeout: 3000 });
    await page.getByRole("button", { name: "Pausa 15 min" }).click();
    await expect(page.getByText("Pausa", { exact: true })).toBeVisible();
    await expect(page.getByTestId("timer-display")).toHaveText("15:00");
  });
});

test.describe("Tomate Timer — pausa personalizada", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("abre input numerico ao clicar Pausa personalizada", async ({
    page,
  }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("__test_force_finish"));
    });

    await expect(page.getByText("Tempo concluído")).toBeVisible({ timeout: 3000 });
    await page
      .getByRole("button", { name: "Pausa personalizada" })
      .click();
    await expect(page.getByTestId("custom-break-input")).toBeVisible();
  });

  test("inicia break com tempo personalizado", async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("__test_force_finish"));
    });

    await expect(page.getByText("Tempo concluído")).toBeVisible({ timeout: 3000 });
    await page
      .getByRole("button", { name: "Pausa personalizada" })
      .click();
    await page.getByTestId("custom-break-input").fill("10");
    await page.getByRole("button", { name: "Confirmar" }).click();
    await expect(page.getByText("Pausa", { exact: true })).toBeVisible();
    await expect(page.getByTestId("timer-display")).toHaveText("10:00");
  });
});

test.describe("Tomate Timer — estado break", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("exibe label Pausa durante break", async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("__test_force_finish"));
    });
    await expect(page.getByText("Tempo concluído")).toBeVisible({ timeout: 3000 });
    await page.getByRole("button", { name: "Pausa 3 min" }).click();
    await expect(page.getByText("Pausa", { exact: true })).toBeVisible();
  });

  test("progress bar reinicia em 100% no break", async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("__test_force_finish"));
    });
    await expect(page.getByText("Tempo concluído")).toBeVisible({ timeout: 3000 });
    await page.getByRole("button", { name: "Pausa 3 min" }).click();
    // Wait for break to start and check immediately
    await expect(page.getByText("Pausa", { exact: true })).toBeVisible();
    const ring = page.getByTestId("progress-ring-circle");
    const dashoffset = await ring.getAttribute("stroke-dashoffset");
    // At 100% (or very close), offset should be 0 or very small
    expect(Number(dashoffset)).toBeLessThan(10);
  });

  test("botoes Pausar e Reiniciar visiveis durante break", async ({
    page,
  }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("__test_force_finish"));
    });
    await expect(page.getByText("Tempo concluído")).toBeVisible({ timeout: 3000 });
    await page.getByRole("button", { name: "Pausa 3 min" }).click();
    await expect(
      page.getByRole("button", { name: "Pausar", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Reiniciar", exact: true })
    ).toBeVisible();
  });
});

test.describe("Tomate Timer — botao editar (menu rapido)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("exibe botao de editar com icone de lapis durante execucao", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await expect(page.getByTestId("edit-button")).toBeVisible();
  });

  test("botao editar abre menu com opcoes de pausa", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await page.getByTestId("edit-button").click();
    const menu = page.getByTestId("edit-menu");
    await expect(
      menu.getByRole("button", { name: "Reiniciar", exact: true })
    ).toBeVisible();
    await expect(
      menu.getByRole("button", { name: "Pausa 3 min" })
    ).toBeVisible();
    await expect(
      menu.getByRole("button", { name: "Pausa 15 min" })
    ).toBeVisible();
    await expect(
      menu.getByRole("button", { name: "Pausa personalizada" })
    ).toBeVisible();
  });

  test("botao editar fecha menu ao clicar novamente", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await page.getByTestId("edit-button").click();
    await expect(
      page.getByRole("button", { name: "Pausa 3 min" })
    ).toBeVisible();
    await page.getByTestId("edit-button").click();
    await expect(
      page.getByRole("button", { name: "Pausa 3 min" })
    ).not.toBeVisible();
  });

  test("Reiniciar no menu editar volta ao estado idle", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await page.getByTestId("edit-button").click();
    await page.getByTestId("edit-menu").getByRole("button", { name: "Reiniciar", exact: true }).click();
    await expect(page.getByTestId("timer-display")).toHaveText("25:00");
    await expect(
      page.getByRole("button", { name: "Iniciar", exact: true })
    ).toBeVisible();
  });

  test("Pausa 3 min no menu editar inicia break", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await page.getByTestId("edit-button").click();
    await page.getByRole("button", { name: "Pausa 3 min" }).click();
    await expect(page.getByText("Pausa", { exact: true })).toBeVisible();
    await expect(page.getByTestId("timer-display")).toHaveText("03:00");
  });

  test("botao editar visivel durante pausa", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await page.getByRole("button", { name: "Pausar", exact: true }).click();
    await expect(page.getByTestId("edit-button")).toBeVisible();
  });

  test("botao editar nao visivel no estado idle", async ({ page }) => {
    await expect(page.getByTestId("edit-button")).not.toBeVisible();
  });
});

test.describe("Tomate Timer — push notification", () => {
  test("tenta enviar push notification ao finalizar timer", async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");

    // Mock Notification para capturar chamadas sem depender de permissão real
    await page.evaluate(() => {
      (window as any).__notificationArgs = null;
      (window as any).Notification = class {
        constructor(title: string, options?: NotificationOptions) {
          (window as any).__notificationArgs = { title, body: options?.body };
        }
        static permission = "granted";
        static requestPermission() {
          return Promise.resolve("granted" as NotificationPermission);
        }
      };
    });

    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("__test_force_finish"));
    });

    await expect(page.getByText("Tempo concluído")).toBeVisible({ timeout: 3000 });
    const args = await page.evaluate(() => (window as any).__notificationArgs);
    expect(args).not.toBeNull();
    expect(args.title).toBe("Tomate Timer");
    expect(args.body).toBe("Tempo concluído!");
  });
});

test.describe("Tomate Timer — mobile layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("progress bar circular nao ultrapassa viewport", async ({ page }) => {
    const viewport = page.viewportSize();
    if (!viewport) return;

    const ring = page.getByTestId("progress-ring");
    const box = await ring.boundingBox();

    if (box) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    }
  });

  test("botoes de controle estao visiveis na tela", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Iniciar", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "-5 min" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "+5 min" })
    ).toBeVisible();
  });
});
