import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Exercise the site without relying on an external photo service.
  await page.route("https://images.unsplash.com/**", (route) => route.abort());
  await page.goto("/");
});

test("sections render without JavaScript exceptions", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.reload();
  await expect(page).toHaveTitle(/VELORA/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "хочется жить",
  );
  for (const id of [
    "collections",
    "projects",
    "approach",
    "process",
    "faq",
    "contact",
  ]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await expect(page.locator(".hero-visual .photo-fallback")).toBeVisible();
  expect(errors).toEqual([]);
});

test("collections switch their descriptions and selected state", async ({
  page,
}) => {
  const natura = page.getByRole("button", { name: /NATURA/ });
  await natura.click();
  await expect(natura).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".collection-copy h3")).toHaveText("Тепло природы");
  await page.getByRole("button", { name: /FORMA/ }).click();
  await expect(page.locator(".collection-copy h3")).toHaveText(
    "Архитектура контраста",
  );
});

test("gallery filters and project dialog work with keyboard dismissal", async ({
  page,
}) => {
  await expect(page.locator(".project-card")).toHaveCount(4);
  await page.getByRole("button", { name: "Дерево", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  const card = page.getByRole("button", {
    name: "Открыть концепцию «Природа внутри»",
  });
  await card.click();
  await expect(
    page.getByRole("dialog", { name: "Природа внутри" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".project-dialog")).not.toBeVisible();
  await expect(card).toBeFocused();
  await page.getByRole("button", { name: "Все проекты", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(4);
});

test("FAQ expands and can be collapsed", async ({ page }) => {
  const item = page.locator("details").last();
  await item.locator("summary").click();
  await expect(item).toHaveAttribute("open", "");
  await expect(item.locator("p")).toBeVisible();
  await item.locator("summary").click();
  await expect(item).not.toHaveAttribute("open", "");
});

test("demo form validates fields and never sends or stores entered data", async ({
  page,
}) => {
  let sent = false;
  page.on("request", (request) => {
    if (
      request.method() === "POST" ||
      request.url().includes("demo@example.com") ||
      request.postData()?.includes("demo@example.com")
    )
      sent = true;
  });
  const submit = page.getByRole("button", { name: "Попробовать отправить" });
  await submit.click();
  await expect(page.getByRole("status")).toBeEmpty();
  await expect(page.locator("#name")).toBeFocused();
  await page.getByLabel("Как к вам обращаться").fill("Демо");
  await page.getByLabel("Электронная почта").fill("invalid");
  await submit.click();
  await expect(page.getByRole("status")).toBeEmpty();
  await page.getByLabel("Электронная почта").fill("demo@example.com");
  await submit.click();
  await expect(page.getByRole("status")).toBeEmpty();
  await page.getByRole("checkbox").check();
  await submit.click();
  await expect(page.getByRole("status")).toContainText(
    "Ничего не отправлено и не сохранено",
  );
  await expect(page.locator("#name")).toHaveValue("");
  await expect(page.locator("#email")).toHaveValue("");
  expect(sent).toBe(false);
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
});

test("mobile navigation traps focus, closes and navigates to its target", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const open = page.getByRole("button", { name: "Открыть меню" });
  await open.click();
  const menu = page.getByRole("dialog", { name: "Мобильное меню" });
  await expect(menu).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(
      await menu.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await menu.getByRole("link", { name: /Контакты/ }).click();
  await expect(menu).not.toBeVisible();
  await expect(page).toHaveURL(/#contact$/);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});

test("mobile menu closes when moving to desktop width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator("#mobile-menu")).not.toBeVisible();
});

test("layouts stay within the viewport from 320px to desktop", async ({
  page,
}) => {
  for (const width of [320, 390, 650, 768, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});
