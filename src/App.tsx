import { useState } from "react";
import { BookCard } from "./components/BookCard";
import { BookForm } from "./components/BookForm";
import { DeleteDialog } from "./components/DeleteDialog";
import { useBooks } from "./hooks/useBooks";
import { statuses } from "./model";
import type { Book, BookDraft, Status } from "./model";
type Filter = "all" | Status;
export default function App() {
  const { books, setBooks, error } = useBooks();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [form, setForm] = useState<{ book: Book | null } | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [message, setMessage] = useState("");
  const counts = {
    all: books.length,
    planned: books.filter((b) => b.status === "planned").length,
    reading: books.filter((b) => b.status === "reading").length,
    finished: books.filter((b) => b.status === "finished").length,
  };
  const normalized = query.trim().toLocaleLowerCase("ru");
  const visible = books.filter(
    (b) =>
      (filter === "all" || b.status === filter) &&
      `${b.title} ${b.author} ${b.genre}`
        .toLocaleLowerCase("ru")
        .includes(normalized),
  );
  if (sort === "title")
    visible.sort((a, b) => a.title.localeCompare(b.title, "ru"));
  function save(draft: BookDraft) {
    const editing = form?.book;
    setBooks((previous) =>
      editing
        ? previous.map((b) => (b.id === editing.id ? { ...b, ...draft } : b))
        : [
            {
              ...draft,
              id: crypto.randomUUID(),
            },
            ...previous,
          ],
    );
    if (!editing) {
      setFilter("all");
      setQuery("");
    }
    setMessage(editing ? "Изменения сохранены" : "Книга добавлена на полку");
    setForm(null);
  }
  const nav = [
    { key: "all", label: "Все книги" },
    { key: "reading", label: statuses.reading },
    { key: "planned", label: statuses.planned },
    { key: "finished", label: statuses.finished },
  ] as const;
  return (
    <main>
      <header className="page-heading">
        <div>
          <h1>Моя библиотека</h1>
          <p>Список книг и заметки о чтении.</p>
        </div>
        <button className="primary" onClick={() => setForm({ book: null })}>
          Добавить книгу
        </button>
      </header>
      <nav aria-label="Статусы книг">
        {nav.map(({ key, label }) => (
          <button
            key={key}
            className={filter === key ? "active" : ""}
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </nav>
      <div className="toolbar">
        <label className="search">
          Поиск
          <input
            aria-label="Поиск книг"
            placeholder="Название, автор или жанр"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Сортировка
          <select
            aria-label="Сортировка"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Сначала новые</option>
            <option value="title">По названию</option>
          </select>
        </label>
      </div>
      {error && (
        <p className="storage-error" role="alert">
          {error}
        </p>
      )}
      <p className="announcement" role="status">
        {message}
      </p>
      <section aria-label="Список книг">
        <h2>
          {filter === "all" ? "Все книги" : statuses[filter]}: {visible.length}
        </h2>
        {visible.length ? (
          <div className="book-list">
            {visible.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={(book) => setForm({ book })}
                onDelete={setDeleting}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>
              {books.length === 0
                ? "В библиотеке пока нет книг"
                : "Книги не найдены"}
            </h2>
            <p>
              {books.length === 0
                ? "Добавьте свою первую книгу."
                : "Попробуйте другой запрос или сбросьте фильтры."}
            </p>
            <button
              onClick={() => {
                if (books.length === 0) setForm({ book: null });
                else {
                  setQuery("");
                  setFilter("all");
                }
              }}
            >
              {books.length === 0
                ? "Добавить первую книгу"
                : "Сбросить поиск и фильтры"}
            </button>
          </div>
        )}
      </section>
      {form && (
        <BookForm
          book={form.book}
          onSave={save}
          onClose={() => setForm(null)}
        />
      )}
      {deleting && (
        <DeleteDialog
          book={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            setBooks((previous) =>
              previous.filter((b) => b.id !== deleting.id),
            );
            setDeleting(null);
            setMessage("Книга удалена");
          }}
        />
      )}
    </main>
  );
}
