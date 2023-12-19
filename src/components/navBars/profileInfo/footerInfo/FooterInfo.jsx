import desc from "../../../../assets/imgs/desc.svg";

const FooterInfo = ({ isEditing, onEditClick }) => {
  return (
    <div className="profile__footer">
      {!isEditing && (
        <>
          <div className="profile__description">
            <img className="img" src={desc} alt="desc" />
            <div className="profile__description-text">
              <div className="text">
                Расскажите вашим близким и знакомым о нас, а мы поможем
                сэкономить их время на поиск нужного специалиста.
              </div>
              <div className="text">
                Количество пользователей, указавших Ваш ID при регистрации: 4
              </div>
              <div className="profile__discount">Персональная скидка 3%</div>
            </div>
          </div>
          <hr className="profile__divider" />
        </>
      )}
      <div className="profile__action-button">
        {isEditing ? (
          <>
            <button type="button" className="save" >
              Сохранить
            </button>
            <button type="button" className="cancel" onClick={onEditClick}>
              Отмена
            </button>
          </>
        ) : (
          <button type="button" className="edit" onClick={onEditClick}>
            Редактировать профиль
          </button>
        )}
        <button type="button" className="delete">
          Удалить учетную запись
        </button>
      </div>
    </div>
  );
};

export default FooterInfo;
