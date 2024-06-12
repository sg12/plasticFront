import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const Input = ({
  label,
  placeholder,
  size = "medium",
  type,
  name,
  value,
  onChange,
  ...props
}) => {
  return (
    <form style={styles.form}>
      <label style={styles.label}>{label}</label>
      <input
        style={{ ...styles.input, ...styles.size[size] }}
        autoComplete="none"
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      />
    </form>
  );
};

const styles = {
  form: {
    display: "inline-flex",
    width: "100%",
  },
  label: {},
  input: {
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #3066be",
  },
  size: {
    default: {
      fontSize: "14px",
      padding: "6px 12px",
    },
    medium: {
      fontSize: "16px",
      padding: "8px 16px",
    },
    large: {
      fontSize: "18px",
      padding: "8px 16px",
    },
  },
};

Input.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  size: PropTypes.oneOf(["default", "medium", "large"]),
};

export default Input;
