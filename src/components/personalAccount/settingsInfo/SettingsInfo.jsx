import "./SettingsInfo.scss";
import PlasticServices from "../../../services/PlasticServices";
import { useNavigate } from "react-router-dom";

const SettingsInfo = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await PlasticServices.logoutUser();
      navigate(
        "/enterPage",
        setTimeout(() => window.location.reload(), 0)
      );
    } catch (error) {
      console.error("Ошибка при выходе из аккаунта:", error);
    }
  };

  return (
    <div className="settings__wrapper settings">
      <div className="settings__notice notice">
        <h2 className="settings__title">Настройки уведомлений</h2>
        <div className="notice__item">
          <div className="notice__text">
            <p className="notice__title">Отзывы</p>
            <p className="notice__description">Новые отзывы о вас</p>
          </div>
          <label className="notice__checkbox">
            <input type="checkbox" className="notice__input" />
            <div className="notice__slider"></div>
          </label>
        </div>
        <div className="notice__item">
          <div className="notice__text">
            <p className="notice__title">Новости</p>
            <p className="notice__description">
              Новости о новых функциях агрегатора
            </p>
          </div>
          <label className="notice__checkbox">
            <input type="checkbox" className="notice__input" />
            <div className="notice__slider"></div>
          </label>
        </div>
      </div>
      <div className="settings__password password">
        <span className="settings__title">Изменить пароль</span>
        <input type="password" placeholder="Старый пароль" />
        <input type="password" placeholder="Новый пароль" />
      </div>
      <div className="settings__control control">
        <p className="control__date">Вы с нами с 01.12.1023</p>
        <div className="control__buttons">
          <button onClick={handleLogout} className="control__button">
            Выйти из аккаунта
          </button>
          {/* <button className="control__button">Удалить учетную запись</button> */}
        </div>
      </div>
    </div>
  );
};

export default SettingsInfo;
