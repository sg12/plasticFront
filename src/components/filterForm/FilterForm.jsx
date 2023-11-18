// FilterForm.js
import React from "react";

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
  );
};

export default FilterForm;
