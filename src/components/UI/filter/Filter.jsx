import styles from "./Filter.module.scss";

const Filter = ({ filter, onFilterChange, filters, label }) => {
  return (
    <div className={styles.filter}>
      <label className={styles.filter__label}>
        <span className={styles.filter__text}>{label}</span>
        <select
          className={styles.filter__select}
          value={filter}
          onChange={onFilterChange}
        >
          {filters?.map((filterOption, index) => (
            <option
              className={styles.filter__option}
              key={index}
              value={filterOption.value}
            >
              {filterOption.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Filter;
