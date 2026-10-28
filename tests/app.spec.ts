import { test, expect } from "@playwright/test";
const storageKey = "between-lines.books.v1";
test("просмотр, добавление, редактирование, поиск, фильтр, сохранение и удаление", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("article")).toHaveCount(6);
  await page.screenshot({ path: "docs/01-library.png", fullPage: true });
  await page
    .getByRole("button", { name: "Добавить книгу", exact: true })
    .click();
  await page.getByLabel("Название книги").fill("Чистая архитектура");
  await page.getByLabel(/^Автор/).fill("Роберт Мартин");
  await page.getByLabel("Жанр", { exact: true }).fill("Программирование");
  await page.getByRole("dialog").getByLabel(/^Статус/).selectOption("reading");
  await page
    .getByLabel("Заметка", { exact: true })
    .fill("Разобраться в границах компонентов и ответственности.");
  await page.screenshot({ path: "docs/02-add-book.png", fullPage: false });
  await page.getByRole("button", { name: "Добавить на полку" }).click();
  await expect(page.getByRole("article")).toHaveCount(7);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Чистая архитектура", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Редактировать «Чистая архитектура»" })
    .click();
  await expect(page.getByLabel("Название книги")).toHaveValue(
    "Чистая архитектура",
  );
  await page
    .getByLabel("Название книги")
    .fill("Чистая архитектура — прочитано");
  await page.getByRole("dialog").getByLabel(/^Статус/).selectOption("finished");
  await page.screenshot({ path: "docs/03-edit-book.png", fullPage: false });
  await page.getByRole("button", { name: "Сохранить изменения" }).click();
  await page.reload();
  await page.getByRole("textbox", { name: "Поиск книг" }).fill("мартин");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByRole("article")).toContainText("Прочитано");
  await page.screenshot({ path: "docs/04-search.png", fullPage: true });
  await page
    .getByRole("textbox", { name: "Поиск книг" })
    .fill("несуществующая книга");
  await expect(
    page.getByRole("heading", { name: "Книги не найдены" }),
  ).toBeVisible();
  await page.screenshot({ path: "docs/05-no-results.png", fullPage: true });
  await page.getByRole("button", { name: "Сбросить поиск и фильтры" }).click();
  await page.getByRole("button", { name: /^Читаю/ }).click();
  await expect(page.getByRole("article")).toHaveCount(2);
  await page.getByRole("button", { name: /^Все книги/ }).click();
  await page
    .getByRole("button", { name: "Удалить «Чистая архитектура — прочитано»" })
    .click();
  await page.screenshot({ path: "docs/06-delete-book.png", fullPage: false });
  await page.getByRole("button", { name: "Оставить", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(7);
  await page
    .getByRole("button", { name: "Удалить «Чистая архитектура — прочитано»" })
    .click();
  await page
    .getByRole("button", { name: "Удалить книгу", exact: true })
    .click();
  await page.reload();
  await expect(page.getByRole("article")).toHaveCount(6);
});
test("пустая библиотека сохраняется; можно добавить первую книгу", async ({
  page,
}) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, "[]");
  }, storageKey);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "В библиотеке пока нет книг" }),
  ).toBeVisible();
  await page.screenshot({ path: "docs/07-empty-library.png", fullPage: true });
  await page.getByRole("button", { name: "Добавить первую книгу" }).click();
  await page.getByLabel("Название книги").fill("   ");
  await page.getByLabel(/^Автор/).fill("Автор");
  await page.getByRole("button", { name: "Добавить на полку" }).click();
  await expect(page.getByRole("alert")).toContainText("Введите название");
  await page.getByLabel("Название книги").fill("Первая книга");
  await page.getByRole("button", { name: "Добавить на полку" }).click();
  await expect(page.getByRole("article")).toHaveCount(1);
});
test("повреждённые данные не перезаписываются", async ({ page }) => {
  await page.addInitScript(
    (key) => localStorage.setItem(key, "{broken"),
    storageKey,
  );
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText(
    "Исходные данные не перезаписаны",
  );
  expect(
    await page.evaluate((key) => localStorage.getItem(key), storageKey),
  ).toBe("{broken");
});
test("адаптивный интерфейс и клавиатура", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("article")).toHaveCount(6);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "docs/08-mobile.png", fullPage: true });
  await page
    .getByRole("button", { name: "Добавить книгу", exact: true })
    .click();
  await expect(page.getByLabel("Название книги")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
