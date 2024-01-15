import styles from "./Checkbox.module.scss";

const Checkbox = ({ htmlFor, children, id, name, checked, onChange, ...props }) => {
  const handleCheckboxChange = (e) => {
    // console.log("Checkbox Checked:", e.target.checked);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={styles.checkbox}>
      <input
        className={styles.checkbox__input}
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={handleCheckboxChange}
        {...props}
      />
      <label className={styles.checkbox_label} htmlFor={htmlFor}>
        {children}
      </label>
    </div>
  );
};

export default Checkbox;
