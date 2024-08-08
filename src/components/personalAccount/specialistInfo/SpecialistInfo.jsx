import { useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@siberiacancode/reactuse";

import EmployeeСard from "../../UI/cards/employeeСard/EmployeeСard.jsx";
import Filter from "../../UI/filter/Filter.jsx";
import Modal from "../../UI/modals/modal/Modal.jsx";
import Input from "../../UI/inputs/input/Input.jsx";
import Spinner from "../../UI/preloader/Spinner.jsx";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton.jsx";

import "./SpecialistInfo.scss";

import PlasticServices from "../../../services/PlasticServices.js";

export const SpecialistInfo = () => {
  const [employes, setEmployes] = useState([]);
  const [newId, setNewId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const { isLoading, isError, isSuccess, error, refetch } = useQuery(
    () => PlasticServices.getEmployes(),
    {
      onSuccess: (data) => {
        setEmployes(Array.isArray(data) ? data : []);
      },
    }
  );

  const userTypeFilters = [
    { value: "Все", name: "Все" },
    { value: "Активный", name: "Активные" },
    { value: "Неактивный", name: "Неактивные" },
    { value: "В сети", name: "В сети" },
    { value: "Не в сети", name: "Не в сети" },
  ];

  const filteredUsers =
    filter === "Все"
      ? employes
      : employes.filter((employe) => {
          switch (filter) {
            case "Активный":
              return employe.isActive === "Активный";
            case "Неактивный":
              return employe.isActive === "Неактивный";
            case "В сети":
              return employe.isOnline === "В сети";
            case "Не в сети":
              return employe.isOnline === "Не в сети";
            default:
              return true;
          }
        });

  const handleDelete = (id) => {
    setEmployes(employes.filter((employe) => employe.id !== id));
  };

  const handleSave = () => {
    if (newId.trim()) {
      setEmployes([...employes, { id: newId }]);
      // TODO: Добавить post запрос на добавление сотрудника
      setNewId("");
      // toast.success("Сотрудник успешно добавлен");
      toast.info("Нет обработчика!");
      refetch();
    } else {
      toast.warn("Введите ID сотрудника");
    }
  };

  return (
    <div className="specialist">
      {!isLoading && employes.length > 0 && (
        <div className="specialist__tools">
          <Filter
            filter={filter}
            onFilterChange={(e) => setFilter(e.target.value)}
            filters={userTypeFilters}
          />
        </div>
      )}

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div>Ошибка: {error.message}</div>
      ) : employes.length === 0 ? (
        <span className="specialist__subtitle">Нет сотрудников</span>
      ) : isSuccess ? (
        <div className="specialist__cards">
          {filteredUsers.map((employee) => (
            <EmployeeСard
              key={employee.id}
              userData={employee}
              onDelete={() => handleDelete(employee.id)}
            />
          ))}
        </div>
      ) : null}

      {!isLoading && !isError && (
        <div style={{ display: "flex", justifyContent: "right" }}>
          <OutlineButton
            onClick={() => setIsModalOpen(true)}
            type="button"
            style={{ border: "none" }}
          >
            Добавить сотрудника
          </OutlineButton>
        </div>
      )}

      {isModalOpen && (
        <Modal
          title={"Добавление сотрудника"}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          save={handleSave}
        >
          <Input
            placeholder={"ID сотрудника"}
            isLoading={isLoading}
            name={"id"}
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            required
            andClass="specialist__input"
          />
        </Modal>
      )}
    </div>
  );
};
export default SpecialistInfo;
