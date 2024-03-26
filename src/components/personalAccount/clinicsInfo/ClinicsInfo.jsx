import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import "./ClinicsInfo.scss";

const ClinicsInfo = () => {
  const { userData } = useUser();
  const [hasDoctorCard, setHasDoctorCard] = useState(false);

  return (
    <div className="clinic">
      <span className="clinic__title">Ваша клиника</span>
      {hasDoctorCard ? (
        <ClinicCard userData={userData}/>
      ) : (
        <span className="clinic__subtitle">
          Руководитель клиники может добавить Вас в список своих специалистов,
          указав у себя в профиле Ваш ID
        </span>
      )}
    </div>
  );
};

const ClinicCard = ({ userData }) => {
  return (
    <div className="clinic-card">
      <div className="clinic-card__block">
        <span className="clinic-card__block-name">Клиника "Ольга"</span>
        <div className="clinic-card__block-control">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4.98273 13C4.43571 13.0048 4 12.5513 4 12.0022C4 11.4454 4.43921 11.0073 4.96924 11.0001L4.97822 11C5.51861 11 5.95645 11.4476 5.95645 12C5.95645 12.5509 5.52104 12.9975 4.98273 13ZM4.98273 13L4.98721 12.9999M4.98273 13L4.97822 13M11.5045 13C10.9575 13.0048 10.5218 12.5513 10.5218 12.0022C10.5218 11.4454 10.961 11.0073 11.491 11.0001L11.5 11C12.0404 11 12.4782 11.4476 12.4782 12C12.4782 12.5509 12.0428 12.9975 11.5045 13ZM11.5045 13L11.509 12.9999M11.5045 13L11.5 13M18.0263 13C17.4793 13.0048 17.0436 12.5513 17.0436 12.0022C17.0436 11.4454 17.4828 11.0073 18.0128 11.0001L18.0218 11C18.5622 11 19 11.4476 19 12C19 12.5509 18.5646 12.9975 18.0263 13ZM18.0263 13L18.0308 12.9999M18.0263 13L18.0218 13"
              stroke="#3066BE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <hr className="clinic-card__divider" />
      <div className="clinic-card__info">
        <div className="clinic-card__info-logo">
          <img src="" alt="Logo Clinic" />
        </div>
        <div className="clinic-card__info-personal">
          <div className="clinic-card__info-personal-position">
            <span className="clinic-card__info-personal-position-text">
              Руководитель
            </span>
            <span className="clinic-card__info-personal-position-director">
              Директор: Ольга Ивановна
              {/* {userData.name} */}
            </span>
          </div>
          <div className="clinic-card__info-personal-address">
            <span className="clinic-card__info-personal-address-text">
              Адрес
            </span>
            <span className="clinic-card__info-personal-address-street">
              ул. Пушкина, д. 17
              {/* {userData.address.street} */}
            </span>
          </div>
        </div>
      </div>
      <hr className="clinic-card__divider" />
      <div className="clinic-card__status">
        <span className="clinic-card__status-text">Ваш статус в клинике</span>
        <span className="clinic-card__status-status">Активный</span>
      </div>
      <div className="clinic-card__position">
        <span className="clinic-card__position-text">Ваша должность</span>
        <span className="clinic-card__position-position">
          Пластический хирург
        </span>
      </div>
    </div>
  );
};

export default ClinicsInfo;
