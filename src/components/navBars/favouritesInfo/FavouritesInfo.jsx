import MyButton from "../../UI/button/MyButton";
import Search from "../../UI/search/Search";
import CardsItem from "../cardsItem/cardsItem";

import "./FavouritesInfo.scss";

const FavouritesInfo = () => {
  const cardCount = 3;
  const cardType = "all";


  return (
    <div className="favourites">
      <span className="favourites__title">Избранное</span>
      <Search />
      <CardsItem count={cardCount} type={cardType} />
    </div>
  );
};

export default FavouritesInfo;
