import "./ClinicsCardsList.scss";

import { useState } from "react";

import PlasticServices from "../../services/PlasticServices";

import ClinicsCardsItem from "../clinicsCardsItem/ClinicsCardsItem";
import Spinner from "../spinner/Spinner";
import FilterCards from "../filterCards/FilterCards";
import OutlineButton from "../UI/buttons/outlineButton/OutlineButton";
import { useQuery } from "@siberiacancode/reactuse";

const ClinicsCardsList = () => {
  const [filter] = useState({
    limit: "6",
    search: "",
    service: "",
    reception: "",
    sort: "",
  });

  const {
    data: clinics,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    () =>
      PlasticServices.getClinics({
        limit: filter.limit,
      }),
    {
      keys: [filter.limit],
    }
  );

  return (
    <section className="clinics-cards-list section">
      <div className="clinics-cards-list__container container">
        <h2 className="title-h2">КЛИНИКИ</h2>
        <ul className="clinics-cards-list__box">
          {clinics && clinics.result && clinics.result.length > 0 ? (
            clinics?.result.map((clinic) => (
              <ClinicsCardsItem clinics={clinic} key={clinic.id} />
            ))
          ) : (
            <h3 className="component-content-text">Нет клиник</h3>
          )}
        </ul>
        {isError && (
          <h3 className="component-error-text">Ошибка: {error.message}</h3>
        )}
        {(isLoading || isError) && <Spinner />}
        {isError && clinics.result.length === 0 && (
          <OutlineButton className="component-button-text" onClick={refetch}>
            Обновить
          </OutlineButton>
        )}
      </div>
    </section>
  );
};

export default ClinicsCardsList;
