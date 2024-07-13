import React, { useState } from "react";
import { useQuery } from "@siberiacancode/reactuse";

import { fieldsConfig } from "./Field.config";
import "./SupportInfo.scss";

import PlasticServices from "../../../services/PlasticServices";

import Spinner from "../../UI/preloader/Spinner";
import Input from "../../UI/inputs/input/Input";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import Divider from "../../UI/dividers/Divider";
import formatDate from "../../../utils/formatDate";
import Tag from "../../UI/tags/Tag";

const SupportInfo = () => {
  const [formTicket, setFormTicket] = useState({
    title: "",
    text: "",
  });

  const {
    data: tickets,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  } = useQuery(() => PlasticServices.getTickets());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormTicket({
      ...formTicket,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await PlasticServices.postTicket(formTicket);
    setFormTicket({ title: "", text: "" });
    refetch();
  };

  const handleDelete = async (id) => {
    await PlasticServices.deleteTicket(id);
    refetch();
  };

  return (
    <div className="support">
      <form className="support__form" onSubmit={handleSubmit}>
        {fieldsConfig.map((field) => (
          <Input
            key={field.name}
            type={field.type}
            disabled={field.disabled}
            isLoading={isLoading}
            name={field.name}
            value={formTicket[field.name]}
            onChange={handleChange}
            required
            autoComplete="none"
            label={field.label}
            andClass="support__input"
          />
        ))}
        <OutlineButton className="support__button" type="submit">
          Отправить
        </OutlineButton>
      </form>

      <span className="support__title">Ваши обращения</span>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div>Ошибка: {error.message}</div>
      ) : tickets?.data?.length === 0 ? (
        <span className="support__subtitle">Нет обращений</span>
      ) : isSuccess ? (
        tickets?.data?.map((ticket, index) => (
          <SupportTicket
            key={index}
            data={ticket}
            handleDelete={() => handleDelete(ticket.id)}
          />
        ))
      ) : null}
    </div>
  );
};

const SupportTicket = ({ data, handleDelete }) => {
  return (
    <div className="support__ticket">
      <div className="ticket__header">
        <div className="ticket__title">{data.title}</div>
        <div className="ticket__dates">
          <Tag label={`Создан: ${formatDate(data.created_at)}`} />
          <Tag label={`Обновлен: ${formatDate(data.updated_at)}`} />
        </div>
      </div>
      <Divider />
      <div className="ticket__text">{data.text}</div>
      <div className="ticket__button">
        <OutlineButton onClick={handleDelete}>Удалить</OutlineButton>
      </div>
    </div>
  );
};

export default SupportInfo;
