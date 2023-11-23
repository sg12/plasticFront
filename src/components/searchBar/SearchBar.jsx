import { useState } from 'react';
import searchIcon from '../../assets/icons/search.png';
import "./SearchBar.scss"

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {   
        console.log(`Вы ищете: ${searchTerm}`);
    };

    return (
        <div className="search_bar">
            <div className="search_container">
            <input
                type="text"
                placeholder="поиск врача, услуги, клиники..."
                value={searchTerm}
                onChange={handleInputChange}
            />
            <button className="search_container__button" onClick={handleSearchClick}>
                <img src={searchIcon} alt="Search" />
            </button>
            </div>
        </div>
    );
};
export default SearchBar;
