import styles from "./Select.module.scss";

const Select = ({ htmlFor, children, id, name, options, value, onChange, ...props }) => {
  return (
    <form className={styles.select}>
      <label className={styles.select__label} htmlFor={htmlFor}>
        {children}
      </label>
      <select
        className={styles.select__select}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        {...props} // Проксирование дополнительных свойств
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </form>
  );
};

export default Select;
