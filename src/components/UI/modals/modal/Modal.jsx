import React, { useEffect, useState } from "react";
import styles from "./Modal.module.scss";
import OutlineButton from "../../buttons/outlineButton/OutlineButton";

const Modal = ({
  isModalOpen = false,
  setIsModalOpen,
  children,
  title,
  style = "right",
  animationEnabled = true,
  animationTime,
  save,
}) => {
  const [modalAnimation, setModalAnimation] = useState("open");

  useEffect(() => {
    if (isModalOpen) {
      setModalAnimation("open");
    } else {
      setModalAnimation("close");
    }
  }, [isModalOpen]);

  function close() {
    setModalAnimation("close");
    setTimeout(() => {
      setIsModalOpen(false);
    }, animationTime || 400); // Мин. 0.1
  }

  const modalClass = animationEnabled
    ? `${styles.modal} ${styles[modalAnimation]}`
    : styles.modal;

  return (
    <div className={`${styles.modalOverlay} ${styles[style]}`}>
      <div className={modalClass}>
        <span className={styles.modal__title}>{title || "Title"}</span>
        {children}
        <div className={styles.modal__buttons}>
          <OutlineButton
            style={{ color: "#ffffff", background: "#3066be" }}
            onClick={() => {
              save();
            }}
          >
            Сохранить
          </OutlineButton>
          <OutlineButton
            onClick={() => {
              close();
            }}
          >
            Закрыть
          </OutlineButton>
        </div>
      </div>
    </div>
  );
};

export default Modal;
