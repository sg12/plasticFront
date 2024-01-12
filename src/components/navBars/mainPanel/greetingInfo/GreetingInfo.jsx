import { Link } from "react-router-dom";
import "./GreetingInfo.scss";
import { useUser } from "../../../../context/UserContext";

const GreetingInfo = () => {
  const { userData, userType } = useUser();
  console.log(userData, userType);
  return (
    <div className="greeting">
      <span className="greeting__title">
        Добро пожаловать, {userData?.name}
      </span>
      {/* <span className="greeting__subtitle">Личный кабинет предоставляет универсальный доступ к вашим услугам, отзывам и т.д.</span> */}
      <Link to="/account/profile" className="greeting__link">
        Перейти в профиль
      </Link>
    </div>
  );
};

export default GreetingInfo;
