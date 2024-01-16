import React, { useState } from "react";
import "./CardsItem.scss";
import women from "../../../assets/imgs/women.png";
import men from "../../../assets/imgs/men.png";

const Card = ({
  isFavorite,
  userData,
  cardType,
  username,
  direction,
  onDelete,
}) => {
  const handleDelete = () => {
    onDelete();
    console.log("delete");
  };

  return (
    isFavorite && (
      <div className={`card ${isFavorite ? "favorite" : ""}`}>
        <div className="card__body">
          <div className="card__photo">
            <img src={cardType === "doctor" ? women : men} alt="some photo" />
          </div>
          <span className="card__name">{username}</span>
          <span className="card__direction">
            {userData?.direction || direction}
          </span>
          <div className="card__action">
            <button className="card__action-delete" onClick={handleDelete}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6.6361 8.00018V10.8335M9.36393 8.00018V10.8335M9.66667 4.00016C9.66667 3.63197 9.36819 3.3335 9 3.3335H7C6.63181 3.3335 6.33333 3.63197 6.33333 4.00016M3.90943 5.16685L4.46973 11.8343C4.55678 12.8703 5.42306 13.6669 6.4627 13.6669H9.53799C10.5776 13.6669 11.4439 12.8703 11.531 11.8343L12.0913 5.16685M3 5.06551H13"
                  stroke="#3066BE"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const CardsItem = ({
  userData,
  isFavorite,
  favorites,
  removeFromFavorites,
}) => {
  return (
    <div className="cards">
      {favorites.map((favorite) => (
        <Card
          key={favorite.id}
          isFavorite={isFavorite}
          userData={userData}
          cardType={favorite.type}
          direction={favorite.direction}
          username={favorite.username}
          onDelete={() => removeFromFavorites(favorite.id)}
        />
      ))}
    </div>
  );
};

export default CardsItem;
