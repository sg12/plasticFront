import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
// import Search from "../../UI/inputs/searchInput/SearchInput";
import CardsItem from "../cardsItem/CardsItem";

import "./FavouritesInfo.scss";
import FilterModal from "../../UI/modals/filterModal/FilterModal";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import PlasticServices from "../../../services/PlasticServices";
import { useFetching } from "../../../hooks/useFetching";
import Spinner from "../../UI/preloader/Spinner";

const FavouritesInfo = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [favorites, setFavorites] = useState([]);

  const [fetchFavorites, isFavoritesLoading, favoritesError] = useFetching(
    async () => {
      const response = await PlasticServices.getFavorities();
      return setFavorites(response.data);
    }
  );

  useEffect(() => {
    fetchFavorites();
  }, []);

  const filteredFavorites = favorites.filter((favorite) => {
    const usernameMatch = favorite.username
      .toLowerCase()
      .includes(filterValue.toLowerCase());
    const directionMatch = favorite.direction
      .toLowerCase()
      .includes(filterValue.toLowerCase());

    return usernameMatch || directionMatch;
  });

  const removeFromFavorites = async (id) => {
    await PlasticServices.deleteFavorities(id);
  };

  return (
    <div className="favourites">
      <span className="favourites__title">Избранное</span>
      {favoritesError}
      {isFavoritesLoading ? (
        <Spinner />
      ) : (
        <>
          {filteredFavorites.length > 0 ? (
            <>
              <div>
                <OutlineButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
                  Фильтры
                </OutlineButton>
                {isFilterOpen && (
                  <FilterModal
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    style="right"
                    animationEnabled={true}
                    animationTime={400}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    searchData={favorites}
                    disabledSearch={false}
                    placeholder={"Поиск"}
                  />
                )}
              </div>
              <CardsItem
                isFavorite={true}
                favorites={filteredFavorites}
                removeFromFavorites={removeFromFavorites}
              />
            </>
          ) : filterValue.length > 0 ? (
            <span className="favourites__noCards">
              Карточка с такими параметрами не найдена
            </span>
          ) : (
            <span className="favourites__noCards">Нет избранных карточек</span>
          )}
        </>
      )}
    </div>
  );
};

export default FavouritesInfo;
