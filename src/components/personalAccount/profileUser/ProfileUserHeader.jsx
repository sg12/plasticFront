import { FaUser, FaUserDoctor } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";
import Avatar from "../../UI/avatar/Avatar";
import Field from "../../UI/fields/Field";

const UserProfileHeader = ({ userData, extraDetails, extraIdentification }) => {
  return (
    <div className="profile__header">
      <div className="profile__user">
        {userData?.role && (
          <Avatar
            src={userData?.avatar}
            icon={
              userData.role === "client" ? (
                <FaUser />
              ) : userData.role === "clinic" ? (
                <FaClinicMedical />
              ) : (
                <FaUserDoctor />
              )
            }
            size={"large"}
            alt={userData?.fio}
          />
        )}
        <div className="profile__details">
          <h3 className="profile__fio">
            {userData?.fio || userData?.name || "Неизвестно"}
          </h3>
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
