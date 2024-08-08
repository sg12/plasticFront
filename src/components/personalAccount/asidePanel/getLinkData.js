import profile from "../../../assets/icons/profile.svg";
import favourites from "../../../assets/icons/favourites.svg";
import services from "../../../assets/icons/services.svg";
import clinics from "../../../assets/icons/clinics.svg";
import specialist from "../../../assets/icons/specialist.svg";
import appointment from "../../../assets/icons/appointment.svg";
import reviews from "../../../assets/icons/reviews.svg";
import setting from "../../../assets/icons/setting.svg";
import help from "../../../assets/icons/help.svg";
import support from "../../../assets/icons/support.svg";
import appointmentHistory from "../../../assets/icons/appointmentHistory.svg";
import Divider from "../../UI/dividers/Divider";

export default function getLinkData(userType) {
  switch (userType) {
    case "client":
      return [
        { to: "profile", text: "Профиль", icon: profile },
        { to: "favourites", text: "Избранное", icon: favourites },
        { to: "appointment", text: "Запись на приём", icon: appointment },
        {
          to: "appointment-history",
          text: "История записей",
          icon: appointmentHistory,
        },
        { to: "reviews", text: "Отзывы", icon: reviews },
        // { to: "settings", text: "Настройки", icon: setting },
        { to: "help", text: "Помощь", icon: help },
        { to: "support", text: "Поддержка", icon: support },
      ];
    case "doctor":
      return [
        { to: "profile", text: "Профиль", icon: profile },
        { to: "clinic", text: "Клиника", icon: specialist },
        { to: "service", text: "Услуги", icon: services },
        {
          to: "appointment",
          text: "Записи пациентов",
          icon: appointment,
          disabled: true,
        },
        {
          to: "appointment-history",
          text: "История записей",
          icon: appointmentHistory,
        },
        { to: "reviews", text: "Отзывы пациентов", icon: reviews },
        // { to: "settings", text: "Настройки", icon: setting },
        { to: "help", text: "Помощь", icon: help },
        { to: "support", text: "Поддержка", icon: support },
      ];
    case "clinic":
      return [
        { to: "profile", text: "Профиль", icon: profile },
        { to: "specialist", text: "Специалисты", icon: specialist },
        { to: "service", text: "Услуги", icon: services },
        {
          to: "appointment",
          text: "Записи пациентов",
          icon: appointment,
          disabled: true,
        },
        {
          to: "appointment-history",
          text: "История записей",
          icon: appointmentHistory,
        },
        { to: "reviews", text: "Отзывы пациентов", icon: reviews },
        // { to: "settings", text: "Настройки", icon: setting },
        { to: "help", text: "Помощь", icon: help },
        { to: "support", text: "Поддержка", icon: support },
      ];
    default:
      return [
        {
          to: "undefined",
          text: "Неизвестный тип пользователя",
          icon: profile,
          disabled: true,
        },
      ];
  }
}
