import Field from "../../UI/fields/Field";

const ProfileUserDetails = ({ userData, fields }) => (
  <div className="profile__details">
    {fields.map((field, index) => (
      <Field
        key={index}
        label={field.label}
        value={userData?.[field.value] || "Неизвестно"}
      />
    ))}
  </div>
);

export default ProfileUserDetails;
