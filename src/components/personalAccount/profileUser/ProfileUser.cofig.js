export default function ProfileUserConfig(userData) {
  if (!userData) {
    return { error: "Данные о пользователе не получены. Сервер в спячке" };
  }

  const configurations = {
    client: {
      fieldsDetails: [
        { label: "Пол", value: "gender" },
        { label: "Дата рождения", value: "date_born" },
        { label: "Почта", value: "email" },
        { label: "Адрес", value: "address" },
      ],
      fieldsFooter: [],
    },
    clinic: {
      fieldsDetails: [
        { label: "Адрес", value: "address" },
        { label: "Почта", value: "email" },
        { label: "Официальный сайт", value: "site" },
      ],
      // fieldsFooter: [
      //   {
      //     label: "Лицензии и сертификаты",
      //     value: "licenses",
      //     fields: [{ name: "image", type: "image", label: "Скан изображения" }],
      //   },
      // ],
    },
    doctor: {
      fieldsDetails: [
        { label: "Адрес", value: "address" },
        { label: "Официальный сайт", value: "site" },
        { label: "Опыт работы", value: "experience" },
      ],
      fieldsFooter: [
        {
          label: "Образование",
          value: "educations",
          fields: [
            { name: "place", type: "text", label: "Учебное заведение" },
            { name: "date", type: "date", label: "Дата выпуска" },
          ],
        },
        {
          label: "Повышение квалификации",
          value: "qualifications",
          fields: [
            { name: "retraining", type: "text", label: "Название курса" },
            { name: "date", type: "date", label: "Дата окончания" },
          ],
        },
        // {
        //   label: "Лицензии и сертификаты",
        //   value: "licenses",
        //   fields: [{ name: "image", type: "image", label: "Скан изображения" }],
        // },
      ],
    },
  };

  const config = configurations[userData.role];

  if (!config) {
    return { error: "Неизвестный тип пользователя" };
  }

  return config;
}
