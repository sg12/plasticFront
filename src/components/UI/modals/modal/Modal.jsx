import React, { useEffect, useState } from "react";
import styles from "./Modal.module.scss";

const FilterModal = ({
  isFilterOpen = false,
  setIsFilterOpen,
  children,
  title,
  style = "right",
  animationEnabled = true,
  animationTime,
  save,
}) => {
  const [modalAnimation, setModalAnimation] = useState("open");

  useEffect(() => {
    if (isFilterOpen) {
      setModalAnimation("open");
    } else {
      setModalAnimation("close");
    }
  }, [isFilterOpen]);

  function close() {
    setModalAnimation("close");
    setTimeout(() => {
      setIsFilterOpen(false);
    }, animationTime || 400); // Мин. 0.1
  }

  const modalClass = animationEnabled
    ? `${styles.modal} ${styles[modalAnimation]}`
    : styles.modal;

  return (
    <div className={`${styles.modalOverlay} ${styles[style]}`}>
      <div className={modalClass}>
        {/* {title} */}
        <span className={styles.modal__title}>{title || "Title"}</span>
        {children}
        <div className={styles.modal__buttons}>
          <button
            className={styles.save}
            onClick={() => {
              save();
            }}
          >
            Сохранить
          </button>
          <button
            className={styles.close}
            onClick={() => {
              close();
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
