import { useEffect, useState } from "react";
import { initialBooks, isBook } from "../model";
import type { Book } from "../model";
export const STORAGE_KEY = "between-lines.books.v1";
function readBooks(): { books: Book[]; error: string; writable: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { books: initialBooks, error: "", writable: true };
    const parsed: unknown = JSON.parse(raw);
    if (
      !Array.isArray(parsed) ||
      !parsed.every(isBook) ||
      new Set(parsed.map((b) => b.id)).size !== parsed.length
    )
      throw new Error("Invalid data");
    return { books: parsed, error: "", writable: true };
  } catch {
    return {
      books: [],
      error:
        "Не удалось прочитать сохранённую полку. Исходные данные не перезаписаны. Попробуйте открыть приложение в обычном режиме браузера или восстановить хранилище.",
      writable: false,
    };
  }
}
export function useBooks() {
  const [initial] = useState(readBooks);
  const [books, setBooks] = useState(initial.books);
  const [error, setError] = useState(initial.error);
  useEffect(() => {
    if (!initial.writable) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      setError("");
    } catch {
      setError(
        "Изменения видны в этом окне, но браузер не смог их сохранить. Не закрывайте страницу: проверьте доступность и свободное место хранилища.",
      );
    }
  }, [books, initial.writable]);
  return { books, setBooks, error };
}
