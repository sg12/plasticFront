import { useEffect, useState } from "react";
import TextInput from "../../UI/inputs/textInput/TextInput";
import Select from "../../UI/selects/select/Select";
import "./EditUser.scss";
import Checkbox from "../../UI/inputs/checkbox/Checkbox";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlasticServices from "../../../services/PlasticServices";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";

const EditUser = ({ userData, toggleEditingMode }) => {
  const [editedData, setEditedData] = useState({
    email: "",
    address: "",
    username: "",
    date_born: "",
    phone: "",
    gender: "",
    consentToPrivacyPolicy: false,
    consentToDataProcessing: false,
  });

  useEffect(() => {
    if (userData) {
      setEditedData({
        email: userData?.user?.email || "",
        address: userData?.user?.address || "",
        username: userData?.user?.username || "",
        date_born: userData?.date_born || "",
        phone: userData?.user?.phone || "",
        gender: userData?.user?.gender || "",
        consentToPrivacyPolicy: userData?.consentToPrivacyPolicy || false,
        consentToDataProcessing: userData?.consentToDataProcessing || false,
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setEditedData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const hasFormDataChanged = () => {
    if (!userData) return false;
    return Object.keys(editedData).some(
      (key) => editedData[key] !== userData[key]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      editedData.consentToPrivacyPolicy &&
      editedData.consentToDataProcessing
    ) {
      if (hasFormDataChanged()) {
        try {
          const response = await toast.promise(
            PlasticServices.patchUser(editedData),
            {
              pending: "Сохранение данных...",
              success: "Данные успешно сохранились",
              error: "Ошибка при сохранении данных",
            }
          );
          toggleEditingMode(false);
          window.location.reload();
        } catch (err) {
          toast.warn("Произошла ошибка при сохранении данных");
        }
      } else {
        toast.warn("Данные не изменились.");
      }
    } else {
      toast.warn("Проставьте обе галочки перед сохранением.");
    }
  };

  const fullName = [{ name: "username", placeholder: "ФИО", type: "text" }];

  const extra = [
    { name: "email", placeholder: "Email", type: "email", disabled: true },
    { name: "phone", placeholder: "Телефон", type: "tel" },
    { name: "address", placeholder: "Адрес", type: "text" },
    {
      name: "gender",
      placeholder: "Пол",
      type: "select",
      options: [
        { value: "male", label: "Мужчина" },
        { value: "female", label: "Женщина" },
        { value: "", label: "Не указан" },
      ],
    },
    { name: "date_born", placeholder: "Дата рождения", type: "date" },
  ];

  const checkboxFields = [
    {
      name: "consentToPrivacyPolicy",
      label: "Я ознакомлен с Политикой Конфиденциальности",
    },
    {
      name: "consentToDataProcessing",
      label: "Я даю Согласие на обработку персональных данных",
    },
  ];

  return (
    <>
      <form onSubmit={handleSave} className="edit">
        <span className="edit__title">Персональные данные</span>
        <form className="edit__info">
          {fullName.map((field) => (
            <TextInput
              key={field.name}
              type={field.type}
              disabled={field.disabled}
              andClass="edit__input"
              name={field.name}
              value={editedData[field.name]}
              onChange={handleChange}
              required
              autoComplete="none"
              placeholder={field.placeholder}
            />
          ))}
          {extra.map((field) =>
            field.type === "select" ? (
              <Select
                key={field.name}
                name={field.name}
                value={editedData[field.name]}
                andClass="edit__select"
                onChange={handleChange}
                options={field.options}
                placeholder={field.placeholder}
              />
            ) : (
              <TextInput
                key={field.name}
                type={field.type}
                disabled={field.disabled}
                andClass="edit__input"
                name={field.name}
                value={editedData[field.name]}
                onChange={handleChange}
                required
                autoComplete="none"
                placeholder={field.placeholder}
              />
            )
          )}
        </form>
        <span className="edit__title">Согласие пользователя</span>
        <div className="edit__checkbox">
          {checkboxFields.map((field) => (
            <Checkbox
              key={field.name}
              name={field.name}
              checked={editedData[field.name]}
              onChange={handleChange}
            >
              {field.label}
            </Checkbox>
          ))}
        </div>
        <div className="edit__actions">
          <OutlineButton type="submit" className="save">
            Сохранить
          </OutlineButton>
          <OutlineButton
            type="button"
            className="cancel"
            onClick={toggleEditingMode}
          >
            Отмена
          </OutlineButton>
        </div>
      </form>
    </>
  );
};

export default EditUser;
