import qr from "../../../../assets/imgs/qr-code.png";

const Header = ({ imageSrc, user, img, handleFileChange }) => {
  if (!user) {
    return (
      <div className="profile__header">
        <p>Пользователь не найден</p>
      </div>
    );
  }

  return (
    <div className="profile__header">
      <div className="profile__user">
        <div className="profile__photo">
          <label htmlFor="uploadInput" className="profile__photo-label">
            <img
              src={imageSrc || img.thumbnailUrl}
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
            {user.name || "Макарова Светлана Викторовна"}
          </h3>
          <p className="profile__user-phone">
            <span className="profile__darkened">Телефон: </span>
            {user.phone || "+7 (914) 001 96 58"}
          </p>
        </div>
      </div>
      <div className="profile__identification">
        <div className="iden">
          <div className="iden__id">
            <span>Ваш ID:</span> {user.id || "1234"}
          </div>
          <div className="iden__code">
            Код: {user.address?.zipcode || "a4861fe9-a65a"}
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
  );
};

export default Header;
