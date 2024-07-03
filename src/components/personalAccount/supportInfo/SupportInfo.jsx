import React, { useEffect, useState } from "react";
import "./SupportInfo.scss";
import { useFetching } from "../../../hooks/useFetching";
import Spinner from "../../UI/preloader/Spinner";
import Input from "../../UI/inputs/input/Input";
import PlasticServices from "../../../services/PlasticServices";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import Divider from "../../UI/dividers/Divider";
import formatDate from "../../../utils/formatDate";
import Tag from "../../UI/tags/Tag";

const SupportInfo = () => {
  const [tickets, setTickets] = useState([]);
  const [formTicket, setFormTicket] = useState({
    title: "",
    text: "",
  });

  const [fetchTickets, isTicketLoading, ticketError] = useFetching(async () => {
    const response = await PlasticServices.getTickets();
    return setTickets(response.data);
  });

  useEffect(() => {
    fetchTickets();
  }, []);

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
    fetchTickets();
  };

  const fields = [
    {
      name: "title",
      type: "text",
      label: "Тема запроса",
    },
    {
      name: "text",
      type: "text",
      label: "Текст",
    },
  ];

  return (
    <div className="support">
      <span className="support__title">Обращение в службу поддержки</span>
      <form className="support__form" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <Input
            key={field.name}
            type={field.type}
            disabled={field.disabled}
            isLoading={isTicketLoading}
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
      {isTicketLoading ? (
        <Spinner />
      ) : tickets.length > 0 ? (
        tickets.map((ticket, index) => (
          <SupportTicket key={index} data={ticket} />
        ))
      ) : (
        <div className="support__subtitle">Нет обращений</div>
      )}
    </div>
  );
};

const SupportTicket = ({ data }) => {
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
      {/* <OutlineButton>Удалить</OutlineButton> */}
    </div>
  );
};

export default SupportInfo;
