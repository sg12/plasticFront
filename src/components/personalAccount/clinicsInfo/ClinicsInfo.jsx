import { useUser } from "../../../context/UserContext";

import "./ClinicsInfo.scss";

import Divider from "../../UI/dividers/Divider";
import Tag from "../../UI/tags/Tag";

const ClinicsInfo = () => {
  const { userData } = useUser();

  return (
    <div className="clinic">
      <span className="clinic__title">Ваша клиника</span>
      {userData?.clinic ? (
        <ClinicCard userData={userData} />
      ) : (
        <span className="clinic__subtitle">Нет активной клиники</span>
      )}
    </div>
  );
};

const ClinicCard = ({ userData }) => {
  return (
    <div className="clinic__card">
      <span className="clinic__card-title">
        {userData?.clinic?.name || "Название клиники"}
      </span>
      <Divider />
      <div className="clinic__card-info">
        <div className="clinic__card-logo">
          <img src="" alt="clinic logo" />
        </div>
        <div className="clinic__card-personal">
          <div className="clinic__card-about">
            <span className="clinic__card-subtitle">Руководитель:</span>
            {userData?.clinic?.director || "Неизвестно"}
          </div>
          <div className="clinic__card-about">
            <span className="clinic__card-subtitle">Адрес:</span>
            {userData?.clinic?.address || "Неизвестно"}
          </div>
        </div>
      </div>
      <Divider />
      <div className="clinic__card-cards">
        <Tag label={`Статус: ${userData?.clinic?.status || "Неизвестно"}`} />
        <Tag label={`Должность: ${userData?.specialization || "Неизвестно"}`} />
      </div>
    </div>
  );
};

export default ClinicsInfo;
