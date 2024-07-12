import { useState } from "react";
import PlasticServices from "../../../services/PlasticServices";
import { useQuery } from "@siberiacancode/reactuse";

import "./FavouritesInfo.scss";

import FilterModal from "../../UI/modals/filterModal/FilterModal";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import Spinner from "../../UI/preloader/Spinner";
import Card from "../../UI/cards/card/Card";
import { FaUserDoctor } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { toast } from "react-toastify";
import { FaClinicMedical } from "react-icons/fa";

const FavouritesInfo = () => {
  // const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const [filterValue, setFilterValue] = useState("");
  // TODO: Добавить фильтрацию
  const {
    data: favorites,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  } = useQuery(() => PlasticServices.getFavorities());

  // const filteredFavorites = favorites?.data?.filter((favorite) => {
  //   const usernameMatch = favorite.username
  //     .toLowerCase()
  //     .includes(filterValue.toLowerCase());
  //   const directionMatch = favorite.direction
  //     .toLowerCase()
  //     .includes(filterValue.toLowerCase());

  //   return usernameMatch || directionMatch;
  // });

  const removeFromFavorites = async (id) => {
    await PlasticServices.deleteFavorities(id);
    toast.success(`ID:${id} - Успешно удалено`);
    refetch();
  };

  return (
    <div className="favourites">
      <span className="favourites__title">Избранное</span>
      <span className="favourites__subtitle">
        Доктора или клинику можно добавить, нажав на сердечко
      </span>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div>Ошибка: {error.message}</div>
      ) : favorites?.data?.length === 0 ? (
        <span className="favourites__subtitle">Нет избранных карточек</span>
      ) : isSuccess ? (
        <>
          {/* <div>
            <OutlineButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
              Фильтр
            </OutlineButton>
          </div> */}
          <div className="favourites__result">
            {favorites?.data?.map((favorite, index) => (
              <Card
                key={index}
                avatarIcon={
                  favorite.role === "doctor" ? (
                    <FaUserDoctor />
                  ) : (
                    <FaClinicMedical />
                  )
                }
                title={favorite?.fio ?? favorite?.name}
                subtitle={favorite?.specialization || "Нет специализации"}
                actions={
                  <OutlineButton
                    onClick={() => removeFromFavorites(favorite.id)}
                    style={{ border: "none" }}
                  >
                    <IoMdHeart size={24} />
                  </OutlineButton>
                }
              />
            ))}
          </div>
          {console.log(favorites)}
        </>
      ) : null}

      {/* {isFilterOpen && (
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
      )} */}
    </div>
  );
};

export default FavouritesInfo;
