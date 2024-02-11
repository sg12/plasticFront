import "./SupportInfo.scss";

const SupportInfo = () => {
  return (
    <div className="support">
      <span className="support__title">Обращение в службу поддержки</span>
      <span className="support__subtitle">Заполните форму</span>
      <form className="support__form" action="">
        {/* <div className="support__form-email">
          <label htmlFor="">Почта</label>
          <input type="text" placeholder="Введите вашу почту" />
        </div> */}
        {/* <div className="support__form-link">
          <label htmlFor="">Ссылка</label>
          <input type="text" placeholder="Ссылка на ваш профиль" />
        </div> */}
        <div className="support__form-request">
          <label htmlFor="">Тема запроса</label>
          <input type="text" placeholder="Какая проблема?" />
        </div>
        <div className="support__form-details">
          <label htmlFor="">Технические детали</label>
          <input type="text" placeholder="Название, версия браузера" />
        </div>
        <div className="support__form-description">
          <label htmlFor="">Описание сути запроса</label>
          <input type="text" placeholder="Опишите суть запроса" />
        </div>
        {/* <div className="support__form-status">
          <label htmlFor="">Ваш статус</label>
          <input type="text" placeholder="Пациент, доктор, клиника" />
        </div> */}
      </form>
      <form className="support__button" action="">
        <input
          type="file"
          className="support__button-upload"
        />
        <button type="submit" className="support__button-send">
          Отправить
        </button>
      </form>
    </div>
  );
};

export default SupportInfo;
