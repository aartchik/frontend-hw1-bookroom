import { useEffect, useRef } from "react";
import type { Book } from "../model";
interface Props {
  book: Book;
  onConfirm: () => void;
  onClose: () => void;
}
export function DeleteDialog({ book, onConfirm, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  return (
    <dialog ref={ref} onCancel={onClose} aria-labelledby="delete-title">
      <h2 id="delete-title">Убрать книгу с полки?</h2>
      <p>«{book.title}» и ваша заметка будут удалены.</p>
      <div className="dialog-actions">
        <button className="secondary" onClick={onClose} autoFocus>
          Оставить
        </button>
        <button className="delete-button" onClick={onConfirm}>
          Удалить книгу
        </button>
      </div>
    </dialog>
  );
}
