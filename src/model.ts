export const statuses = {
  planned: "Хочу прочитать",
  reading: "Читаю",
  finished: "Прочитано",
} as const;
export type Status = keyof typeof statuses;
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: Status;
  note: string;
}
export type BookDraft = Omit<Book, "id">;
export function isBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null) return false;
  const b = value as Record<string, unknown>;
  return (
    ["id", "title", "author", "genre", "note"].every(
      (k) => typeof b[k] === "string",
    ) &&
    typeof b.status === "string" &&
    Object.hasOwn(statuses, b.status)
  );
}
export const initialBooks: Book[] = [
  {
    id: "1",
    title: "Маленький принц",
    author: "Антуан де Сент-Экзюпери",
    genre: "Проза",
    status: "finished",
    note: "Самого главного глазами не увидишь.",
  },
  {
    id: "2",
    title: "Норвежский лес",
    author: "Харуки Мураками",
    genre: "Роман",
    status: "reading",
    note: "Медленная история о памяти, взрослении и любви.",
  },
  {
    id: "3",
    title: "Вино из одуванчиков",
    author: "Рэй Брэдбери",
    genre: "Проза",
    status: "planned",
    note: "Оставить на тёплый летний вечер.",
  },
  {
    id: "4",
    title: "Цветы для Элджернона",
    author: "Дэниел Киз",
    genre: "Фантастика",
    status: "finished",
    note: "Книга, к которой хочется вернуться.",
  },
  {
    id: "5",
    title: "Тревожные люди",
    author: "Фредрик Бакман",
    genre: "Роман",
    status: "planned",
    note: "Немного человечности в большом городе.",
  },
  {
    id: "6",
    title: "Понедельник начинается в субботу",
    author: "Аркадий и Борис Стругацкие",
    genre: "Фантастика",
    status: "reading",
    note: "Для тех, кто всё ещё верит в волшебство.",
  },
];
