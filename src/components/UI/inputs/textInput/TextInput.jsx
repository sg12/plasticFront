import styles from "./TextInput.module.scss";

const TextInput = ({
  htmlFor,
  children,
  id,
  type,
  name,
  userData,
  onChange,
  ...props
}) => {
  const handleInputChange = (e) => {
    // console.log("Input name:", name);
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <form className={styles.textInput}>
      <label className={styles.textInput__label} htmlFor={htmlFor}>
        {children}
      </label>
      <input
        className={styles.textInput__input}
        autoComplete="none"
        type={type}
        name={name}
        id={id}
        placeholder={userData || "Неизвестно"}
        onChange={handleInputChange}
        {...props}
      />
    </form>
  );
};

export default TextInput;
