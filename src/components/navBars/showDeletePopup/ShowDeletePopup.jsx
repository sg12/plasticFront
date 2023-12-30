import { useState } from "react";

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
        <div className="delete__popup">
          <p>Вы точно хотите удалить аккаунт?</p>
          <div className="delete__popup-button">
            <button className="yes" onClick={handleAccept}>
              Да
            </button>
            <button className="no" onClick={handleReturn}>
              Нет, передумал
            </button>
          </div>
        </div>
      )}
      {confirmed && (
        <div className="delete__popup">
          <p>Вы уверены?</p>
          <div className="delete__popup-button">
            <button className="yes" onClick={handleAccept}>
              Да
            </button>
            <button className="no" onClick={handleReturn}>
              Нет, передумал
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeletePopup;
