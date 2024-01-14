import { useState } from "react";
import TextInput from "../../UI/inputs/textInput/TextInput";
import Select from "../../UI/selects/select/Select";
import "./EditUser.scss";
import Checkbox from "../../UI/inputs/checkbox/Checkbox";

const EditUser = ({ userData, onSave, onInputChange, onCheckboxChange }) => {
  const [selectedGender, setSelectedGender] = useState("");
  const [politicy1Checked, setPoliticy1Checked] = useState(false);
  const [politicy2Checked, setPoliticy2Checked] = useState(false);

  const genderOptions = [
    { label: "Мужской", value: "male" },
    { label: "Женский", value: "female" },
  ];

  // const handleSelectChange = (e) => {
  //   setSelectedGender(e.target.value), console.log("Gender:", e.target.value);
  // };

  const handleCheckboxChange = (checkboxName, isChecked) => {
    // Обработка изменений состояния чекбокса
    if (checkboxName === "Check 1") {
      setPoliticy1Checked(isChecked);
    } else if (checkboxName === "Check 2") {
      setPoliticy2Checked(isChecked);
    }
  };

  return (
    <div className="edit">
      <span className="edit__title">Персональные данные</span>
      <div className="edit__info">
        <TextInput
          htmlFor="email"
          id="email"
          type="email"
          name="email"
          userData={userData?.email || "Неизвестно"}
          onChange={(e) => onInputChange("email", e.target.value)}
        >
          Email
        </TextInput>
        <TextInput
          htmlFor="text"
          id="text"
          type="text"
          name="address"
          userData={userData?.address.street || "Неизвестно"}
          onChange={(e) => onInputChange("address", e.target.value)}
        >
          Адрес
        </TextInput>
        <TextInput
          htmlFor="text"
          id="text"
          type="text"
          name="name"
          userData={userData?.name || "Неизвестно"}
          onChange={(e) => onInputChange("name", e.target.value)}
        >
          ФИО
        </TextInput>
        <TextInput
          htmlFor="date"
          id="date"
          type="date"
          name="birthday"
          userData={userData?.birthday || "Неизвестно"}
          onChange={(e) => onInputChange("birthday", e.target.value)}
        >
          Дата рождения
        </TextInput>
        <TextInput
          htmlFor="tel"
          id="tel"
          type="tel"
          name="phone"
          userData={userData?.phone || "Неизвестно"}
          onChange={(e) => onInputChange("phone", e.target.value)}
        >
          Телефон
        </TextInput>
        <Select
          htmlFor="gender"
          id="gender"
          name="gender"
          value={selectedGender}
          onChange={(e) => onInputChange("gender", e.target.value)}
          options={genderOptions}
        >
          Пол
        </Select>
      </div>
      <span className="edit__title">Согласие пользователя</span>
      <div className="edit__checkbox">
        <Checkbox
          htmlFor="politicy1"
          id="politicy1"
          name="politicy1"
          checked={politicy1Checked}
          onChange={(e) => handleCheckboxChange("Check 1", e.target.checked)}
        >
          Пользователь ознакомлен с Политикой Конфиденциальности
        </Checkbox>
        <Checkbox
          htmlFor="politicy1"
          id="politicy1"
          name="politicy1"
          checked={politicy2Checked}
          onChange={(e) => handleCheckboxChange("Check 2", e.target.checked)}
        >
          Пользователь даёт Согласие на обработку персональных данных
        </Checkbox>
      </div>
    </div>
  );
};

export default EditUser;
