import React, { useState } from "react";
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
import Select from "../../../UI/selects/select/Select";
import Avatar from "../../../UI/avatar/Avatar";
import { toast } from "react-toastify";

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

const SendingEntry = ({ stepper, selectedDoctor }) => {
  const [datetime, setDatetime] = useState("");
  const [receptionType, setReceptionType] = useState("private");
  console.log(selectedDoctor);

  // TODO: Добавить запрос, как только Дима исправит 500 статус
  // const {
  //   data: services,
  //   isLoading,
  //   isError,
  //   isSuccess,
  //   error,
  //   refetch,
  // } = useQuery(() => PlasticServices.getDoctorServices(selectedDoctor?.id), {
  //   keys: [selectedDoctor?.id],
  // });

  // const columns = ServicesColumns();

  const addReceptions = async () => {
    if (datetime === "") {
      toast.error("Укажите дату и время приёма");
    } else {
      try {
        await PlasticServices.addReceptions({
          type: receptionType,
          datetime: datetime,
          service: 1,
          user: selectedDoctor?.id,
        });
        toast.success("Приём успешно создан");
      } catch (error) {
        toast.error("Ошибка при создании приёма");
      }
    }
  };

  return (
    <>
      <div className="appointment__header">
        <div className="appointment__doctor">
          <Avatar
            src={selectedDoctor?.avatar}
            size={"large"}
            icon={<FaUserDoctor />}
          />
          <DoctorInfo selectedDoctor={selectedDoctor} />
        </div>
      </div>

      <Divider />

      <div className="appointment__main">
        {/* <span className="appointment__subtitle">Выберите услугу</span>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div>Ошибка: {error.message}</div>
        ) : services?.length === 0 ? (
          <span className="support__subtitle">
            У доктора не добавлены услуги
          </span>
        ) : isSuccess ? (
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
        ) : null} */}

        <div className="appointment__inputs">
          <Input
            value={datetime}
            name={"datetime"}
            andClass={"appointment__input"}
            type={"datetime-local"}
            label={"Выберите дату и время приёма"}
            onChange={(e) => setDatetime(e.target.value)}
            required
          />

          <Select
            value={receptionType}
            name={"receptionType"}
            andClass={"appointment__input"}
            type={"datetime-local"}
            label={"Выберите тип приёма"}
            onChange={(e) => setReceptionType(e.target.value)}
            required
            options={[
              { value: "private", label: "На дому" },
              { value: "clinic", label: "В клинике" },
            ]}
          />
        </div>
      </div>

      <div className="appointment__actions">
        <OutlineButton onClick={addReceptions}>Отправить запись</OutlineButton>
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
