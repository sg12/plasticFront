import { Link } from "react-router-dom";
import "./GreetingInfo.scss";
import { useUser } from "../../../../context/UserContext";
import { useEffect, useState } from "react";

const GreetingInfo = () => {
  const { userData, userType } = useUser();
  const [time, setTime] = useState(new Date());
  // console.log(time);

  // const mockHour = 11;
  // useEffect(() => {
  //   const updatedTime = new Date(time);
  //   updatedTime.setHours(mockHour);
  //   setTime(updatedTime);
  // }, []);

  const currentHour = time.getHours();
  const greeting =
    currentHour >= 6 && currentHour < 12
      ? "Доброе утро"
      : currentHour >= 12 && currentHour < 18
      ? "Добрый день"
      : currentHour >= 18 && currentHour < 24
      ? "Добрый вечер"
      : "Доброй ночи";

  // console.log(currentHour);

  return (
    <div className="greeting">
      <span className="greeting__title">
        {greeting}, {userData?.name || "Неизвестно"}
      </span>
      <Link to="/account/profile" className="greeting__link">
        Перейти в профиль
      </Link>
    </div>
  );
};

export default GreetingInfo;
