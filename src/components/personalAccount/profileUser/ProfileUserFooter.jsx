import { useState } from "react";
import { toast } from "react-toastify";

import desc from "../../../assets/imgs/desc.svg";

import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import Additionally from "../../UI/fields/Additionally";
import Divider from "../../UI/dividers/Divider";
import Modal from "../../UI/modals/modal/Modal";
import Input from "../../UI/inputs/input/Input";

import PlasticServices from "../../../services/PlasticServices";
import { useMutation, useQuery } from "@siberiacancode/reactuse";
import Spinner from "../../UI/preloader/Spinner";

const ProfileUserFooter = ({ userData, fields }) => {
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

  const { isLoading, isError, isSuccess, error, refetch } = useQuery(
    async () => {
      const responses = await Promise.all(
        fields.map((section) =>
          PlasticServices.getAdditionally(userData?.role, section.value)
        )
      );
      return fields.reduce((acc, section, index) => {
        acc[section.value] = responses[index];
        return acc;
      }, {});
    },
    {
      onSuccess: (data) => {
        setAdditionally(data);
      },
      onError: (error) => {
        console.log("Ошибка при получении данных", error);
      },
      keys: [userData, fields],
    }
  );

  const mutation = useMutation(async (fieldType) => {
    const data = modalData[fieldType];

    const areAllFieldsFilled = Object.values(data).every(
      (value) => value.trim() !== ""
    );

    if (!areAllFieldsFilled) {
      toast.warn("Пожалуйста, заполните все поля");
    } else {
      try {
        await PlasticServices.postAdditionally(
          userData?.role,
          fieldType,
          modalData[fieldType]
        );
        toast.success("Данные успешно сохранились");
        refetch();
      } catch (error) {
        toast.error("Ошибка при сохранении или поля не заполненные");
        console.error("Ошибка при сохранении данных:", error);
      }
    }
  });

  const deleteMutation = useMutation(async ({ fieldType, id }) => {
    try {
      await PlasticServices.deleteAdditionally(userData?.role, fieldType, id);
      toast.success("Данные успешно удалены");
      refetch();
    } catch (error) {
      toast.error("Ошибка при удалении данных");
      console.error("Ошибка при удалении данных:", error);
    }
  });

  const handleDelete = (fieldType, id) => {
    deleteMutation.mutate({ fieldType, id });
  };

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
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <div>Ошибка: {error.message}</div>
          ) : isSuccess ? (
            fields.map((section, index) => (
              <div key={index} className={`profile__${section.value}`}>
                <Additionally
                  label={section.label}
                  values={(additionally[section.value] || []).map(
                    (item) => item
                  )}
                  fields={fields}
                  onDelete={(id) => handleDelete(section.value, id)}
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
                    isModalOpen={isModalOpen[index]}
                    title={section.label}
                    setIsModalOpen={() => toggleModal(index)}
                    save={() => mutation.mutate(section.value)}
                  >
                    {section.fields.map((field, index) => (
                      <Input
                        key={index}
                        type={field.type}
                        name={field.name}
                        value={modalData[section.value][field.name] || ""}
                        isLoading={mutation.isLoading}
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
            ))
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ProfileUserFooter;
