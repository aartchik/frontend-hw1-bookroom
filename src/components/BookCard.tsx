import { statuses } from "../model";
import type { Book } from "../model";
interface Props {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}
export function BookCard({ book, onEdit, onDelete }: Props) {
  return (
    <article className="book-card">
      <div className="card-body">
        <span className={`badge ${book.status}`}>{statuses[book.status]}</span>
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <p className="note">{book.note || "Без заметки"}</p>
        <div className="card-footer">
          <span>{book.genre || "Без жанра"}</span>
          <div>
            <button
              className="icon-button"
              aria-label={`Редактировать «${book.title}»`}
              onClick={() => onEdit(book)}
            >
              Редактировать
            </button>
            <button
              className="icon-button danger"
              aria-label={`Удалить «${book.title}»`}
              onClick={() => onDelete(book)}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
