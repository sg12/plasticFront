import { useState } from "react";
import PlasticServices from "../../../services/PlasticServices";
import { useQuery } from "@siberiacancode/reactuse";

import "./FavouritesInfo.scss";

import CardsItem from "../cardsItem/CardsItem";
import FilterModal from "../../UI/modals/filterModal/FilterModal";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import Spinner from "../../UI/preloader/Spinner";

const FavouritesInfo = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const {
    data: favorites,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  } = useQuery(() => PlasticServices.getFavorities());

  const filteredFavorites = favorites?.data?.filter((favorite) => {
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

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div>Ошибка: {error.message}</div>
      ) : favorites?.data?.length === 0 ? (
        <span className="favourites__subtitle">Нет избранных карточек</span>
      ) : isSuccess ? (
        <>
          <div>
            <OutlineButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
              Фильтры
            </OutlineButton>
          </div>
          <CardsItem
            isFavorite={true}
            favorites={filteredFavorites}
            removeFromFavorites={removeFromFavorites}
          />
        </>
      ) : null}

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
  );
};

export default FavouritesInfo;
