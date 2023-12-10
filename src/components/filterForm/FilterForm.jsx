// FilterForm.js
import React from "react";
import OutlineButton from "../UI/button/outlineButton/OutlineButton";

const FilterForm = ({
  filter,
  handleFilterChange,
  applyFilter,
  clearFilter,
  commonOptions,
}) => {
  return (
    <div className="filter__popup popup-content" id="popupFilter">
      {Object.keys(commonOptions).map((key) => (
        <label className="filter-popup__label" key={key}>
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
            className="filter-popup__select"
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
      <OutlineButton
        type="button"
        onClick={applyFilter}
      >
        Применить фильтр
      </OutlineButton>
      <OutlineButton
        type="button"
        onClick={clearFilter}
      >
        Сбросить фильтры
      </OutlineButton>
    </div>
  );
};

export default FilterForm;
