import styles from "./Field.module.scss";

const Field = ({ label, values }) => {
  return (
    <div className={styles.field}>
      <span className={styles.field__label}>{label}: </span>
      {values || "Неизвестно"}
    </div>
  );
};

export default Field;
