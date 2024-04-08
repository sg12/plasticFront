import styles from "./Field.module.scss";

const Field = ({ label, value }) => (
  <div className={styles.field}>
    <span className={styles.field__lable} style={{ opacity: 0.5 }}>{label}: </span>
    {value || "Неизвестно"}
  </div>
);

export default Field;
