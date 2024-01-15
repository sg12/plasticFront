import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import Search from "../../UI/inputs/searchInput/SearchInput";
import CardsItem from "../cardsItem/cardsItem";

import "./FavouritesInfo.scss";
import FilterModal from "../../UI/modals/filterModal/FilterModal";

const FavouritesInfo = () => {
  const { userData } = useUser();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="favourites">
      <span className="favourites__title">Избранное</span>
      <div>
        <button onClick={() => setIsFilterOpen(!isFilterOpen)}>Фильтры</button>
        {isFilterOpen && (
          <FilterModal
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            style="right"
            animationEnabled={true}
            animationTime={400}
          ></FilterModal>
        )}
      </div>
      <CardsItem isFavorite={true} userData={userData} />
    </div>
  );
};

export default FavouritesInfo;
