import { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.scss";

const Dropdown = ({ options, onSelect }) => {
  const container = useRef();
  const [dropdownState, setDropdownState] = useState({ open: false });

  const handleDropdownClick = () =>
    setDropdownState({ open: !dropdownState.open });

  const handleClickOutside = (e) => {
    if (container.current && !container.current.contains(e.target)) {
      setDropdownState({ open: false });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={container}>
      <button
        type="button"
        className={styles.button}
        onClick={handleDropdownClick}
      >
        Click me!
      </button>
      {dropdownState.open && (
        <div className={styles.dropdown}>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
            <li>Item 4</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
