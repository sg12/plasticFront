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
    name: "status",
    placeholder: "Не указан",
    type: "select",
    options: [
      { value: "active", label: "Активный" },
      { value: "inactive", label: "Неактивный" },
    ],
    label: "Статус",
  },
];
