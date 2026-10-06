import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const password = process.env.DEMO_PASSWORD;
if (!password)
  throw new Error("Defina DEMO_PASSWORD com a senha do usuário demo.");
const output = new URL("../../../docs/screenshots/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  await page.goto("http://127.0.0.1:5173");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: fileURLToPath(new URL("login.png", output)),
    fullPage: true,
  });
  await page.getByLabel("Usuário").fill("demo");
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Entrar na minha conta" }).click();
  await page.getByRole("heading", { name: "Rotina & bem-estar" }).waitFor();
  await page.screenshot({
    path: fileURLToPath(new URL("dashboard.png", output)),
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: fileURLToPath(new URL("mobile.png", output)),
    fullPage: true,
  });
} finally {
  await browser.close();
}
