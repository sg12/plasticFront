import { useState } from "react";
import "./ReviewsItem.scss";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";

const ReviewsItem = ({
  text,
  name,
  rating,
  userType,
  engStatus,
  rusStatus,
  date,
  onSave,
  onCancel,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleSaveClick = () => {
    onSave(editedText);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    onCancel();
    setEditedText(text);
    setIsEditing(false);
  };

  return (
    <div className={`reviews ${isEditing ? "editing" : ""}`}>
      <div className="reviews__header">
        <div className="reviews__header-upper">
          <div className="reviews__header-info">
            <span className="reviews__header-name">{name || "FULLNAME"}</span>
            <span className="reviews__header-userType">
              [{userType || "FULLNAME"}]
            </span>
          </div>
          <span className="reviews__header-date">{date || "DATE"}</span>
        </div>
        <div className="reviews__header-bottom">
          <span className="reviews__header-rating">
            Рейтинг: {rating || "FULLNAME"}
          </span>
          <span className="reviews__header-rating">
            {rusStatus || "FULLNAME"}
          </span>
        </div>
      </div>
      <hr className="reviews__hr" />
      <div className="reviews__main">
        <div className="reviews__main-text">
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
          ) : (
            <p>
              {isExpanded
                ? editedText
                : editedText.length > 100
                ? `${editedText.slice(0, 100)}...`
                : editedText}
              {!isExpanded && editedText.length > 100 && (
                <span
                  className="read-more"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  Читать дальше...
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      <div className="reviews__footer">
        <div className="reviews__footer-button">
          {isEditing ? (
            <>
              <OutlineButton
                onClick={handleSaveClick}
                style={{ border: "none" }}
              >
                Сохранить
              </OutlineButton>
              <OutlineButton
                onClick={handleCancelClick}
                style={{ border: "none" }}
              >
                Отмена
              </OutlineButton>
            </>
          ) : (
            <OutlineButton
              onClick={() => setIsEditing(true)}
              style={{ border: "none" }}
            >
              Редактировать отзыв
            </OutlineButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsItem;
