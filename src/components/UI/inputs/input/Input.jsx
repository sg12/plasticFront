import PropTypes from "prop-types";

import styles from "./Input.module.scss";

const Input = ({
  label,
  placeholder,
  size = "medium",
  type,
  name,
  value,
  onChange,
  andClass,
  isLoading,
  ...props
}) => {
  return (
    <div className={andClass}>
      {label && <label>{label}</label>}
      <input
        style={{
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
        className={`${styles.input} ${styles[size]}`}
        placeholder={placeholder}
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  size: PropTypes.oneOf(["default", "medium", "large"]),
  andClass: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default Input;
