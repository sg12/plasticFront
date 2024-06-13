import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";

const ProfileUserAction = ({ toggleEditingMode, handleDelete }) => (
  <div className="profile__actions">
    <OutlineButton className="edit" onClick={toggleEditingMode}>
      Редактировать
    </OutlineButton>
    <OutlineButton className="delete" onClick={handleDelete}>
      Удалить
    </OutlineButton>
  </div>
);

export default ProfileUserAction;
