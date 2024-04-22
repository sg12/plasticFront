import { useEffect } from "react";
import styles from "./ContextMenu.module.scss";

const ContextMenu = ({ xPos, yPos, onClose, items }) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Если клик вне контекстного меню, то закрыть его
      if (!event.target.closest("#context")) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div
      id="context"
      className={styles.context}
      style={{ top: yPos, left: xPos }}
    >
      <ul className={styles.context__ul}>
        {items.map((item, index) => (
          <li
            key={index}
            className={styles.context__li}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
