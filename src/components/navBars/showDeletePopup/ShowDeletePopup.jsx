import { useState } from "react";

import styles from "./ShowDeletePopup.module.scss";

const DeletePopup = ({ showDeletePopup, setShowDeletePopup }) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleReturn = () => {
    setShowDeletePopup(false);
    setConfirmed(false);
  };

  const handleAccept = () => {
    setConfirmed(true);
    setShowDeletePopup(false);
  };

  return (
    <>
      {showDeletePopup && (
        <div className={styles.delete__popup}>
          <span className={styles.delete__title}>
            Вы точно хотите удалить аккаунт?
          </span>
          <span className={styles.delete__subtitle}>
            Удаление аккаунта приведет к безвозвратной потере всех связанных с
            ним данных.
          </span>
          <div className={styles.delete__button}>
            <button className={styles.no} onClick={handleReturn}>
              Отмена
            </button>
            <button className={styles.yes} onClick={handleAccept}>
              Да, удалить аккаунт
            </button>
          </div>
        </div>
      )}
      {confirmed && (
        <div className={styles.delete__popup}>
          <span className={styles.delete__title}>Вы уверены?</span>
          <span className={styles.delete__subtitle}>
            Удаление аккаунта приведет к безвозвратной потере всех связанных с
            ним данных.
          </span>
          <div className={styles.delete__button}>
            <button className={styles.no} onClick={handleReturn}>
              Отмена
            </button>
            <button className={styles.yes} onClick={handleAccept}>
              Да, удалить аккаунт
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeletePopup;
