import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import EmployeeСard from "../../UI/cards/employeeСard/EmployeeСard.jsx";
import Filter from "../../UI/filter/Filter.jsx";
import Modal from "../../UI/modals/modal/Modal.jsx";
import Input from "../../UI/inputs/input/Input.jsx";
import Spinner from "../../UI/preloader/Spinner.jsx";

import "./SpecialistInfo.scss";

import PlasticServices from "../../../services/PlasticServices.js";
import { useFetching } from "../../../hooks/useFetching.js";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton.jsx";

export const SpecialistInfo = () => {
  const [employes, setEmployes] = useState([]);
  const [newUser, setNewUser] = useState({ id: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const [fetchEmployes, isEmployesLoading, employesError] = useFetching(
    async () => {
      const response = await PlasticServices.getEmployes();
      setEmployes(response);
    }
  );

  useEffect(() => {
    fetchEmployes();
  }, []);

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
    if (newUser.id.trim()) {
      setEmployes([...employes, newUser]);
      setNewUser({ id: "" });
      toast.success("Сотрудник успешно добавлен");
    } else {
      toast.warn("Введите ID сотрудника");
    }
  };

  return (
    <div className="specialist">
      <span className="specialist__title">Ваши специалисты</span>

      {employes.length > 0 && (
        <div className="specialist__tools">
          <Filter
            filter={filter}
            onFilterChange={(e) => setFilter(e.target.value)}
            filters={userTypeFilters}
          />
        </div>
      )}

      {isEmployesLoading ? (
        <Spinner />
      ) : employesError ? (
        <div>Ошибка: {employesError}</div>
      ) : employes.length === 0 ? (
        <span className="specialist__subtitle">Нет сотрудников</span>
      ) : (
        <div className="specialist__cards">
          {filteredUsers.map((employe) => (
            <EmployeeСard
              key={employe.id}
              userData={employe}
              onDelete={() => handleDelete(employe.id)}
            />
          ))}
        </div>
      )}

      {!isEmployesLoading && !employesError && (
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
            name={"id"}
            value={newUser.id}
            onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
            required
            andClass="specialist__input"
          />
        </Modal>
      )}
    </div>
  );
};
export default SpecialistInfo;
