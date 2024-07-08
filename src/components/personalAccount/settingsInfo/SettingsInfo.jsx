import "./SettingsInfo.scss";
import PlasticServices from "../../../services/PlasticServices";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import Input from "../../UI/inputs/input/Input";

const SettingsInfo = () => {
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const oldPassword = e.target.elements.oldPassword.value;
    const newPassword = e.target.elements.newPassword.value;

    try {
      // Ваш код для изменения пароля
      await PlasticServices.changePassword(oldPassword, newPassword);
      alert("Пароль успешно изменён!");
    } catch (error) {
      console.error("Ошибка при изменении пароля:", error);
      alert(
        "Произошла ошибка при изменении пароля. Пожалуйста, попробуйте ещё раз."
      );
    }
  };

  return (
    <div className="settings">
      <span className="settings__title">Изменить пароль</span>
      <form className="settings__password" onSubmit={handleChangePassword}>
        <Input placeholder={"Старый пароль"} />
        <Input placeholder={"Новый пароль"} />
        <OutlineButton type="submit">Изменить пароль</OutlineButton>
      </form>
    </div>
  );
};

export default SettingsInfo;
