import React from "react";
import styles from "./Field.module.scss";
import OutlineButton from "../buttons/outlineButton/OutlineButton";
import Tooltip from "../tooltips/Tooltip";
import { FiDelete } from "react-icons/fi";

const Additionally = ({ label, values, fields, onDelete }) => {
  const filteredFields = fields.filter(
    (fieldSection) => fieldSection.label === label
  );

  return (
    <div className={styles.field}>
      <span className={styles.field__label}>{label}: </span>
      {values.length > 0 ? (
        values.map((item, index) => (
          <div key={index} className={styles.field__items}>
            <div className={styles.field__item}>
              {filteredFields.map((fieldSection, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  {fieldSection.fields.map((field, fieldIndex) => (
                    <span key={fieldIndex} className={styles.field__property}>
                      {`${field.label}: ${item[field.name]}`}
                    </span>
                  ))}
                </React.Fragment>
              ))}
            </div>
            <Tooltip text="Удалить" position="left">
              <OutlineButton
                onClick={() => onDelete(item.id)}
                className={styles.field__button}
              >
                <FiDelete />
              </OutlineButton>
            </Tooltip>
          </div>
        ))
      ) : (
        <div className={styles.field__empty}>Пусто</div>
      )}
    </div>
  );
};

export default Additionally;
