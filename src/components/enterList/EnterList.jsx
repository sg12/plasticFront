import "./EnterList.scss";

import enter1 from "../../assets/icons/enterLogo.png";
import { Outlet } from "react-router-dom";

const EnterList = () => {
  return (
    <div className="enter">
      <div className="enter__container">
        <img className="enter__logo" src={enter1} alt="Лого" />
        <Outlet />
        <p className="enter__copyright">© Copyright 2023 Plastic Beauty</p>
      </div>
    </div>
  );
};

export default EnterList;