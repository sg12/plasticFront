import { useUser } from "../../../context/UserContext";
import Table from "../../UI/table/Table";
import "./ServicesInfo.scss";
import FilterModal from "../../UI/modals/filterModal/FilterModal";
import { useState } from "react";
import Radios from "../../UI/radios/Radios";

const ServicesInfo = () => {
  const options = [
    { value: "active", label: "Активная" },
    { value: "inactive", label: "Неактивная" },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    // Дополнительные действия при изменении выбора, если необходимо
  };

  const [serviceData, setServiceData] = useState({
    serviceName: "",
    serviceCost: "",
    serviceType: "",
    receptionType: null,
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
    console.log("Selected Option", selectedOption);
    console.log("Service Data", serviceData);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { userType } = useUser();

  return (
    <div className="services">
      <span className="services__title">Ваши услуги</span>
      <Table userType={userType} />
      {/* <hr className="services__divider" /> */}
      <div className="services__footer">
        <div className="services__actions">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            type="button"
            className="add"
          >
            Добавить услугу
          </button>
          {isFilterOpen && (
            <FilterModal
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              style="right"
              animationEnabled={true}
              animationTime={400}
              filterValue={serviceData}
              setFilterValue={setServiceData}
              disabledSearch={false}
              save={handleSave}
            >
              <input
                type="text"
                onChange={(e) =>
                  handleInputChange("serviceName", e.target.value)
                }
                placeholder="Наименование услуги"
              />
              <input
                type="text"
                onChange={(e) =>
                  handleInputChange("serviceCost", e.target.value)
                }
                placeholder="Стоимость"
              />
              <select
                className="services__select"
                name=""
                id=""
                onChange={(e) =>
                  handleInputChange("serviceType", e.target.value)
                }
                placeholder="Классификация типа услуги в общем списке"
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
                    onClick={() =>
                      handleReceptionTypeChange("Частная практика")
                    }
                    className={
                      serviceData.receptionType === "Частная практика"
                        ? "active"
                        : ""
                    }
                  />
                </div>
                <div className="services__reception-item-input">
                  <input
                    type="button"
                    value="В клинике"
                    onClick={() => handleReceptionTypeChange("В клинике")}
                    className={
                      serviceData.receptionType === "В клинике" ? "active" : ""
                    }
                  />
                </div>
              </div>
              <span className="services__title">Статус</span>
              <div className="services__radio">
                <Radios options={options} onChange={handleOptionChange} />
              </div>
            </FilterModal>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesInfo;
