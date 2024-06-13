const UserProfileHeader = ({
  userData,
  imageSrc,
  handleFileChange,
  role,
  extraDetails,
  extraIdentification,
}) => (
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
          {userData?.user?.username || "Неизвестно"} ({role})
        </h3>
        <p className="profile__user-phone">
          <span className="profile__darkened">Телефон: </span>
          {userData?.user?.phone || "Неизвестно"}
        </p>
        {userData?.user?.email && (
          <div className="profile__email">
            <span className="profile__darkened">Почта: </span>
            {userData?.user?.email || "Неизвестно"}
          </div>
        )}
        {extraDetails}
      </div>
    </div>
    <div className="profile__identification">
      <div className="iden">
        <div className="iden__id">
          <span>Ваш ID:</span> {userData?.user?.id || "Неизвестно"}
        </div>
        {extraIdentification}
      </div>
    </div>
  </div>
);

export default UserProfileHeader;
