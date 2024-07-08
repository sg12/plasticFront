import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { toast } from "react-toastify";
import { fieldsConfig } from "./Field.config";
import { useQuery } from "@siberiacancode/reactuse";

import "./ServicesInfo.scss";

import Table from "../../UI/table/Table";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton.jsx";
import Modal from "../../UI/modals/modal/Modal.jsx";
import Input from "../../UI/inputs/input/Input.jsx";
import Select from "../../UI/selects/select/Select.jsx";
import Spinner from "../../UI/preloader/Spinner.jsx";

import ServicesColumns from "./ServicesColumns.jsx";
import PlasticServices from "../../../services/PlasticServices.js";

const ServicesInfo = () => {
  const { userData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [services, setServices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    price: "",
    status: "",
  });

  const { isLoading, isError, isSuccess, error, refetch } = useQuery(
    () => PlasticServices.getServices(userData?.role),
    {
      keys: [userData?.role],
      onSuccess: (data) => {
        setEmployes(Array.isArray(data) ? data : []);
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!modalData.name || !modalData.price) {
      toast.warn("Пожалуйста, заполните все поля!");
      return;
    }
    if (isEditing) {
      const updatedServices = services.map((service, index) =>
        index === editIndex ? modalData : service
      );
      setServices(updatedServices);
      setIsEditing(false);
      setEditIndex(null);
      toast.info("FIX THIS");
    } else {
      setServices([...services, modalData]);
      toast.success("Услуга успешно создана!");
      refetch();
    }
    setModalData({
      name: "",
      price: "",
      status: "",
    });
  };

  const handleEdit = (index) => {
    setModalData(services[index]);
    setIsEditing(true);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    toast.success("Услуга удалена!");
  };

  const columns = ServicesColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const renderFields = () => {
    return fieldsConfig.map((field) => {
      if (field.type === "select") {
        return (
          <Select
            key={field.name}
            disabled={field.disabled}
            isLoading={isLoading}
            name={field.name}
            value={modalData[field.name]}
            onChange={handleChange}
            options={field.options}
            label={field.label}
            placeholder={field.placeholder}
            andClass="services__select"
          />
        );
      } else {
        return (
          <Input
            key={field.name}
            type={field.type}
            disabled={field.disabled}
            isLoading={isLoading}
            name={field.name}
            value={modalData[field.name]}
            onChange={handleChange}
            required
            autoComplete="none"
            label={field.label}
            placeholder={field.placeholder}
            andClass="services__input"
          />
        );
      }
    });
  };

  return (
    <div className="services">
      <span className="services__title">Ваши услуги</span>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div>Ошибка: {error.message}</div>
      ) : services?.length === 0 ? (
        <span className="specialist__subtitle">Нет услуг</span>
      ) : (
        <Table columns={columns} data={services} />
      )}

      {!isLoading && !isError && (
        <div style={{ display: "flex", justifyContent: "right" }}>
          <OutlineButton
            onClick={() => (
              setIsModalOpen(!isModalOpen),
              setIsEditing(false),
              setEditIndex(null),
              setModalData({
                name: "",
                price: "",
                status: "",
              })
            )}
            type="button"
            style={{ border: "none" }}
          >
            Добавить услугу
          </OutlineButton>
        </div>
      )}

      {isModalOpen && (
        <Modal
          title={isEditing ? "Редактирование услуги" : "Добавление услуги"}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          save={handleSave}
        >
          {renderFields()}
        </Modal>
      )}
    </div>
  );
};

export default ServicesInfo;
