import PlasticServices from "../../../services/PlasticServices";

const specializations = await PlasticServices.getSpecializations();

export const fieldsConfig = [
  {
    name: "name",
    placeholder: "Не указан",
    type: "text",
    label: "Наименование услуги",
  },
  {
    name: "price",
    placeholder: "Не указан",
    type: "text",
    label: "Стоимость",
  },
  {
    name: "speciality",
    placeholder: "Не указан",
    type: "select",
    options: [
      { value: "", label: "Выберите специальность" },
      ...specializations.data.map((spec) => ({
        value: spec.id,
        label: spec.name,
      })),
    ],
    label: "Специальность",
  },
  {
    name: "status",
    placeholder: "Не указан",
    type: "select",
    options: [
      { value: "", label: "Выберите статус" },
      { value: "true", label: "Активный" },
      { value: "false", label: "Неактивный" },
    ],
    label: "Статус",
  },
];
