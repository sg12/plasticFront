import React, { useEffect, useState } from "react";
import doctorsData from "./DoctorData";
import RenderStar from "./RenderStar";

import "./FilterDoctor.scss";

const FilterDoctor = () => {
  const [displayedDoctors, setDisplayedDoctors] = useState(2);
  const [allDoctorsDisplayed, setAllDoctorsDisplayed] = useState(false);

  const [filter, setFilter] = useState({
    experience: "",
    gender: "",
    category: "",
    academicDegree: "",
    rating: "",
    numberOfReviews: "",
    admissionType: "",
    filteredDoctors: doctorsData,
  });

  const displayMoreDoctors = () => {
    setDisplayedDoctors(displayedDoctors + 3);
  };

  // POPUP
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [isSortPopupOpen, setIsSortPopupOpen] = useState(false);

  const toggleFilterPopup = () => {
    setIsFilterPopupOpen((prevState) => !prevState);
  };

  const toggleSortPopup = () => {
    setIsSortPopupOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const popupFilter = document.getElementById("popupFilter");
    popupFilter.style.display = isFilterPopupOpen ? "block" : "none";
  }, [isFilterPopupOpen]);

  useEffect(() => {
    const popupSort = document.getElementById("popupSort");
    popupSort.style.display = isSortPopupOpen ? "block" : "none";
  }, [isSortPopupOpen]);
  // END POPUP

  // Чистка фильтров
  const clearFilter = () => {
    setFilter({
      experience: "",
      gender: "",
      category: "",
      academicDegree: "",
      rating: "",
      numberOfReviews: "",
      admissionType: "",
      filteredDoctors: doctorsData,
    });
    toggleFilterPopup();
  };
  // END Чистка фильтров

  // Параметры фильтрация
  const filterDoctors = () => {
    const filteredDoctors = doctorsData.filter((doctor) => {
      const isExperienceMatch =
        filter.experience === "" ||
        (filter.experience === "Не более 5 лет" && doctor.experience < 5) ||
        (filter.experience === "От 5 до 10 лет" &&
          doctor.experience >= 5 &&
          doctor.experience <= 10) ||
        (filter.experience === "От 10 до 20 лет" &&
          doctor.experience >= 10 &&
          doctor.experience <= 20) ||
        (filter.experience === "Свыше 20 лет" && doctor.experience > 20);

      const isGenderMatch =
        filter.gender === "" || doctor.gender === filter.gender;
      const isCategoryMatch =
        filter.category === "" || doctor.category === filter.category;
      const isAcademicDegreeMatch =
        filter.academicDegree === "" ||
        doctor.academicDegree === filter.academicDegree;
      const isRatingMatch =
        filter.rating === "" || doctor.rating >= parseFloat(filter.rating);

      const isNumberOfReviewsMatch =
        filter.numberOfReviews === "" ||
        (filter.numberOfReviews === "Меньше 50" &&
          doctor.numberOfReviews < 50) ||
        (filter.numberOfReviews === "50-100" &&
          doctor.numberOfReviews >= 50 &&
          doctor.numberOfReviews <= 100) ||
        (filter.numberOfReviews === "Больше 100" &&
          doctor.numberOfReviews > 100);

      const isAdmissionTypeMatch =
        filter.admissionType === "" ||
        doctor.admissionType === filter.admissionType;

      return (
        isExperienceMatch &&
        isGenderMatch &&
        isCategoryMatch &&
        isAcademicDegreeMatch &&
        isRatingMatch &&
        isNumberOfReviewsMatch &&
        isAdmissionTypeMatch
      );
    });

    setFilter((prevFilter) => ({
      ...prevFilter,
      filteredDoctors: filteredDoctors,
    }));
  };
  // END Параметры фильтрация

  const handleFilterChange = (e, key) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: e.target.value === "Все" ? "" : e.target.value,
    }));
  };

  const applyFilter = () => {
    filterDoctors();
    toggleFilterPopup();
  };

  const commonOptions = {
    experience: [
      "Все",
      "Не более 5 лет",
      "От 5 до 10 лет",
      "От 10 до 20 лет",
      "Свыше 20 лет",
    ],
    gender: ["Все", "Мужской", "Женский"],
    category: [
      "Все",
      "Первая категория",
      "Вторая категория",
      "Высшая категория",
    ],
    academicDegree: [
      "Все",
      "Кандидат медицинских наук",
      "Доктор медицинских наук",
      "Профессор",
    ],
    rating: ["Все", "4.5", "4"],
    numberOfReviews: ["Все", "Меньше 50", "50-100", "Больше 100"],
    admissionType: ["Все", "Клиника", "Онлайн", "На дому"],
  };

  return (
    <section className="filter">
      <div className="filter__container container">
        <b>Количество врачей: {filter.filteredDoctors.length}</b>
        <h2 className="filter__title title-h2">Рейтинг хирургов</h2>
        <div className="filter__buttons filter-buttons">
          <button
            className="filter-buttons__button"
            type="button"
            onClick={toggleFilterPopup}
          >
            Фильтр
          </button>
          <button className="filter-buttons__button" type="button">
            Дата
          </button>
          <button
            className="filter-buttons__button"
            type="button"
            onClick={toggleSortPopup}
          >
            Сортировка
          </button>
          <button className="filter-buttons__button" type="button">
            Показать на карте
          </button>
        </div>
        <div className="filter__popup popup-content" id="popupFilter">
          {Object.keys(commonOptions).map((key) => (
            <label key={key}>
              {key === "experience"
                ? "Стаж:"
                : key === "gender"
                ? "Пол:"
                : key === "category"
                ? "Категория:"
                : key === "academicDegree"
                ? "Ученая степень:"
                : key === "rating"
                ? "Оценка:"
                : key === "numberOfReviews"
                ? "Количество отзывов:"
                : "Тип приёма"}
              <select
                placeholder="Все"
                value={filter[key]}
                onChange={(e) => handleFilterChange(e, key)}
              >
                {commonOptions[key].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button
            className="filter-buttons__button"
            type="button"
            onClick={applyFilter}
          >
            Применить фильтр
          </button>
          <button
            className="filter-buttons__button"
            type="button"
            onClick={clearFilter}
          >
            Сбросить фильтры
          </button>
        </div>
        <select
          size={3}
          className="filter__popup popup-content"
          id="popupSort"
          onChange={(e) => console.log("Выбранная опция:", e.target.value)}
        >
          <option value="High rating">Высокий рейтинг</option>
          <option value="Low rating">Низкий рейтинг</option>
          <option value="Lots of reviews">Много отзывов</option>
        </select>
        <div className="filter__cards">
          {filter.filteredDoctors
            .slice(0, displayedDoctors)
            .map((doctor, index) => (
              <div className="filter__cards cards-doctor" key={index}>
                <div className="filter__info">
                  <img
                    className="card__img"
                    src={doctor.photoPath}
                    alt={doctor.name}
                  />
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
                  </div>
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
                    <button>Посмотреть расписание</button>
                    <h4>Стоимость приёма: 4 000 руб.</h4>
                  </div>
                </div>
              </div>
            ))}
          {!allDoctorsDisplayed &&
            displayedDoctors < filter.filteredDoctors.length && (
              <button
                className="filter-buttons__button"
                onClick={displayMoreDoctors}
              >
                Показать ещё
              </button>
            )}
        </div>
      </div>
    </section>
  );
};

export default FilterDoctor;
