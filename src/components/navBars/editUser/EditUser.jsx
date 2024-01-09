import "./EditUser.scss";

const EditUser = ({ userData }) => {
  return (
    <div className="edit">
      <span className="edit__title">Персональные данные</span>
      <div className="edit__info">
        <form className="edit__email">
          <label htmlFor="email">Email</label>
          <input
            autoComplete="none"
            type="email"
            name=""
            id="email"
            placeholder={userData.email || "Неизвестно"}
          />
        </form>
        <form className="edit__gender">
          <label htmlFor="gender">Пол</label>
          <select name="" id="gender">
            <option value="">Мужской</option>
            <option value="">Женский</option>
          </select>
        </form>
        <form className="edit__address">
          <label htmlFor="address">Адрес</label>
          <input
            autoComplete="none"
            type="text"
            name=""
            id="address"
            placeholder={userData.address.suite || "Неизвестно"}
          />
        </form>
        <form className="edit__name">
          <label htmlFor="name">ФИО</label>
          <input
            autoComplete="none"
            type="text"
            name=""
            id="name"
            placeholder={userData.username || "Неизвестно"}
          />
        </form>
        <form className="edit__date">
          <label htmlFor="date">Дата рождения</label>
          <input
            autoComplete="none"
            type="date"
            name=""
            id="date"
            placeholder={userData.birthdate || "Неизвестно"}
          />
        </form>
        <form className="edit__tel">
          <label htmlFor="tel">Телефон</label>
          <input
            autoComplete="none"
            type="tel"
            name=""
            id="tel"
            placeholder={userData.phone || "Неизвестно"}
          />
        </form>
      </div>
      <span className="edit__title">Согласие пользователя</span>
      <div className="edit__checkbox">
        <div className="edit__checkbox-p1">
          <input
            className="edit__checkbox-politicy"
            type="checkbox"
            name="politicy"
            id=""
          />
          <span className="edit__checkbox-text">
            Пользователь ознакомлен с Политикой Конфиденциальности
          </span>
        </div>
        <div className="edit__checkbox-p2">
          <input
            className="edit__checkbox-politicy"
            type="checkbox"
            name="politicy"
            id=""
          />
          <span className="edit__checkbox-text">
            Пользователь даёт Согласие на обработку персональных данных
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
