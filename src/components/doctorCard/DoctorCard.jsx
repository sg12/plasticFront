// DoctorCard.js
import React from "react";
import RenderStar from "../renderStars/RenderStar";

const DoctorCard = ({ doctor, displayedDoctors }) => {
  return (
    <div className="doctor-card filter__cards cards-doctor" key={displayedDoctors}>
      <div className="doctor-card__info filter__info">
        <img className="doctor-card__info__img" src={doctor.photoPath} alt={doctor.name} />
        <RenderStar />
        <span className="doctor-card__rating">{RenderStar(doctor.rating)}</span>
        <span className="doctor-card__review-info">
          {doctor.numberOfReviews} отзыва / {doctor.rating} звёзд
        </span>
      </div>
      <div className="doctor-card__info filter__info">
        <div className="doctor-card__up info__up">
          <h2 className="doctor-card__info__up-name">
            {doctor.name} {/* ({doctor.gender})*/}
          </h2>
          <div>
            <h4 className="doctor-card__experience">
              Стаж{" "}
              {doctor.experience >= 5
                ? `${doctor.experience} лет`
                : `${doctor.experience} года`}
            </h4>
            <p className="doctor-card__category">{doctor.category}</p>
            <p className="doctor-card__academic-degree">{doctor.academicDegree}</p>
          </div>
        </div>
        <div className="doctor-card__down info__down"></div>
      </div>
      <div className="doctor-card__info filter__info">
        <div className="doctor-card__up info__up">
          <h2 className="doctor-card__info__up-name">Клиника “Елена” на Сакко и Ванцетти</h2>
          <h4 className="doctor-card__clinic-address">ул. Сакко и Ванцетти, д. 77</h4>
          <ul className="doctor-card__clinic-ul">
            <li>Октябрьская (300 м)</li>
            <li>Березовая роща (1.3 км)</li>
          </ul>
        </div>
        <div className="doctor-card__down info__down">
          <h4 className="doctor-card__admission-type">Запись на приём: ( {doctor.admissionType} )</h4>
          <span className="doctor-card__phone-number">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="29"
              height="26"
              viewBox="0 0 29 26"
              fill="none"
            >
              {/* SVG path goes here */}
            </svg>
            + 7 999 999 99-99
          </span>
          {/* <h4 className="doctor-card__appointment-cost">Стоимость приёма: 4 000 руб.</h4> */}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
