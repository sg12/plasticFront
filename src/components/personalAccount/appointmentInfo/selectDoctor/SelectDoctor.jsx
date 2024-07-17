import React, { useEffect, useState } from "react";
import {
  useCounter,
  useDebounceValue,
  useQuery,
} from "@siberiacancode/reactuse";
import { toast } from "react-toastify";

import Input from "../../../UI/inputs/input/Input";
import Spinner from "../../../UI/preloader/Spinner";
import OutlineButton from "../../../UI/buttons/outlineButton/OutlineButton";
import Card from "../../../UI/cards/card/Card";

import PlasticServices from "../../../../services/PlasticServices";
import { FaUserDoctor } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import useFavorites from "../../../../hooks/useFavourites";

const SelectDoctor = ({ stepper, selectedDoctor, setSelectedDoctor }) => {
  const counter = useCounter(9);
  const [search, setSearch] = useState({ fio: "" });
  const debouncedSearch = useDebounceValue(search.fio, 500);
  const { favorites, toggleFavorite } = useFavorites("doctor");

  const {
    data: doctors,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  } = useQuery(
    () => PlasticServices.getDoctorsForAppointment(debouncedSearch),
    {
      keys: [debouncedSearch],
    }
  );

  const handleAppointmentClick = () => {
    if (selectedDoctor) {
      stepper.next();
    }

    if (!selectedDoctor) {
      toast.error("Выберите врача");
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSearch({ fio: value });
    setSelectedDoctor(null);
  };

  return (
    <>
      <span className="appointment__subtitle">
        Для поиска врача введите его ФИО
      </span>
      <div className="appointment__actions">
        <Input
          placeholder="Поиск доктора"
          andClass="appointment__input"
          size="large"
          type={"search"}
          name={"search"}
          isLoading={isLoading}
          value={search.fio}
          onChange={(e) => handleChange(e)}
          required
          autoComplete="none"
        />
        <OutlineButton onClick={handleAppointmentClick}>
          Записаться
        </OutlineButton>
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div>Ошибка: {error.message}</div>
      ) : doctors?.length === 0 ? (
        <span className="appointment_subtitle">Нет докторов</span>
      ) : isSuccess ? (
        <>
          <div className="appointment__result">
            {doctors?.slice(0, counter.count).map((doctor, index) => (
              <Card
                key={index}
                avatarImage={doctor.avatar}
                avatarIcon={<FaUserDoctor />}
                title={doctor.fio}
                subtitle={doctor.specialization}
                onSelect={() => handleDoctorSelect(doctor)}
                isSelected={selectedDoctor === doctor}
                actions={
                  <OutlineButton
                    onClick={() => toggleFavorite(doctor.id)}
                    style={{ border: "none" }}
                  >
                    {favorites.includes(doctor.id) ? (
                      <IoMdHeart size={24} />
                    ) : (
                      <CiHeart size={24} />
                    )}
                  </OutlineButton>
                }
              />
            ))}
          </div>
          {counter.count < doctors?.length && (
            <OutlineButton
              style={{ border: "none" }}
              onClick={() => counter.set((prevCount) => prevCount + 3)}
            >
              Показать ещё
            </OutlineButton>
          )}
        </>
      ) : null}
    </>
  );
};

export default SelectDoctor;
