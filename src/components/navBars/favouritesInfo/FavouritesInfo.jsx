import { useState } from "react";
import { useUser } from "../../../context/UserContext";
// import Search from "../../UI/inputs/searchInput/SearchInput";
import CardsItem from "../cardsItem/cardsItem";

import "./FavouritesInfo.scss";
import FilterModal from "../../UI/modals/filterModal/FilterModal";

const FavouritesInfo = () => {
  const { userData } = useUser();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState([
    { id: 1, type: "doctor", username: "Ирина", direction: "Все напраление" },
    { id: 2, type: "doctor", username: "Елена", direction: "Ринопластика" },
    { id: 3, type: "clinic", username: "Никита", direction: "Ринопластика" },
    { id: 4, type: "clinic", username: "Андрей", direction: "Ринопластика" },
    { id: 5, type: "doctor", username: "Татьяна", direction: "Ринопластика" },
    { id: 6, type: "doctor", username: "Алёна", direction: "Ринопластика" },
    { id: 7, type: "clinic", username: "Сергей", direction: "Ринопластика" },
    { id: 8, type: "doctor", username: "Валерия", direction: "Ринопластика" },
  ]);

  const removeFromFavorites = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((favorite) => favorite.id !== id)
    );
  };

  return (
    <div className="favourites">
      <span className="favourites__title">Избранное</span>
      <div>
        <button className="favourites__button-filter" onClick={() => setIsFilterOpen(!isFilterOpen)}>Фильтры</button>
        {isFilterOpen && (
          <FilterModal
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            style="right"
            animationEnabled={true}
            animationTime={400}
          />
        )}
      </div>
      {favorites.length > 0 ? (
        <CardsItem
          isFavorite={true}
          userData={userData}
          favorites={favorites}
          removeFromFavorites={removeFromFavorites}
        />
      ) : (
        <span className="favourites__noCards">Нет избранных карточек</span>
      )}
    </div>
  );
};

export default FavouritesInfo;
