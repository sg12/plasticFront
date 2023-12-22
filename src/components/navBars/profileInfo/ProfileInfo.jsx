import { useEffect, useState } from "react";
import axios from "axios";
import qr from "../../../assets/imgs/qr-code.png";
import desc from "../../../assets/imgs/desc.svg";

import "./ProfileInfo.scss";
import EditUser from "../editUser/EditUser";

const ProfileInfo = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

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

  const handleSave = () => {
    // Логика для отправки данных на сервер

    // После успешного сохранения, отображаем всплывающее окно
    setShowEditPopup(true);
    toggleEditingMode(false);

    setTimeout(() => {
      setShowEditPopup(false);
    }, 3000);
  };

  const handleDelete = () => {
    // Логика для отправки данных на сервер

    // После успешного сохранения, отображаем всплывающее окно
    setShowDeletePopup(true);

  };

  const handleReturn = () => {
    setShowDeletePopup(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      const apiUrlUsers = "https://jsonplaceholder.typicode.com/users?_limit=1";
      const apiUrlPhotos =
        "https://jsonplaceholder.typicode.com/photos?_limit=1";

      try {
        const [usersResponse, photosResponse] = await axios.all([
          axios.get(apiUrlUsers),
          axios.get(apiUrlPhotos),
        ]);

        const userData = {
          user: usersResponse.data[0],
          photo: photosResponse.data[0],
        };

        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="profile">
      {userData && (
        <>
          {/* Header */}
          <div className="profile__header">
            <div className="profile__user">
              <div className="profile__photo">
                <label htmlFor="uploadInput" className="profile__photo-label">
                  <img
                    src={imageSrc || userData.photo.thumbnailUrl}
                    alt=""
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
                  {userData.user.name || "Макарова Светлана Викторовна"}
                </h3>
                <p className="profile__user-phone">
                  <span className="profile__darkened">Телефон: </span>
                  {userData.user.phone || "+7 (914) 001 96 58"}
                </p>
              </div>
            </div>
            <div className="profile__identification">
              <div className="iden">
                <div className="iden__id">
                  <span>Ваш ID:</span> {userData.user.id || "1234"}
                </div>
                <div className="iden__code">
                  Код: {userData.user.address?.zipcode || "a4861fe9-a65a"}
                </div>
              </div>
              <img
                src={qr}
                width="150"
                height="150"
                border="0"
                title="QR код"
                className="identification__qr-img"
              />
            </div>
          </div>
          <hr className="profile__divider" />

          {/* MainInfo */}
          {!isEditing && (
            <div className="profile__main">
              <div className="profile__details">
                <div className="profile__gender">
                  <span className="profile__darkened">Пол: </span>
                  {userData.user.gender || "Женский"}
                </div>
                <div className="profile__birthdate">
                  <span className="profile__darkened">Дата рождения: </span>
                  {userData.user.birthdate || "01.08.1996"}
                </div>
                <div className="profile__birthdate">
                  <span className="profile__darkened">Почта: </span>
                  {userData.user.email || "makarova480@mail.ru"}
                </div>
                <div className="profile__address">
                  <span className="profile__darkened">Адрес: </span>
                  {userData.user.address?.suite || "ул. Никитина 93"}
                </div>
                <hr className="profile__divider" />
              </div>
            </div>
          )}

          {/* EditUser */}
          {isEditing && <EditUser />}

          {/* FooterInfo */}
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
                      Количество пользователей, указавших Ваш ID при
                      регистрации: 4
                    </div>
                    <div className="profile__discount">
                      Персональная скидка 3%
                    </div>
                  </div>
                </div>
              </>
            )}
            <hr className="profile__divider" />
            <div className="profile__action-button">
              {showEditPopup && (
                <div className="edit__popup">
                  <p>Данные успешно сохранены!</p>
                </div>
              )}
              {showDeletePopup && (
                <div className="delete__popup">
                  <p>Вы точно хотите удалить аккаунт?</p>
                  <div className="delete__popup-button">
                    <button className="yes">Да</button>
                    <button className="no" onClick={handleReturn}>Нет, передумал</button>
                  </div>
                </div>
              )}
              {isEditing ? (
                <>
                  <button type="button" className="save" onClick={handleSave}>
                    Сохранить
                  </button>
                  <button
                    type="button"
                    className="cancel"
                    onClick={toggleEditingMode}
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="edit"
                    onClick={toggleEditingMode}
                  >
                    Редактировать профиль
                  </button>
                  <button
                    type="button"
                    className="delete"
                    onClick={handleDelete}
                  >
                    Удалить учетную запись
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
