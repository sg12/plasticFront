import styles from "./Field.module.scss";

const Field = ({ label, values }) => {
  return (
    <div className={styles.field}>
      <span className={styles.field__label} style={{ opacity: 0.5 }}>
        {label}:{" "}
      </span>
      {values && values.length > 0
        ? values.map((value, index) => (
            <span key={index}>
              {value}
              {index < values.length - 1 ? ", " : ""}
            </span>
          ))
        : "Неизвестно"}
    </div>
  );
};

export default Field;
