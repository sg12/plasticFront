import { useState } from "react";
import TextInput from "../../UI/inputs/textInput/TextInput";
import Select from "../../UI/selects/select/Select";
import "./EditUser.scss";
import Checkbox from "../../UI/inputs/checkbox/Checkbox";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const EditUser = ({ userData, toggleEditingMode }) => {
  const [editedData, setEditedData] = useState({
    email: userData?.email || "",
    address: userData?.address.street || "",
    name: userData?.name || "",
    birthday: userData?.birthdate || "",
    phone: userData?.phone || "",
    gender: userData?.gender || "",
  });
  const [politicy1Checked, setPoliticy1Checked] = useState(false);
  const [politicy2Checked, setPoliticy2Checked] = useState(false);

  const sendPostRequest = async (data) => {
    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/users", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSave = async () => {
    if (politicy1Checked && politicy2Checked) {
      console.log(editedData)
      
      const promise = toast.promise(sendPostRequest(editedData), {
        pending: "Сохранение", 
        success: "Данные успешно сохранились", 
        error: "Ошибка при сохранении данных", 
        autoClose: 3000, 
      });

      promise
        .then(() => {
          toggleEditingMode(false); 
        })
        .catch((error) => {
          console.error("Ошибка при сохранении данных:", error);
        });
    } else {
      toast.warn("Проставьте обе галочки, перед сохранением.");
      console.error("Пожалуйста, поставьте обе галочки, перед сохранением.");
    }
  };

  const handleInputChange = (fieldName, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleCheckboxChange = (checkboxName, checked) => {
    if (checkboxName === "politicy1") {
      setPoliticy1Checked(checked);
    } else if (checkboxName === "politicy2") {
      setPoliticy2Checked(checked);
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
          onChange={(e) => handleInputChange("email", e.target.value)}
        >
          Email
        </TextInput>
        <TextInput
          htmlFor="text"
          id="text"
          type="text"
          name="address"
          userData={userData?.address.street || "Неизвестно"}
          onChange={(e) => handleInputChange("address", e.target.value)}
        >
          Адрес
        </TextInput>
        <TextInput
          htmlFor="text"
          id="text"
          type="text"
          name="name"
          userData={userData?.name || "Неизвестно"}
          onChange={(e) => handleInputChange("name", e.target.value)}
        >
          ФИО
        </TextInput>
        <TextInput
          htmlFor="date"
          id="date"
          type="date"
          name="birthday"
          userData={userData?.birthday || "Неизвестно"}
          onChange={(e) => handleInputChange("birthday", e.target.value)}
        >
          Дата рождения
        </TextInput>
        <TextInput
          htmlFor="tel"
          id="tel"
          type="tel"
          name="phone"
          userData={userData?.phone || "Неизвестно"}
          onChange={(e) => handleInputChange("phone", e.target.value)}
        >
          Телефон
        </TextInput>
        <Select
          htmlFor="gender"
          id="gender"
          name="gender"
          value={userData?.gender}
          onChange={(e) => handleInputChange("gender", e.target.value)}
          options={[
            { label: "Мужской", value: "male" },
            { label: "Женский", value: "female" },
          ]}
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
          onChange={(e) => handleCheckboxChange("politicy1", e.target.checked)}
        >
          Пользователь ознакомлен с Политикой Конфиденциальности
        </Checkbox>
        <Checkbox
          htmlFor="politicy2"
          id="politicy2"
          name="politicy2"
          checked={politicy2Checked}
          onChange={(e) => handleCheckboxChange("politicy2", e.target.checked)}
        >
          Пользователь даёт Согласие на обработку персональных данных
        </Checkbox>
      </div>
      <hr className="profile__divider" />
      <div className="edit__action-button">
        <button type="button" className="save" onClick={handleSave}>
          Сохранить
        </button>
        <button type="button" className="cancel" onClick={toggleEditingMode}>
          Отмена
        </button>
      </div>
    </div>
  );
};

export default EditUser;
