import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import desc from "../../../assets/imgs/desc.svg";

import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import Field from "../../UI/fields/Field";
import Divider from "../../UI/dividers/Divider";
import Modal from "../../UI/modals/modal/Modal";
import Input from "../../UI/inputs/input/Input";

import PlasticServices from "../../../services/PlasticServices";

const ProfileUserFooter = ({ userData, fields }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(
    new Array(fields.length).fill(false)
  );
  const [modalData, setModalData] = useState(
    Object.fromEntries(fields.map((section) => [section.value, {}]))
  );
  const [additionally, setAdditionally] = useState({});

  const handleChange = (e, sectionValue) => {
    const { name, value } = e.target;
    setModalData((prevModalData) => ({
      ...prevModalData,
      [sectionValue]: {
        ...prevModalData[sectionValue],
        [name]: value,
      },
    }));
  };

  const toggleModal = (index) => {
    const newModalState = isModalOpen.map((isOpen, i) =>
      i === index ? !isOpen : false
    );
    setIsModalOpen(newModalState);
  };

  const handleSave = async (fieldType) => {
    try {
      setIsLoading(true);
      await toast.promise(
        PlasticServices.postAdditionally(fieldType, modalData[fieldType]),
        {
          pending: "Сохранение данных...",
          success: "Данные успешно сохранились",
          error: "Ошибка при сохранении данных",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          fields.map((section) =>
            PlasticServices.getAdditionally(userData?.role, section.value)
          )
        );
        const combinedData = fields.reduce((acc, section, index) => {
          acc[section.value] = responses[index];
          return acc;
        }, {});
        setAdditionally(combinedData);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, [fields, userData]);

  return (
    <div className="profile__footer">
      {userData?.role === "client" ? (
        <div className="profile__description">
          <img className="img" src={desc} alt="desc" />
          <div className="profile__description-text">
            <div className="text">
              Расскажите вашим близким и знакомым о нас, а мы поможем сэкономить
              их время на поиск нужного специалиста.
            </div>
            <div className="text">
              Количество пользователей, указавших Ваш ID при регистрации:{" "}
              {userData?.subs || "0"}
            </div>
            <div className="profile__discount">Персональная скидка 3%</div>
          </div>
        </div>
      ) : (
        <div className="profile__additionally">
          {fields.map((section, index) => (
            <div key={index} className={`profile__${section.value}`}>
              <Field
                label={section.label}
                values={(additionally[section.value] || []).map((item) =>
                  JSON.stringify(item)
                )}
              />
              <div className="profile__actions">
                <OutlineButton
                  style={{ border: "none" }}
                  onClick={() => toggleModal(index)}
                >
                  Добавить
                </OutlineButton>
              </div>
              {isModalOpen[index] && (
                <Modal
                  isFilterOpen={isModalOpen[index]}
                  title={section.label}
                  setIsFilterOpen={() => toggleModal(index)}
                  save={() => handleSave(section.value)}
                >
                  {section.fields.map((field, index) => (
                    <Input
                      key={index}
                      type={field.type}
                      name={field.name}
                      value={modalData[section.value][field.name] || ""}
                      isLoading={isLoading}
                      onChange={(e) => handleChange(e, section.value)}
                      required
                      autoComplete="none"
                      placeholder={field.label}
                      andClass="profile__input"
                    />
                  ))}
                </Modal>
              )}
              {index < fields.length - 1 && <Divider marginTop={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileUserFooter;
