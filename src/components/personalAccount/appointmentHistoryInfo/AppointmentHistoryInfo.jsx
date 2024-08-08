import React from "react";
import "./AppointmentHistoryInfo.scss";
import { useQuery } from "@siberiacancode/reactuse";
import PlasticServices from "../../../services/PlasticServices";
import Spinner from "../../UI/preloader/Spinner";
import { useUser } from "../../../context/UserContext";

const AppointmentHistoryInfo = () => {
  const { userData } = useUser();

  const {
    data: receptions,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  } = useQuery(() => PlasticServices.getReceptions(userData?.role), {
    keys: [userData?.role],
  });

  return (
    <div className="appointment-history">
      <span className="appointment-history__subtitle">
        В данном разделе отображены все записи, которые были совершены с помощью
        PlasticBeauty
      </span>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div>Ошибка: {error.message}</div>
      ) : receptions?.length === 0 ? (
        <span className="appointment-history__subtitle">Нет записей</span>
      ) : isSuccess ? (
        receptions.map((reception, index) => (
          <ul>
            <li key={index}>{reception.date}</li>
          </ul>
        )) // TODO: Добавить результат - карточку
      ) : null}
    </div>
  );
};

export default AppointmentHistoryInfo;
