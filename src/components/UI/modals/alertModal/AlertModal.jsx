import OutlineButton from "../../buttons/outlineButton/OutlineButton";
import styles from "./AlertModal.module.scss";

const AlertModal = ({ isOpen, onClose, onAccept, message, title }) => {
  return (
    isOpen && (
      <div
        className={`${styles.alert__container} ${
          isOpen ? styles.alert__modal : ""
        }`}
      >
        <div className={styles.alert__content}>
          <span className={styles.alert__title}>{title}</span>
          <p className={styles.alert__subtitle}>{message}</p>
          <div className={styles.alert__button}>
            <button className={styles.alert__close} onClick={onClose}>
              Отменить
            </button>
            <button className={styles.alert__accept} onClick={onAccept}>
              Удалить
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AlertModal;
