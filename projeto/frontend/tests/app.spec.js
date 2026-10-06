import { test, expect } from "@playwright/test";

test("login, CRUD, filtros e logout", async ({ page }) => {
  let lists = [];
  await page.route("http://127.0.0.1:8000/**", async (route) => {
    const request = route.request(),
      path = new URL(request.url()).pathname;
    let data = request.postDataJSON(),
      status = 200,
      response;
    if (path === "/api-token-auth/") response = { token: "test-token" };
    else if (path === "/list/" && request.method() === "POST") {
      lists.push({ id: 1, name: data.name, item_set: [] });
      status = 201;
      response = lists[0];
    } else if (path === "/item/" && request.method() === "POST") {
      const item = { id: 1, ...data, done: false };
      lists[0].item_set.push(item);
      response = item;
      status = 201;
    } else if (path === "/item/1/" && request.method() === "PATCH") {
      Object.assign(lists[0].item_set[0], data);
      response = lists[0].item_set[0];
    } else if (request.method() === "DELETE") {
      if (path === "/list/1/") lists = [];
      else lists[0].item_set = [];
      status = 204;
    } else response = lists;
    await route.fulfill({
      status,
      contentType: "application/json",
      body: status === 204 ? "" : JSON.stringify(response),
    });
  });
  await page.goto("/");
  await page.getByLabel("Usuário").fill("ana");
  await page.getByLabel("Senha", { exact: true }).fill("senha");
  await page.getByRole("button", { name: "Entrar na minha conta" }).click();
  await expect(page.getByText("Um novo começo.")).toBeVisible();
  await page.getByLabel("Nome da nova lista").fill("Estudos");
  await page.getByRole("button", { name: "Adicionar", exact: true }).click();
  await page.getByLabel("Nova tarefa em Estudos").fill("Praticar React");
  await page
    .locator(".list-card")
    .getByRole("button", { name: "Adicionar" })
    .click();
  await page.getByRole("checkbox", { name: "Praticar React" }).click();
  await expect(
    page.getByRole("checkbox", { name: "Praticar React" }),
  ).toBeChecked();
  await expect(page.getByText("1 de 1 concluídas")).toBeVisible();
  await page.getByRole("button", { name: "Pendentes", exact: true }).click();
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  await page.getByRole("button", { name: "Concluídas", exact: true }).click();
  await page
    .getByRole("button", { name: "Excluir tarefa Praticar React" })
    .click();
  await expect(page.getByText("0 de 0 concluídas")).toBeVisible();
  page.on("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Excluir lista Estudos" }).click();
  await expect(page.getByText("Um novo começo.")).toBeVisible();
  await page.getByRole("button", { name: "Sair da conta" }).click();
  await expect(
    page.getByRole("heading", { name: "Vamos começar?" }),
  ).toBeVisible();
});

test("falha de autenticação mantêm formulário e mostra erro", async ({
  page,
}) => {
  await page.route("**/api-token-auth/", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ non_field_errors: ["Credenciais inválidas."] }),
    }),
  );
  await page.goto("/");
  await page.getByLabel("Usuário").fill("ana");
  await page.getByLabel("Senha", { exact: true }).fill("errada");
  await page.getByRole("button", { name: "Entrar na minha conta" }).click();
  await expect(page.getByRole("alert")).toHaveText("Credenciais inválidas.");
  await expect(
    page.getByRole("button", { name: "Entrar na minha conta" }),
  ).toBeEnabled();
});
