import { useState } from "react";
import "./ReviewsItem.scss";
import OutlineButton from "../../../UI/buttons/outlineButton/OutlineButton";
import Tag from "../../../UI/tags/Tag";
import Divider from "../../../UI/dividers/Divider";
import formatDate from "../../../../utils/formatDate";

const ReviewsItem = ({ data, onSave, onCancel }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(data?.text);

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
    <div className={`reviews__item ${isEditing ? "editing" : ""}`}>
      <div className="reviews__header">
        <div className="reviews__info">
          <div className="reviews__user">
            <span className="reviews__name">
              от: {data?.author?.username || "Author"}
            </span>
            <span className="reviews__name">
              кому: {data?.user?.username || "Recipient"}
            </span>
          </div>

          <Tag label={`Рейтинг: ${data?.rating}`} />
          <span className="reviews__date">
            {formatDate(data?.created_at) || "Data"}
          </span>
        </div>
      </div>
      <Divider />
      <div className="reviews__main">
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          <p>
            {isExpanded
              ? editedText
              : editedText?.length > 100
              ? `${editedText.slice(0, 200)}...`
              : editedText}
            {!isExpanded && editedText?.length > 100 && (
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
      {/* <div className="reviews__actions">
        {isEditing ? (
          <>
            <OutlineButton onClick={handleSaveClick} style={{ border: "none" }}>
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
      </div> */}
    </div>
  );
};

export default ReviewsItem;
