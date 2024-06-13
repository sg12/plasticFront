import Field from "../../UI/fields/Field";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";

const ProfileUserFooter = ({ userData, fields }) => (
  <div className="profile__footer">
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
  </div>
);

export default ProfileUserFooter;
