import { FaUser, FaUserDoctor } from "react-icons/fa6";
import Avatar from "../../UI/avatar/Avatar";
import Field from "../../UI/fields/Field";

const UserProfileHeader = ({ userData, extraDetails, extraIdentification }) => {
  console.log(userData);
  return (
    <div className="profile__header">
      <div className="profile__user">
        {userData?.role === "client" ? (
          <Avatar
            src={userData?.avatar}
            icon={<FaUser />}
            size={"large"}
            alt={userData?.fio}
          />
        ) : (
          <Avatar
            src={userData?.avatar}
            icon={<FaUserDoctor />}
            size={"large"}
            alt={userData?.fio}
          />
        )}
        <div className="profile__details">
          <h3 className="profile__fio">{userData?.fio || "Неизвестно"}</h3>
          <Field label={"Телефон"} values={userData?.phone} />
          <Field label={"Email"} values={userData?.email} />
          {extraDetails}
        </div>
      </div>
      <div className="profile__identification">
        <div className="iden__id">
          <span>Ваш ID:</span> {userData?.id || "Неизвестно"}
        </div>
        {extraIdentification}
      </div>
    </div>
  );
};

export default UserProfileHeader;
