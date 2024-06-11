import React, { useState } from "react";
import Table from "../../UI/table/Table";
import "./ServicesInfo.scss";
import FilterModal from "../../UI/modals/filterModal/FilterModal";
import DATA from "../../UI/table/data.js";
import Radios from "../../UI/radios/Radios";
import ServicesColumns from "./ServiceColumns.jsx";

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
    serviceName: "",
    serviceCost: "",
    serviceType: "",
    receptionType: null,
    status: null,
  });
  console.log("@", services)

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const handleInputChange = (field, value) => {
    setServiceData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleReceptionTypeChange = (type) => {
    handleInputChange("receptionType", type);
  };

  const handleSave = () => {
    if (isEditing) {
      const updatedServices = services.map((service, index) =>
        index === editIndex ? serviceData : service
      );
      setServices(updatedServices);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setServices([...services, serviceData]);
    }

    setServiceData({
      serviceName: "",
      serviceCost: "",
      serviceType: "",
      receptionType: null,
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
          onClick={() => setIsFilterOpen(!isFilterOpen)}
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
            onChange={(e) => handleInputChange("serviceName", e.target.value)}
            placeholder="Наименование услуги"
            value={serviceData?.serviceName}
          />
          <input
            type="text"
            onChange={(e) => handleInputChange("serviceCost", e.target.value)}
            placeholder="Стоимость"
            value={serviceData?.serviceCost}
          />
          <select
            className="services__select"
            onChange={(e) => handleInputChange("serviceType", e.target.value)}
            value={serviceData?.serviceType}
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
                serviceData?.receptionType === "Частная практика"
                  ? "active"
                  : ""
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
