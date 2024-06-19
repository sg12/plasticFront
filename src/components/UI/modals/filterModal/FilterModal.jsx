import React, { useState } from "react";
import styles from "./Filter.module.scss";
import Checkbox from "../../inputs/checkbox/Checkbox";

const FilterModal = ({
  isFilterOpen,
  setIsFilterOpen,
  placeholder,
  children,
  title,
  style,
  animationEnabled,
  animationTime,
  filterValue,
  setFilterValue,
  searchData,
  save,
  disabledSearch,
}) => {
  const [modalAnimation, setModalAnimation] = useState("open");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setFilterValue(inputValue);

    // Выполните поиск в данных searchData на основе введенного значения
    return searchData.filter(
      (item) =>
        item.name &&
        item.name.trim().toLowerCase().includes(inputValue.toLowerCase())
    );
  };

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
        <span className={styles.modal__title}>Фильтрация</span>
        {disabledSearch == false && (
          <input
            placeholder={placeholder}
            type="text"
            value={filterValue}
            onChange={handleInputChange}
          />
        )}
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
