import PropTypes from "prop-types";

import styles from "./Select.module.scss";

const Select = ({
  label,
  placeholder,
  size = "medium",
  name,
  options,
  value,
  onChange,
  andClass,
  isLoading,
  ...props
}) => {
  return (
    <div className={andClass}>
      {label && <label>{label}</label>}
      <select
        style={{
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
        className={`${styles.select} ${styles[size]}`}
        name={name}
        value={value || ""}
        onChange={onChange}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  size: PropTypes.oneOf(["default", "medium", "large"]),
  andClass: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default Select;
