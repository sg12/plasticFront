import { useEffect, useState } from "react";
import styles from "./ControlModal.module.scss";

const ControlModal = ({
  onDelete,
  onEdit,
  onSave,
  isControlOpen,
  setIsControlOpen,
}) => {
  const [modalAnimation, setModalAnimation] = useState("open");

  useEffect(() => {
    setModalAnimation(isControlOpen ? "open" : "close");
  }, [isControlOpen]);

  const trash = (
    <button
      className={`${styles.button__delete} ${styles[modalAnimation]}`}
      onClick={onDelete}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M9.95414 12V16.25M14.0459 12V16.25M14.5 6C14.5 5.44772 14.0523 5 13.5 5H10.5C9.94772 5 9.5 5.44772 9.5 6M5.86415 7.75003L6.70459 17.7512C6.83518 19.3052 8.13459 20.5 9.69405 20.5H14.307C15.8664 20.5 17.1659 19.3052 17.2964 17.7512L18.1369 7.75003M4.5 7.59802H19.5"
          stroke="#3066BE"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
  const pen = (
    <button
      className={`${styles.button__edit} ${styles[modalAnimation]}`}
      onClick={onEdit}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M13.2217 6.68078L17.3148 10.7753M8.76313 19.0264L3.5 20.5L4.97366 15.2372C5.11325 14.7387 5.37947 14.2848 5.74644 13.9196L14.8029 4.90751C15.5846 4.12964 16.8485 4.1313 17.6281 4.91122L19.0897 6.37328C19.8692 7.15304 19.8706 8.41655 19.0928 9.19805L10.0807 18.2537C9.71554 18.6206 9.26163 18.8868 8.76313 19.0264Z"
          stroke="#3066BE"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
  const save = (
    <button
      className={`${styles.button__save} ${styles[modalAnimation]}`}
      onClick={onSave}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M16 4V6.5C16 7.32843 15.3284 8 14.5 8H9.5C8.67157 8 8 7.32843 8 6.5V4M16 21V16.5C16 15.6716 15.3284 15 14.5 15H9.5C8.67157 15 8 15.6716 8 16.5V21M14.7574 4H7C5.34315 4 4 5.34315 4 7V18C4 19.6569 5.34315 21 7 21H17C18.6569 21 20 19.6569 20 18V9.24264C20 8.44699 19.6839 7.68393 19.1213 7.12132L16.8787 4.87868C16.3161 4.31607 15.553 4 14.7574 4Z"
          stroke="#3066BE"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
  
  const modalContent = (
    <div className={`${styles.modalContent} ${styles[modalAnimation]}`}>
      <div className={styles.button}>
        {trash}
        {pen}
        {save}
      </div>
    </div>
  );

  return (
    <div className={styles.modalBackdrop}>
      <div className={`${styles.modalContent} ${styles[modalAnimation]}`}>
        <div className={styles.button}>
          {trash}
          {pen}
          {save}
        </div>
      </div>
    </div>
  );
};

export default ControlModal;
