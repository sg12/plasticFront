const MainInfo = ({ user }) => {
  if (!user) {
    return (
      <div className="profile__header">
        <p>Пользователь не найден</p>
      </div>
    );
  }
  
  return (
    <div className="profile__main">
      <div className="profile__details">
        <div className="profile__gender">
          <span className="profile__darkened">Пол: </span>
          {/* {usersData.users[2]
                  ? usersData.users[2].gender
                  : "Женский"} */}
          Женский
        </div>
        <div className="profile__birthdate">
          <span className="profile__darkened">Дата рождения: </span>
          {/* {usersData.users[2]
                  ? usersData.users[2].birthdate
                  : "01.08.1996"} */}
          01.08.1996
        </div>
        <hr className="profile__divider" />
        <div className="profile__birthdate">
          <span className="profile__darkened">Почта: </span>
          {user.email || "makarova480@mail.ru"}
        </div>
        <div className="profile__address">
          <span className="profile__darkened">Адрес: </span>
          {user.address?.suite || "ул. Никитина 93"}
        </div>
      </div>
    </div>
  );
};

export default MainInfo;
