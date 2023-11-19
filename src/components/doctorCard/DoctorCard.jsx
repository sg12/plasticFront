// DoctorCard.js
import React from "react";
import RenderStar from "../renderStars/RenderStar";

const DoctorCard = ({ doctor, displayedDoctors }) => {
  return (
    <div className="filter__cards cards-doctor" key={displayedDoctors}>
      <div className="filter__info">
        <img className="card__img" src={doctor.photoPath} alt={doctor.name} />
        <RenderStar />
        <span>{RenderStar(doctor.rating)}</span>
        <span>
          {doctor.numberOfReviews} отзыва / {doctor.rating} звёзд
        </span>
      </div>
      <div className="filter__info">
        <div className="info__up">
          <h2>
            {doctor.name} {/* ({doctor.gender})*/}{" "}
          </h2>
          <div>
            <h4>
              Стаж{" "}
              {doctor.experience >= 5
                ? `${doctor.experience} лет`
                : `${doctor.experience} года`}
            </h4>
            <p>{doctor.category}</p>
            <p>{doctor.academicDegree}</p>
          </div>
        </div>
        <div className="info__down"></div>
      </div>
      <div className="filter_info">
        <div className="info__up">
          <h2>Клиника “Елена” на Сакко и Ванцетти</h2>
          <h4>ул. Сакко и Ванцетти, д. 77</h4>
          <ul>
            <li>Октябрьская (300 м)</li>
            <li>Березовая роща (1.3 км)</li>
          </ul>
        </div>
        <div className="info__down">
          <h4>Запись на приём: ( {doctor.admissionType} )</h4>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="29"
              height="26"
              viewBox="0 0 29 26"
              fill="none"
            >
              <path
                d="M4.17392 13.9368L8.65779 9.06449C9.11535 8.53983 9.34413 8.27747 9.46404 7.98325C9.57013 7.72291 9.61401 7.44567 9.5929 7.1693C9.56903 6.85698 9.43063 6.5484 9.15384 5.93125L8.098 3.57716C7.68838 2.66386 7.48356 2.2072 7.13024 1.90788C6.8189 1.64412 6.42876 1.46622 6.00672 1.39555C5.52776 1.31534 4.99276 1.43464 3.92273 1.67321L1 2.32495C1 15.5744 11.399 24.8491 26.2558 24.8491L26.9861 22.2421C27.2537 21.2878 27.3874 20.8106 27.2975 20.3835C27.2182 20.0072 27.0188 19.6591 26.723 19.3816C26.3874 19.0664 25.8753 18.8838 24.8512 18.5185L22.4958 17.6781C21.7063 17.3965 21.3116 17.2557 20.918 17.2449C20.5701 17.2354 20.2247 17.2986 19.9091 17.4295C19.5521 17.5778 19.2516 17.8458 18.6504 18.382L14.1143 22.4288M15.8559 6.2998C17.3071 6.55229 18.6406 7.18521 19.686 8.11755C20.7314 9.04988 21.4411 10.2392 21.7241 11.5333M15.8559 1C18.8707 1.2987 21.6819 2.50272 23.8282 4.41441C25.9744 6.32609 27.3279 8.83179 27.6667 11.5201"
                stroke="#2BAD47"
                strokeWidth="1.91489"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            + 7 999 999 99-99
          </span>
          <h4>Стоимость приёма: 4 000 руб.</h4>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
