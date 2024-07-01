import Field from "../../UI/fields/Field";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import desc from "../../../assets/imgs/desc.svg";

const ProfileUserFooter = ({ userData, fields }) => (
  <div className="profile__footer">
    {userData.user.type === "client" ? (
      <>
        <div className="profile__description">
          <img className="img" src={desc} alt="desc" />
          <div className="profile__description-text">
            <div className="text">
              Расскажите вашим близким и знакомым о нас, а мы поможем сэкономить
              их время на поиск нужного специалиста.
            </div>
            <div className="text">
              Количество пользователей, указавших Ваш ID при регистрации:{" "}
              {userData?.subs || "0"}
            </div>
            <div className="profile__discount">Персональная скидка 3%</div>
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="profile__additionally">
          {fields.map((section, index) => (
            <div key={index} className={`profile__${section.value}`}>
              <Field label={section.label} value={userData?.[section.value]} />
              <div className="profile__actions">
                <OutlineButton
                  className="add"
                  onClick={() => alert("Добавление... *ProfileUserFooter*")}
                >
                  Добавить
                </OutlineButton>
              </div>
              {index < fields.length - 1 && <hr className="profile__divider" />}
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

export default ProfileUserFooter;
