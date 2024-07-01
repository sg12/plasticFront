import "../profileUser/ProfileUser.scss";
import { useUser } from "../../../context/UserContext";
import ProfileInfo from "../profileInfo/ProfileInfo";

const ProfileUser = () => {
  const { userData } = useUser();

  const handleDeleteAccount = () => {
    console.log("Account deleting");
  };

  let fieldsDetails = [];
  let fieldsFooter = [];

  if (userData) {
    switch (userData?.user?.type) {
      case "client":
        fieldsDetails = [
          { label: "Пол", value: "gender" },
          { label: "Дата рождения", value: "date_born" },
          { label: "Почта", value: "email" },
          { label: "Адрес", value: "address" },
        ];
        break;
      case "clinic":
        fieldsDetails = [
          { label: "Официальный сайт", value: "site" },
          { label: "Почта", value: "email" },
          { label: "Адрес", value: "address" },
        ];
        fieldsFooter = [{ label: "Лицензии и сертификаты", value: "licenses" }];
        break;
      case "surgeon":
        fieldsDetails = [
          { label: "Пол", value: "gender" },
          { label: "Дата рождения", value: "date_born" },
          { label: "Адрес", value: "address" },
          { label: "Официальный сайт", value: "site" },
        ];
        fieldsFooter = [
          { label: "Лицензии и сертификаты", value: "licenses" },
          { label: "Образование", value: "education" },
          { label: "Повышение квалификации", value: "qualification" },
          { label: "Опыт работы", value: "experience" },
        ];
        break;
      default:
        return "Неизвестный тип пользователя";
    }
  } else {
    return "Данные о пользователе не получены. Сервер в спячке";
  }

  return (
    <ProfileInfo
      userData={userData}
      handleDeleteAccount={handleDeleteAccount}
      fieldsDetails={fieldsDetails}
      fieldsFooter={fieldsFooter}
    />
  );
};

export default ProfileUser;
