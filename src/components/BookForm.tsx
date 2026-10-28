import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { statuses } from "../model";
import type { Book, BookDraft, Status } from "../model";
interface Props {
  book: Book | null;
  onSave: (draft: BookDraft) => void;
  onClose: () => void;
}
export function BookForm({ book, onSave, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<BookDraft>(
    book ?? { title: "", author: "", genre: "", status: "planned", note: "" },
  );
  const [error, setError] = useState("");
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    titleInput.current?.focus();
    return () => el?.close();
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.author.trim()) {
      setError("Введите название книги и автора.");
      return;
    }
    onSave({
      ...draft,
      title: draft.title.trim(),
      author: draft.author.trim(),
      genre: draft.genre.trim(),
      note: draft.note.trim(),
    });
  }
  return (
    <dialog ref={dialog} onCancel={onClose} aria-labelledby="form-title">
      <form onSubmit={submit}>
        <div className="dialog-heading">
          <div>
            <h2 id="form-title">
              {book ? "Редактировать книгу" : "Добавить книгу"}
            </h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Закрыть"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
        <label>
          Название книги <span>*</span>
          <input
            ref={titleInput}
            autoFocus
            value={draft.title}
            maxLength={120}
            required
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Например, Маленький принц"
          />
        </label>
        <label>
          Автор <span>*</span>
          <input
            value={draft.author}
            maxLength={120}
            required
            onChange={(e) => setDraft({ ...draft, author: e.target.value })}
            placeholder="Имя автора"
          />
        </label>
        <div className="form-row">
          <label>
            Жанр
            <input
              value={draft.genre}
              maxLength={50}
              onChange={(e) => setDraft({ ...draft, genre: e.target.value })}
              placeholder="Например, роман"
            />
          </label>
          <label>
            Статус
            <select
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as Status })
              }
            >
              {Object.entries(statuses).map(([key, text]) => (
                <option key={key} value={key}>
                  {text}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Заметка
          <textarea
            rows={3}
            maxLength={500}
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
            placeholder="Заметка о книге"
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <div className="dialog-actions">
          <button type="button" className="secondary" onClick={onClose}>
            Отмена
          </button>
          <button className="primary" type="submit">
            {book ? "Сохранить изменения" : "Добавить на полку"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
