import { useState } from "react";
import RenderStar from "../../renderStars/RenderStar";
import "./ReviewsItem.scss";

const ReviewsItem = ({ text, name, date }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Здесь вы можете добавить логику сохранения отредактированного текста, например, отправив его на сервер
    // После сохранения вы можете установить isEditing в false
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    // Если пользователь отменяет редактирование, вернуться к оригинальному тексту
    setEditedText(text);
    setIsEditing(false);
  };

  return (
    <div className="reviews">
      <div className="reviews__header">
        <div className="reviews__header-left">
          <span className="reviews__header-name">
            {...name || "Васильев Семен Семёнович"}
          </span>
          <span className="reviews__header-rating">
            Rating Component
            <RenderStar />
          </span>
        </div>
        <span className="reviews__header-date">{...date || "10.02.2023"}</span>
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
              {isExpanded ? editedText : `${editedText?.slice(0, 150)}...`}
              {!isExpanded && (
                <span className="read-more" onClick={toggleExpand}>
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
              <button className="save" onClick={handleSaveClick}>
                Сохранить
              </button>
              <button className="cancel" onClick={handleCancelClick}>
                Отмена
              </button>
            </>
          ) : (
            <button className="edit" onClick={handleEditClick}>
              Редактировать отзыв
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsItem;
