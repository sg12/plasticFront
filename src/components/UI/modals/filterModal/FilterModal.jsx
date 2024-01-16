import React, { useState } from "react";
import styles from "./Filter.module.scss";

const FilterModal = ({
  isFilterOpen,
  setIsFilterOpen,
  children,
  title,
  style,
  animationEnabled,
  animationTime,
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [modalAnimation, setModalAnimation] = useState("open");

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
        {/* {children} */}
        <h2>Фильтрация</h2>
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <div className={styles.modalButtons}>
          <button
            className={styles.button__apply}
            onClick={() => {
              filterValue, close();
              console.log("FilterValue", filterValue || "undefined");
            }}
          >
            Применить
          </button>
          <button
            className={styles.button}
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
