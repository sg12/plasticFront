import React, { useState } from "react";
import styles from "./Filter.module.scss";
import Checkbox from "../../inputs/checkbox/Checkbox";

const FilterModal = ({
  isFilterOpen,
  setIsFilterOpen,
  children,
  title,
  style,
  animationEnabled,
  animationTime,
  filterValue,
  setFilterValue,
  searchData,
}) => {
  // const [filterValue, setFilterValue] = useState("");
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
        <input
          placeholder={children}
          type="text"
          value={filterValue}
          onChange={handleInputChange}
        />
        <div className={styles.modal__checkbox}>
          <Checkbox children="Докторы" />
          <Checkbox children="Клиники" />
        </div>
        <div className={styles.modal__buttons}>
          {/* <button
            className={styles.button__apply}
            onClick={() => {
              close();
              console.log("FilterValue", filterValue || "undefined");
            }}
          >
            Применить
          </button> */}
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
