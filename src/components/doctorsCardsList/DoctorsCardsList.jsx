import "./DoctorsCardsList.scss";

import { useState } from "react";

import PlasticServices from "../../services/PlasticServices";

// import FilterCards from "../filterCards/FilterCards";
import DoctorsCardsItem from "../doctorsCardsItem/DoctorsCardsItem";
import Spinner from "../spinner/Spinner";
import OutlineButton from "../UI/buttons/outlineButton/OutlineButton";

import { useQuery } from "@siberiacancode/reactuse";

const DoctorsCardsList = () => {
  const [filter, setFilter] = useState({ limit: "6" });

  const {
    data: doctors,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useQuery(
    () =>
      PlasticServices.getDoctors({
        limit: filter.limit,
      }),
    {
      keys: [filter.limit],
    }
  );

  return (
    <section className="doctors-cards-list section">
      <div className="doctors-cards-list__container container">
        <h2 className="title-h2">ВРАЧИ</h2>
        {/* <FilterCards
          filter={filter}
          setFilter={setFilter}
          doctors={"doctors"}
        /> */}

        <ul className="doctors-cards-list__box">
          {!isLoading && isSuccess ? (
            doctors.result.map((doctor) => (
              <DoctorsCardsItem doctor={doctor} key={doctor.id} />
            ))
          ) : (
            <h3 className="component-content-text">Нет врачей</h3>
          )}
        </ul>

        {isError && (
          <h3 className="component-error-text">Ошибка: {error.message}</h3>
        )}
        {isLoading && <Spinner />}
        {isError && (
          <OutlineButton
            className="component-button-text"
            onClick={() => refetch()}
          >
            Обновить
          </OutlineButton>
        )}
      </div>
    </section>
  );
};

export default DoctorsCardsList;
