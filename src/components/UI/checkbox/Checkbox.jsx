import React from "react";
import styles from "./Checkbox.module.scss";

const Checkbox = ({ checked, disabled, indeterminate, onChange }) => {
  return (
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className={styles.checkbox}
        ref={(input) => {
          if (input) {
            input.indeterminate = indeterminate;
          }
        }}
      />
  );
};

export default Checkbox;
