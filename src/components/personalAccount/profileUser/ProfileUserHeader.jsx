// import { useState } from "react";

const UserProfileHeader = ({ userData, extraDetails, extraIdentification }) => {
  // const [imageSrc, setImageSrc] = useState(null);

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImageSrc(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <div className="profile__header">
      <div className="profile__user">
        <div className="profile__photo">
          <label htmlFor="uploadInput" className="profile__photo-label">
            <img
              src={
                userData?.avatar ||
                "https://aib-schultes.de/wp-content/uploads/2019/11/jobs-icon-aibschultes-avatar.jpg"
              }
              alt="user image"
              className="profile__photo-img"
            />
          </label>
          {/* <input
            type="file"
            id="uploadInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          /> */}
        </div>
        <div className="profile__details">
          <h3 className="profile__user-name">
            {userData?.fio || "Неизвестно"}
          </h3>
          <p className="profile__user-phone">
            <span className="profile__darkened">Телефон: </span>
            {userData?.phone || "Неизвестно"}
          </p>
          {userData?.email && (
            <div className="profile__email">
              <span className="profile__darkened">Почта: </span>
              {userData?.email || "Неизвестно"}
            </div>
          )}
          {extraDetails}
        </div>
      </div>
      <div className="profile__identification">
        <div className="iden">
          <div className="iden__id">
            <span>Ваш ID:</span> {userData?.id || "Неизвестно"}
          </div>
          {extraIdentification}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
