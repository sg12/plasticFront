import React, { useEffect, useState } from "react";
import doctorsData from "./DoctorData";

import "./FilterDoctor.scss";

const FilterDoctor = () => {
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
          <button type="button" onClick={applyFilter}>
            Применить фильтр
          </button>
          <button type="button" onClick={clearFilter}>
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
          {filter.filteredDoctors.map((doctor) => (
            <div className="filter__cards cards-doctor" key={doctor.id}>
              <div className="filter__info">
                <img
                  className="card__img"
                  src={doctor.photoPath}
                  alt={doctor.name}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="151"
                  height="34"
                  viewBox="0 0 151 34"
                  fill="none"
                >
                  <path
                    d="M15.722 3.77926C16.1041 2.60312 17.768 2.60312 18.1502 3.77926L20.3754 10.6279C20.5463 11.1539 21.0365 11.51 21.5896 11.51H28.7906C30.0273 11.51 30.5415 13.0925 29.541 13.8194L23.7152 18.052C23.2678 18.3771 23.0805 18.9533 23.2514 19.4793L25.4767 26.3279C25.8588 27.5041 24.5127 28.4821 23.5122 27.7552L17.6864 23.5225C17.239 23.1975 16.6331 23.1975 16.1857 23.5225L10.3599 27.7552C9.35945 28.4821 8.01331 27.5041 8.39546 26.3279L10.6207 19.4793C10.7916 18.9533 10.6044 18.3771 10.157 18.052L4.33118 13.8194C3.33069 13.0925 3.84488 11.51 5.08154 11.51H12.2826C12.8357 11.51 13.3258 11.1539 13.4967 10.6279L15.722 3.77926Z"
                    fill="#FF6767"
                  />
                  <path
                    d="M45.0835 3.77926C45.4657 2.60312 47.1296 2.60312 47.5118 3.77926L49.737 10.6279C49.9079 11.1539 50.3981 11.51 50.9511 11.51H58.1522C59.3889 11.51 59.903 13.0925 58.9025 13.8194L53.0768 18.052C52.6293 18.3771 52.4421 18.9533 52.613 19.4793L54.8383 26.3279C55.2204 27.5041 53.8743 28.4821 52.8738 27.7552L47.048 23.5225C46.6006 23.1975 45.9947 23.1975 45.5473 23.5225L39.7215 27.7552C38.721 28.4821 37.3749 27.5041 37.757 26.3279L39.9823 19.4793C40.1532 18.9533 39.966 18.3771 39.5185 18.052L33.6927 13.8194C32.6923 13.0925 33.2064 11.51 34.4431 11.51H41.6442C42.1972 11.51 42.6874 11.1539 42.8583 10.6279L45.0835 3.77926Z"
                    fill="#FF6767"
                  />
                  <path
                    d="M74.4454 3.77926C74.8275 2.60312 76.4914 2.60312 76.8736 3.77926L79.0988 10.6279C79.2697 11.1539 79.7599 11.51 80.3129 11.51H87.514C88.7507 11.51 89.2648 13.0925 88.2644 13.8194L82.4386 18.052C81.9912 18.3771 81.8039 18.9533 81.9748 19.4793L84.2001 26.3279C84.5822 27.5041 83.2361 28.4821 82.2356 27.7552L76.4098 23.5225C75.9624 23.1975 75.3565 23.1975 74.9091 23.5225L69.0833 27.7552C68.0828 28.4821 66.7367 27.5041 67.1188 26.3279L69.3441 19.4793C69.515 18.9533 69.3278 18.3771 68.8803 18.052L63.0546 13.8194C62.0541 13.0925 62.5683 11.51 63.8049 11.51H71.006C71.559 11.51 72.0492 11.1539 72.2201 10.6279L74.4454 3.77926Z"
                    fill="#FD5050"
                  />
                  <path
                    d="M103.807 3.77926C104.189 2.60312 105.853 2.60312 106.235 3.77926L108.46 10.6279C108.631 11.1539 109.121 11.51 109.675 11.51H116.876C118.112 11.51 118.626 13.0925 117.626 13.8194L111.8 18.052C111.353 18.3771 111.166 18.9533 111.336 19.4793L113.562 26.3279C113.944 27.5041 112.598 28.4821 111.597 27.7552L105.771 23.5225C105.324 23.1975 104.718 23.1975 104.271 23.5225L98.4449 27.7552C97.4444 28.4821 96.0983 27.5041 96.4804 26.3279L98.7057 19.4793C98.8766 18.9533 98.6893 18.3771 98.2419 18.052L92.4161 13.8194C91.4157 13.0925 91.9298 11.51 93.1665 11.51H100.368C100.921 11.51 101.411 11.1539 101.582 10.6279L103.807 3.77926Z"
                    fill="#FF6767"
                  />
                  <path
                    d="M133.169 3.77926C133.551 2.60312 135.215 2.60312 135.597 3.77926L137.822 10.6279C137.993 11.1539 138.483 11.51 139.036 11.51H146.237C147.474 11.51 147.988 13.0925 146.988 13.8194L141.162 18.052C140.715 18.3771 140.527 18.9533 140.698 19.4793L142.923 26.3279C143.306 27.5041 141.959 28.4821 140.959 27.7552L135.133 23.5225C134.686 23.1975 134.08 23.1975 133.632 23.5225L127.807 27.7552C126.806 28.4821 125.46 27.5041 125.842 26.3279L128.067 19.4793C128.238 18.9533 128.051 18.3771 127.604 18.052L121.778 13.8194C120.777 13.0925 121.292 11.51 122.528 11.51H129.729C130.282 11.51 130.773 11.1539 130.943 10.6279L133.169 3.77926Z"
                    fill="#FD5050"
                  />
                </svg>
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
        </div>
      </div>
    </section>
  );
};

export default FilterDoctor;
