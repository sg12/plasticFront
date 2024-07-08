import PlasticServices from "../../../services/PlasticServices";

const fetchLocation = async () => {
  return await PlasticServices.getLocation();
};

export const fieldsConfig = fetchLocation().then((location) => ({
  client: [
    {
      name: "fio",
      placeholder: "Не указан",
      type: "text",
      label: "ФИО",
    },
    {
      name: "phone",
      placeholder: "Не указан",
      type: "tel",
      label: "Телефон",
    },
    {
      name: "gender",
      placeholder: "Не указан",
      type: "select",
      options: [
        { value: "", label: "Не указан" },
        { value: "male", label: "Мужской" },
        { value: "female", label: "Женский" },
      ],
      label: "Пол",
    },
    {
      name: "email",
      placeholder: "Не указан",
      type: "email",
      label: "Почта",
      disabled: true,
    },
  ],
  clinic: [
    {
      name: "name",
      placeholder: "Не указан",
      type: "text",
      label: "Наименование",
    },
    {
      name: "official_name",
      placeholder: "Не указан",
      type: "text",
      label: "Офф. наименование",
    },
    {
      name: "phone",
      placeholder: "Не указан",
      type: "tel",
      label: "Телефон",
    },
    {
      name: "director",
      placeholder: "Не указан",
      type: "text",
      label: "Директор",
    },
    {
      name: "description",
      placeholder: "Не указан",
      type: "text",
      label: "Описание",
    },
    {
      name: "site",
      placeholder: "Не указан",
      type: "text",
      label: "Сайт",
    },
    {
      name: "address",
      placeholder: "Не указан",
      type: "text",
      label: "Адрес",
    },
    {
      name: "metro",
      type: "select",
      options: [
        { value: "", label: "Не указан" },
        ...location.metro.map((m) => ({ value: m.id, label: m.name })),
      ],
      label: "Метро",
    },
    {
      name: "district",
      type: "select",
      options: [
        { value: "", label: "Не указан" },
        ...location.districts.map((d) => ({
          value: d.id,
          label: d.name,
        })),
      ],
      label: "Район",
    },
    {
      name: "city",
      type: "select",
      options: [
        { value: "", label: "Не указан" },
        ...location.cities.map((c) => ({ value: c.id, label: c.name })),
      ],
      label: "Город",
    },
    {
      name: "email",
      placeholder: "Не указан",
      type: "email",
      label: "Почта",
      disabled: true,
    },
  ],
  doctor: [
    { name: "fio", placeholder: "Не указан", type: "text", label: "ФИО" },
    { name: "site", placeholder: "Не указан", type: "url", label: "Сайт" },
    {
      name: "address",
      placeholder: "Не указан",
      type: "text",
      label: "Адрес",
    },
    {
      name: "phone",
      placeholder: "Не указан",
      type: "tel",
      label: "Телефон",
    },
    {
      name: "description",
      placeholder: "Не указан",
      type: "tel",
      label: "Описание",
    },
    {
      name: "experience",
      placeholder: "Не указан",
      type: "text",
      label: "Стаж",
    },
    {
      name: "category",
      type: "select",
      options: [
        { value: "", label: "Не указан" },
        { value: "1", label: "Первая" },
        { value: "2", label: "Вторая" },
        { value: "3", label: "Третья" },
      ],
      label: "Категория",
    },
    {
      name: "degree",
      type: "select",
      options: [
        { value: "", label: "Не указан" },
        { value: "1", label: "Кандидат медицинских наук" },
        { value: "2", label: "Доктор медицинских наук" },
        { value: "3", label: "Профессор" },
      ],
      label: "Ученая степень",
    },
    {
      name: "email",
      placeholder: "Не указан",
      type: "email",
      label: "Почта",
      disabled: true,
    },
  ],
}));
