// DoctorCard.js
import React from "react";
import RenderStar from "../renderStars/RenderStar";

const DoctorCard = ({ doctor, displayedDoctors }) => {
  return (
    <div className="filter__card filter-card" key={displayedDoctors}>
      <div className="filter-card__info">
        <img
          className="filter-card__img"
          src={doctor.photoPath}
          alt={doctor.name}
        />
        <RenderStar />
        <span className="filter-card__rating">{RenderStar(doctor.rating)}</span>
        <span className="filter-card__review">
          {doctor.numberOfReviews} отзыва / {doctor.rating} звёзд
        </span>
      </div>
      <div className="filter-card__info">
        <div className="filter__up filter-up">
          <h2 className="filter-up__name">
            {doctor.name} {/* ({doctor.gender})*/}
          </h2>
          <h4 className="filter-up__experience">
            Стаж{" "}
            {doctor.experience >= 5
              ? `${doctor.experience} лет`
              : `${doctor.experience} года`}
          </h4>
          <p className="filter-up__category">{doctor.category}</p>
          <p className="filter-up__degree">{doctor.academicDegree}</p>
        </div>
        <div className="filter-card__down">
          <b>Тип приёма</b>
          <ul className="filter-card__visit filter-visit">
            <li className="filter-visit__home">Дома</li>
            <li className="filter-visit__clinic">В клинике</li>
          </ul>
        </div>
      </div>
      <div className="filter-card__info">
        <div className="filter-card__up">
          <h2 className="filter-card__clinic">
            Клиника “Елена” на Сакко и Ванцетти
          </h2>
          <h4 className="filter-card__address">ул. Сакко и Ванцетти, д. 77</h4>
          <ul className="filter-card__list">
            <li className="filter-card__item">Октябрьская (300 м)</li>
            <li className="filter-card__item">Березовая роща (1.3 км)</li>
          </ul>
        </div>
        <div className="filter-card__down">
          <b className="filter-card__admission">
            Запись на приём: ( {doctor.admissionType} )
          </b>
          <span className="filter-card__phone">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="29"
              height="26"
              viewBox="0 0 29 26"
              fill="none"
            >
              <path
                d="M3.97555 12.9338L8.17917 8.43923C8.60814 7.95524 8.82262 7.71323 8.93504 7.44182C9.03449 7.20167 9.07564 6.94592 9.05585 6.69097C9.03346 6.40287 8.90371 6.11821 8.64422 5.54892L7.65437 3.37734C7.27036 2.53485 7.07833 2.1136 6.7471 1.83749C6.45522 1.59418 6.08946 1.43008 5.6938 1.36488C5.24478 1.29089 4.74321 1.40094 3.74006 1.62101L1 2.22222C1 14.4444 10.749 23 24.6773 23L25.362 20.5952C25.6128 19.7148 25.7382 19.2747 25.6539 18.8806C25.5795 18.5335 25.3926 18.2124 25.1153 17.9564C24.8007 17.6656 24.3206 17.4972 23.3605 17.1602L21.1523 16.385C20.4122 16.1252 20.0421 15.9953 19.6732 15.9854C19.347 15.9766 19.0231 16.0349 18.7273 16.1557C18.3926 16.2924 18.1109 16.5397 17.5472 17.0343L13.2946 20.7674M14.9274 5.88889C16.2879 6.12181 17.538 6.70565 18.5181 7.5657C19.4982 8.42575 20.1636 9.52287 20.4289 10.7167M14.9274 1C17.7538 1.27554 20.3893 2.38621 22.4015 4.14968C24.4135 5.91314 25.6824 8.22457 26 10.7044"
                stroke="#3066BE"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            + 7 999 999 99-99
          </span>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
