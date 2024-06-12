import styles from "./Select.module.scss";

const Select = ({ children, id, name, options, value, onChange, andClass, ...props }) => {
  return (
    <form className={`${styles.select} ${andClass}`}>
      <label className={styles.select__label}>{children}</label>
      <select
        className={`${styles.select__select} ${andClass}`}
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
