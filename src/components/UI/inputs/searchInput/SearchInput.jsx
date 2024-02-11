import classes from "./SearchInput.module.css";

const Search = ({placeholder, onSearch}) => {
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    onSearch(searchTerm);
  };

  return (
    <form >
      <input
        type="search"
        placeholder={placeholder || "Поиск"}
        className={classes.search}
        onChange={handleSearch}
      />
    </form>
  );
};

export default Search;
