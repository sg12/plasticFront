import styles from "./ControlModal.module.scss";
import { useState, useRef, useEffect } from "react";

const ControlModal = ({ onDelete, onEdit, onSave }) => {
  const [isOpen, setIsOpen] = useState(true);
  const modalRef = useRef();

  useEffect(() => {
    // Добавим задержку для обработчика событий
    const timerId = setTimeout(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, 100);

    return () => clearTimeout(timerId);
  }, []); // Зависимость пуста, чтобы useEffect сработал только один раз

  useEffect(() => {
    // Вы можете добавить дополнительные логики при изменении состояния isOpen
    if (!isOpen) {
      // Дополнительные действия при закрытии модального окна
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className={styles.modalBackdrop}>
          <div ref={modalRef} className={styles.modalContent}>
            <span
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              &times;
            </span>
            <h2>Модальное окно управления</h2>
            <div>
              <button onClick={onDelete}>Удалить</button>
              <button onClick={onEdit}>Перезаписать</button>
              <button onClick={onSave}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ControlModal;
