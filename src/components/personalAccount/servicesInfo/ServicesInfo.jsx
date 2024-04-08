import { useUser } from "../../../context/UserContext";
import Table from "../../UI/table/Table";
import "./ServicesInfo.scss";
import FilterModal from "../../UI/modals/filterModal/FilterModal";
import { useState } from "react";
import DATA from "../../UI/table/data.js";
import Radios from "../../UI/radios/Radios";


const ServicesInfo = () => {
  const options = [
    { value: "active", label: "Активная" },
    { value: "inactive", label: "Неактивная" },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const [serviceData, setServiceData] = useState({
    serviceName: "",
    serviceCost: "",
    serviceType: "",
    receptionType: null,
    status: null,
  });

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
    console.log("Service Data", serviceData);
    addService(serviceData);
    setServiceData({
      serviceName: "",
      serviceCost: "",
      serviceType: "",
      receptionType: null,
      status: null,
    });
    setIsFilterOpen(false);
  };

  const addService = (service) => {
    console.log("Add Service:", service);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { userType } = useUser();

  return (
    <div className="services">
      <span className="services__title">Ваши услуги</span>
      {DATA.length >= 1 ? (
        <>
          <Table userType={userType} userData={DATA} />
          <div
            className="services__actions"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              type="button"
              className="add"
            >
              Добавить услугу
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ opacity: 0.5 }}>Нет услуг</div>
          <div
            className="services__actions"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              type="button"
              className="add"
            >
              Добавить услугу
            </button>
          </div>
        </>
      )}
      {/* <hr className="services__divider" /> */}
      <div className="services__footer">
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
              value={serviceData.serviceName}
            />
            <input
              type="text"
              onChange={(e) => handleInputChange("serviceCost", e.target.value)}
              placeholder="Стоимость"
              value={serviceData.serviceCost}
            />
            <select
              className="services__select"
              name=""
              id=""
              onChange={(e) => handleInputChange("serviceType", e.target.value)}
              placeholder="Классификация типа услуги в общем списке"
              value={serviceData.serviceType}
            >
              <option value="">1 тип</option>
              <option value="">2 тип</option>
            </select>

            <span className="services__title">Тип приема</span>
            <div className="services__reception">
              <div className="services__reception-item-input">
                <input
                  type="button"
                  value="Частная практика"
                  onClick={() => handleReceptionTypeChange("Частная практика")}
                  className={
                    serviceData.receptionType === "Частная практика"
                      ? "active"
                      : ""
                  }
                />
              </div>
              <span className="services__title">Статус</span>
              <div className="services__radio">
                <Radios options={options} onChange={handleOptionChange} />
              </div>
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
    </div>
  );
};

export default ServicesInfo;
