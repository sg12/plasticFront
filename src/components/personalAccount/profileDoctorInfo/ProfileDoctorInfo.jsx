import { useState } from "react";
import EditUser from "../editUser/EditUser";
import AlertModal from "../../UI/modals/alertModal/AlertModal";
import InDev from "../inDev/InDev";
import Field from "../../UI/fields/Field";

const fieldsDetails = [
  { label: "Пол", value: "gender" },
  { label: "Дата рождения", value: "date_born" },
  { label: "Адрес", value: "address" },
  { label: "Официальный сайт", value: "site" },
];

const fieldsFooter = [
  { label: "Лицензии и сертификаты", value: "licenses" },
  { label: "Образование", value: "education" },
  { label: "Повышение квалификации", value: "qualification" },
  { label: "Опыт работы", value: "experience" },
];

// Выносим компонент для отображения информации о пользователе
const UserProfileDetails = ({ userData }) => (
  <div className="profile__details">
    {fieldsDetails.map((field, index) => (
      <Field
        key={index}
        label={field.label}
        value={userData?.user?.[field.value] || "Неизвестно"}
      />
    ))}
  </div>
);

// Выносим компонент для отображения футера профиля
const UserProfileFooter = ({ userData }) => (
  <InDev>
    <div className="profile__additionally">
      {fieldsFooter.map((section, index) => (
        <div key={index} className={`profile__${section.value}`}>
          <Field label={section.label} value={userData?.[section.value]} />
          <div className="profile__action-button">
            <button className="add" type="button">
              Добавить
            </button>
          </div>
          {index < fieldsFooter.length - 1 && (
            <hr className="profile__divider" />
          )}
        </div>
      ))}
    </div>
  </InDev>
);

const UserProfileAction = ({ toggleEditingMode, handleDelete }) => (
  <div className="profile__action-button">
    <button type="button" className="edit" onClick={toggleEditingMode}>
      Редактировать профиль
    </button>
    <button type="button" className="delete" onClick={handleDelete}>
      Удалить учетную запись
    </button>
  </div>
);

const UserProfileHeader = ({ userData, imageSrc, handleFileChange }) => (
  <div className="profile__header">
    <div className="profile__user">
      <div className="profile__photo">
        <label htmlFor="uploadInput" className="profile__photo-label">
          <img
            src={userData?.user?.avatar || imageSrc}
            alt="user image"
            className="profile__photo-img"
          />
        </label>
        <input
          type="file"
          id="uploadInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div className="profile__details">
        <h3 className="profile__user-name">
          {userData?.user?.username || "Неизвестно"} (Doctor)
        </h3>
        <div className="profile__user-phone">
          <span className="profile__darkened">Телефон: </span>
          {userData?.user?.phone || "Неизвестно"}
        </div>
        <div className="profile__email">
          <span className="profile__darkened">Почта: </span>
          {userData?.user?.email || "Неизвестно"}
        </div>
      </div>
    </div>
    <div className="profile__identification">
      <div className="iden">
        <div className="iden__id">
          <span>Ваш ID:</span> {userData?.user?.id || "Неизвестно"}
        </div>
      </div>
    </div>
  </div>
);

const ProfileDoctorInfo = ({ userData }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleEditingMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleDeleteAccount = () => {
    console.log("Account deleting");
  };

  return (
    <div className="profile">
      {userData && (
        <>
          <UserProfileHeader
            userData={userData}
            imageSrc={imageSrc}
            handleFileChange={handleFileChange}
          />
          <hr className="profile__divider" />
          {!isEditing && <UserProfileDetails userData={userData} />}
          {isEditing && (
            <EditUser
              userData={userData}
              toggleEditingMode={toggleEditingMode}
            />
          )}
          {!isEditing && (
            <>
              <UserProfileFooter userData={userData} />
              <UserProfileAction
                toggleEditingMode={toggleEditingMode}
                handleDelete={handleOpenModal}
              />
            </>
          )}
          <AlertModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onAccept={handleDeleteAccount}
            title="Удалить учетную запись?"
            message="Удаление аккаунта приведет к безвозвратной потере всех связанных с
            ним данных."
          />
        </>
      )}
    </div>
  );
};

export default ProfileDoctorInfo;
