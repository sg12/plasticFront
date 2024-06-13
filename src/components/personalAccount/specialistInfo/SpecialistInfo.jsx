import AddCard from "../../UI/cards/addCard/AddCard.jsx";
import EmployeeСard from "../../UI/cards/employeeСard/EmployeeСard.jsx";
import Tooltip from "../../UI/tooltips/Tooltip.jsx";
import Filter from "../../UI/filter/Filter.jsx";
import { useState } from "react";
import Modal from "../../UI/modals/modal/Modal.jsx";
import Input from "../../UI/inputs/input/Input.jsx";
import { toast } from "react-toastify";

import "./SpecialistInfo.scss";

export const SpecialistInfo = () => {
  const [userData, setUserData] = useState([
    {
      id: 1,
      avatar: "https://avatars.githubusercontent.com/u/10001001?v=4",
      username: "Петров Геннадий Иванович",
      specialization: "Хирург",
      isActive: "Активный",
      isOnline: "В сети",
    },
    {
      id: 2,
      avatar: "https://avatars.githubusercontent.com/u/10001001?v=4",
      username: "Иванова Мария Леонидовна",
      specialization: "Педиатр",
      isActive: "Активный",
      isOnline: "Не в сети",
    },
    {
      id: 3,
      avatar: "https://avatars.githubusercontent.com/u/10001001?v=4",
      username: "Сидоров Алексей Викторович",
      specialization: "Терапевт",
      isActive: "Неактивный",
      isOnline: "В сети",
    },
    {
      id: 4,
      avatar: "https://avatars.githubusercontent.com/u/10001001?v=4",
      username: "Сидоров Алексей Викторович",
      specialization: "Терапевт",
      isActive: "Неактивный",
      isOnline: "В сети",
    },
  ]);

  const [newUser, setNewUser] = useState({ id: "" });
  console.log(newUser);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const userTypeFilters = [
    { value: "Все", name: "Все" },
    { value: "Активный", name: "Активные" },
    { value: "Неактивный", name: "Неактивные" },
    { value: "В сети", name: "В сети" },
    { value: "Не в сети", name: "Не в сети" },
  ];

  // Фильтрация отзывов
  const filteredUsers =
    filter === "Все"
      ? userData
      : userData.filter((user) => {
          switch (filter) {
            case "Активный":
              return user.isActive === "Активный";
            case "Неактивный":
              return user.isActive === "Неактивный";
            case "В сети":
              return user.isOnline === "В сети";
            case "Не в сети":
              return user.isOnline === "Не в сети";
            default:
              return true;
          }
        });

  const handleDelete = (id) => {
    setUserData(userData.filter((user) => user.id !== id));
  };

  const handleSave = () => {
    if (newUser.id.trim()) {
      setUserData([...userData, newUser]);
      setNewUser({ id: "" });
      setIsFilterOpen(false);
      toast.success("Сотрудник успешно добавлен");
    } else {
      toast.warn("Введите ID сотрудника");
    }
  };

  return (
    <div className="specialist">
      <span className="specialist__title">Ваши специалисты</span>
      <div className="specialist__tools">
        {/* <Alert
          icon={IoIosAlert}
          label={
            "Для управления, нажмите правой кнопкой мыши на карточку или зажмите пальцем"
          }
        /> */}
        <Filter
          filter={filter}
          onFilterChange={(e) => setFilter(e.target.value)}
          filters={userTypeFilters}
        />
      </div>
      {/* <Table userData={DATA} userType="clinic/specialists"/> */}
      <div className="specialist__cards">
        {filteredUsers &&
          filteredUsers.map((user) => (
            <EmployeeСard
              key={user.id}
              userData={user}
              onDelete={() => handleDelete(user.id)}
            />
          ))}

        <Tooltip position={"bottom"} text={"Добавить врача"}>
          <AddCard onClick={() => setIsFilterOpen(true)} />
        </Tooltip>
      </div>
      {isFilterOpen && (
        <Modal
          title={"Добавление сотрудника"}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          save={handleSave}
        >
          <Input
            placeholder={"ID сотрудника"}
            name={"id"}
            value={newUser.id}
            onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
            required
          />
        </Modal>
      )}
    </div>
  );
};
export default SpecialistInfo;
