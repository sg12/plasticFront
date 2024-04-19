import styles from "./TextInput.module.scss";

const TextInput = ({ children, id, type, name, value, onChange, ...props }) => {
  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <form className={styles.textInput}>
      <label className={styles.textInput__label}>{children}</label>
      <input
        className={styles.textInput__input}
        autoComplete="none"
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={handleInputChange}
        {...props}
      />
    </form>
  );
};

export default TextInput;
