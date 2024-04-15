import React, { useState } from "react";
import styles from "./Radios.module.scss";

const Radios = ({ options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div className={styles.radio}>
      {options.map((option) => (
        <label className={styles.radio__label} key={option.value}>
          <input
            className={styles.radio__input}
            type="radio"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={() => handleOptionChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default Radios;
