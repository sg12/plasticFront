import React, { useEffect, useState } from "react";

import FilterForm from "../filterForm/FilterForm";
import SortOptions from "../sortOptions/SortOptions";
import DoctorCard from "../doctorCard/DoctorCard";
import doctorsData from "./DoctorData";
import MyButton from "../UI/button/MyButton";

import "./FilterDoctor.scss";

const FilterDoctor = () => {
  const [displayedDoctors, setDisplayedDoctors] = useState(2);
  const [allDoctorsDisplayed, setAllDoctorsDisplayed] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortReviews, setSortReviews] = useState("desc");
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
    if (displayedDoctors + 3 >= filter.filteredDoctors.length) {
      setAllDoctorsDisplayed(true);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
    sortDoctors(filter.filteredDoctors);
  };

  const toggleSortReviews = () => {
    setSortReviews((prevReviews) => (prevReviews === "desc" ? "asc" : "desc"));
    sortDoctorsReviews(filter.filteredDoctors);
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
    if (popupFilter) {
      popupFilter.style.display = isFilterPopupOpen ? "flex" : "none";
    }
  }, [isFilterPopupOpen]);

  useEffect(() => {
    const popupSort = document.getElementById("popupSort");
    if (popupSort) {
      popupSort.style.display = isSortPopupOpen ? "flex" : "none";
    }
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

  const sortDoctors = (doctors) => {
    const sortedDoctors = [...doctors];
    if (sortOrder === "desc") {
      sortedDoctors.sort((a, b) => b.rating - a.rating);
    } else {
      sortedDoctors.sort((a, b) => a.rating - b.rating);
    }

    setFilter((prevFilter) => ({
      ...prevFilter,
      filteredDoctors: sortedDoctors,
    }));
  };

  const sortDoctorsReviews = (doctors) => {
    const sortedDoctorsReviews = [...doctors];
    if (sortReviews === "desc") {
      sortedDoctorsReviews.sort(
        (a, b) => b.numberOfReviews - a.numberOfReviews
      );
    } else {
      sortedDoctorsReviews.sort(
        (a, b) => a.numberOfReviews - b.numberOfReviews
      );
    }

    setFilter((prevFilter) => ({
      ...prevFilter,
      filteredDoctors: sortedDoctorsReviews,
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
    const filteredDoctors = filterDoctors();
    const sortedDoctors = sortDoctors(filteredDoctors);

    setFilter((prevFilter) => ({
      ...prevFilter,
      filteredDoctors: sortedDoctors,
    }));
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
        <h2 className="filter__title title-h2">
          Рейтинг пластических хирургов{" "}
        </h2>
        <div className="filter__buttons">
          <MyButton
            type="button"
            onClick={toggleFilterPopup}
          >
            Фильтр
          </MyButton>
          <hr className="filter__buttons-hr" />
          <MyButton
            type="button"
            onClick={toggleSortPopup}
          >
            Сортировка
          </MyButton>
        </div>
        <FilterForm
          filter={filter}
          handleFilterChange={handleFilterChange}
          applyFilter={applyFilter}
          clearFilter={clearFilter}
          commonOptions={commonOptions}
        />
        <SortOptions
          sortOrder={sortOrder}
          sortReviews={sortReviews}
          toggleSortOrder={toggleSortOrder}
          toggleSortReviews={toggleSortReviews}
        />
        <div className="filter__cards">
          {filter.filteredDoctors
            .slice(0, displayedDoctors)
            .map((doctor, displayedDoctors) => (
              <DoctorCard
                key={displayedDoctors}
                doctor={doctor}
                displayedDoctors={displayedDoctors}
              />
            ))}
          {!allDoctorsDisplayed &&
            displayedDoctors < filter.filteredDoctors.length && (
              <div className="filter__cards-next">
                <MyButton
                  onClick={displayMoreDoctors}
                >
                  Показать ещё
                </MyButton>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default FilterDoctor;
