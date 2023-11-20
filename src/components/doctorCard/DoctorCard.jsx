// DoctorCard.js
import React from "react";
import RenderStar from "../renderStars/RenderStar";

const DoctorCard = ({ doctor, displayedDoctors }) => {
  return (
    <div className="filter__card filter-card" key={displayedDoctors}>
      <div className="filter-card__info">
        <img className="filter-card__img" src={doctor.photoPath} alt={doctor.name} />
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
          <b>ТИП ПРИЕМА</b>
        </div>
      </div>
      <div className="filter-card__info">
        <div className="filter-card__up">
          <h2 className="filter-card__clinic">Клиника “Елена” на Сакко и Ванцетти</h2>
          <h4 className="filter-card__address">ул. Сакко и Ванцетти, д. 77</h4>
          <ul className="filter-card__list">
            <li className="filter-card__item">Октябрьская (300 м)</li>
            <li className="filter-card__item">Березовая роща (1.3 км)</li>
          </ul>
        </div>
        <div className="filter-card__down">
          <h4 className="filter-card__admission">Запись на приём: ( {doctor.admissionType} )</h4>
          <span className="filter-card__phone">
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
          <h4 className="filter-card__cost">Стоимость приёма: 4 000 руб.</h4>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
