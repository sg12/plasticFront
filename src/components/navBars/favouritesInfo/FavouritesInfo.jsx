import { useUser } from "../../../context/UserContext";
import Search from "../../UI/search/Search";
import CardsItem from "../cardsItem/cardsItem";

import "./FavouritesInfo.scss";

const FavouritesInfo = () => {
  const { userData } = useUser();

  const cardCount = 2;
  const cardType = "all";


  return (
    <div className="favourites">
      <span className="favourites__title">Избранное</span>
      {/* <Search placeholder="Поиск"/> */}
      <CardsItem userData={userData} count={cardCount} type={cardType} />
    </div>
  );
};

export default FavouritesInfo;
