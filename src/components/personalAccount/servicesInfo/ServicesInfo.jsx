import React, { useState } from "react";
import Table from "../../UI/table/Table";
import "./ServicesInfo.scss";
import FilterModal from "../../UI/modals/filterModal/FilterModal";
import DATA from "../../UI/table/data.js";
import Radios from "../../UI/radios/Radios";
import ServicesColumns from "./ServicesColumns.jsx";
import { toast } from "react-toastify";

const ServicesInfo = () => {
  const options = [
    { value: "active", label: "Активная" },
    { value: "inactive", label: "Неактивная" },
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const [services, setServices] = useState(DATA || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [serviceData, setServiceData] = useState({
    services: "",
    costs: "",
    type: "",
    reception: null,
    status: null,
  });

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    handleInputChange("status", value);
  };

  const handleInputChange = (field, value) => {
    setServiceData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleReceptionTypeChange = (type) => {
    handleInputChange("reception", type);
  };
  // const handleSave = () => {
  //   if (newUser.id.trim()) {
  //     setUserData([...userData, newUser]);
  //     setNewUser({ id: "" });
  //     setIsFilterOpen(false);
  //     toast.success("Сотрудник успешно добавлен");
  //   } else {
  //     toast.warn("Введите ID сотрудника");
  //   }
  // };

  const handleSave = () => {
    if (
      !serviceData.services ||
      !serviceData.costs ||
      !serviceData.type ||
      serviceData.reception === null ||
      serviceData.status === null
    ) {
      toast.warn("Пожалуйста, заполните все поля!");
      return;
    }
    if (isEditing) {
      const updatedServices = services.map((service, index) =>
        index === editIndex ? serviceData : service
      );
      setServices(updatedServices);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setServices([...services, serviceData]);
      toast.success("Услуга успешна создалась!");
    }

    setServiceData({
      services: "",
      costs: "",
      type: "",
      reception: null,
      status: null,
    });
    setIsFilterOpen(false);
  };

  const handleEdit = (index) => {
    setServiceData(services[index]);
    setIsEditing(true);
    setEditIndex(index);
    setIsFilterOpen(true);
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

  return (
    <div className="services">
      <span className="services__title">Ваши услуги</span>
      {services && services.length >= 1 ? (
        <Table columns={columns} data={services} />
      ) : (
        <div style={{ opacity: 0.5 }}>Нет услуг</div>
      )}
      <div
        className="services__actions"
        style={{ display: "flex", justifyContent: "right" }}
      >
        <button
          onClick={() => (
            setIsFilterOpen(!isFilterOpen),
            setServiceData({
              services: "",
              costs: "",
              type: "",
              reception: null,
              status: null,
            }),
            setIsEditing(false),
            setEditIndex(null)
          )}
          type="button"
          className="add"
        >
          Добавить услугу
        </button>
      </div>
      {isFilterOpen && (
        <FilterModal
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          style="right"
          animationEnabled={true}
          animationTime={400}
          filterValue={serviceData}
          setFilterValue={setServiceData}
          disabledSearch={true}
          save={handleSave}
        >
          <input
            type="text"
            onChange={(e) => handleInputChange("services", e.target.value)}
            placeholder="Наименование услуги"
            value={serviceData?.services}
          />
          <input
            type="text"
            onChange={(e) => handleInputChange("costs", e.target.value)}
            placeholder="Стоимость"
            value={serviceData?.costs}
          />
          <select
            className="services__select"
            onChange={(e) => handleInputChange("type", e.target.value)}
            value={serviceData?.type}
          >
            <option value="">Выберите тип</option>
            <option value="1 тип">1 тип</option>
            <option value="2 тип">2 тип</option>
          </select>
          <span className="services__title">Тип приема</span>
          <div className="services__reception">
            <input
              type="button"
              value="Частная практика"
              onClick={() => handleReceptionTypeChange("Частная практика")}
              className={
                serviceData?.reception === "Частная практика" ? "active" : ""
              }
            />
          </div>
          <span className="services__title">Статус</span>
          <div className="services__radio">
            <Radios
              name="status"
              options={options}
              onChange={handleOptionChange}
              selected={selectedOption}
            />
          </div>
        </FilterModal>
      )}
    </div>
  );
};

export default ServicesInfo;
