import { useEffect, useState } from "react";

import Input from "../../UI/inputs/input/Input";
import Select from "../../UI/selects/select/Select";
import Checkbox from "../../UI/inputs/checkbox/Checkbox";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import Spinner from "../../UI/preloader/Spinner";

import "./EditUser.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fieldsConfig as fieldsConfigPromise } from "./Field.config";

import PlasticServices from "../../../services/PlasticServices";

const EditUser = ({ userData, toggleEditingMode }) => {
  const [editedData, setEditedData] = useState({ ...userData });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldsConfig, setFieldsConfig] = useState(null);

  useEffect(() => {
    const loadFieldsConfig = async () => {
      const config = await fieldsConfigPromise;
      setFieldsConfig(config);
    };
    loadFieldsConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !editedData.confidentiality_consent ||
      !editedData.personal_data_consent
    ) {
      return toast.warn("Проставьте обе галочки перед сохранением.");
    }

    setIsLoading(true);
    try {
      await toast.promise(
        PlasticServices.patchUser(editedData, userData?.role),
        {
          pending: "Сохранение данных...",
          success: "Данные успешно сохранились",
          error: "Ошибка при сохранении данных",
        }
      );
      toggleEditingMode(false);
      // window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  const renderFields = () => {
    if (!fieldsConfig) {
      return <Spinner />;
    }
    const roleFields = fieldsConfig[userData?.role] || [];

    return roleFields.map((field) => {
      if (field.type === "select") {
        return (
          <Select
            key={field.name}
            disabled={field.disabled}
            isLoading={isLoading}
            name={field.name}
            value={editedData[field.name]}
            required
            onChange={handleChange}
            options={field.options}
            label={field.label}
            placeholder={field.placeholder}
            andClass="edit__select"
          />
        );
      } else {
        return (
          <Input
            key={field.name}
            type={field.type}
            disabled={field.disabled}
            isLoading={isLoading}
            name={field.name}
            value={editedData[field.name]}
            onChange={handleChange}
            required
            autoComplete="none"
            label={field.label}
            placeholder={field.placeholder}
            andClass="edit__input"
          />
        );
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSave} className="edit">
        <span className="edit__title">Персональные данные</span>
        <div className="edit__info">{renderFields()}</div>
        <span className="edit__title">Согласие пользователя</span>
        <div className="edit__checkbox">
          <Checkbox
            name="confidentiality_consent"
            checked={editedData.confidentiality_consent}
            onChange={handleChange}
          >
            Я ознакомлен с Политикой Конфиденциальности
          </Checkbox>
          <Checkbox
            name="personal_data_consent"
            checked={editedData.personal_data_consent}
            onChange={handleChange}
          >
            Я даю Согласие на обработку персональных данных
          </Checkbox>
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
