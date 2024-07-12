import React from "react";
import PlasticServices from "../../../../services/PlasticServices";
import { useQuery } from "@siberiacancode/reactuse";
import ServicesColumns from "./ServicesColumn";

import { FaUserDoctor } from "react-icons/fa6";
import OutlineButton from "../../../UI/buttons/outlineButton/OutlineButton";
import Field from "../../../UI/fields/Field";
import Spinner from "../../../UI/preloader/Spinner";
import Table from "../../../UI/table/Table";
import Divider from "../../../UI/dividers/Divider";
import Input from "../../../UI/inputs/input/Input";

const DoctorInfo = ({ selectedDoctor }) => {
  return (
    <div className="appointment__info">
      <h3 className="appointment__name">
        {selectedDoctor?.fio || "Неизвестно"}
      </h3>
      <Field
        label="Специализация"
        values={selectedDoctor?.specialization || "Неизвестно"}
      />
      <Field
        label="Ученая степень"
        values={selectedDoctor?.degree || "Неизвестно"}
      />
      <Field
        label="Клиника"
        values={selectedDoctor?.clinic?.name || "Не работает в клинике"}
      />
      <Field
        label="Опыт"
        values={`${selectedDoctor?.experience || "Неизвестно"}` + " лет"}
      />
    </div>
  );
};

const DoctorAvatar = ({ selectedDoctor }) => {
  return (
    <div className="appointment__photo">
      {selectedDoctor?.avatar ? (
        <img
          className="appointment__img"
          src={selectedDoctor?.avatar}
          alt="doctor"
        />
      ) : (
        <FaUserDoctor size={48} className="appointment__icon" />
      )}
    </div>
  );
};

const SendingEntry = ({ stepper, selectedDoctor }) => {
  console.log(selectedDoctor);
  const {
    data: services,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  } = useQuery(() => PlasticServices.getDoctorServices(selectedDoctor?.id), {
    keys: [selectedDoctor?.id],
  });

  const columns = ServicesColumns();

  return (
    <>
      <div className="appointment__header">
        <div className="appointment__doctor">
          <DoctorAvatar selectedDoctor={selectedDoctor} />
          <DoctorInfo selectedDoctor={selectedDoctor} />
        </div>
      </div>
      <Divider />
      <div className="appointment__main">
        <span className="appointment__subtitle">Выберите услугу</span>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div>Ошибка: {error.message}</div>
        ) : services?.length === 0 ? (
          <span className="support__subtitle">
            У доктора не добавлены услуги
          </span>
        ) : isSuccess ? (
          <div className="appointment__services"></div>
        ) : null}

        <Table
          columns={columns}
          data={[
            {
              id: 1,
              specialty: {
                id: 4,
                name: "Удаление уха",
              },
              price: 1220,
              status: true,
            },
            {
              id: 2,
              specialty: {
                id: 4,
                name: "Удаление уха",
              },
              price: 1220,
              status: true,
            },
          ]}
        />

        <Divider />
        <span className="appointment__subtitle">Выберите дату приёма</span>
        <Divider />
        <span className="appointment__subtitle">Выберите время приёма</span>
      </div>

      <div className="appointment__actions">
        <OutlineButton>Отправить запись</OutlineButton>
        <OutlineButton
          style={{ color: "rgb(206, 44, 49)" }}
          onClick={() => stepper.reset()}
        >
          Отменить
        </OutlineButton>
      </div>
    </>
  );
};

export default SendingEntry;
