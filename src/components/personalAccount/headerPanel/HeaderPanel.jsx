import { Link, useNavigate } from "react-router-dom";
import PlasticServices from "../../../services/PlasticServices";

import logo from "../../../assets/icons/logoNew.svg";

import "./HeaderPanel.scss";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import { MdOutlineExitToApp } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

const HeaderPanel = ({ onToggleAside }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await PlasticServices.logoutUser();
    navigate(
      "/enterPage",
      setTimeout(() => window.location.reload(), 0)
    );
  };
  return (
    <header className="account__header">
      <div className="header__burger-icon" onClick={onToggleAside}>
        <RxHamburgerMenu size={24} />
      </div>
      <div className="header__logoAccount">
        <Link className="header__logoAccount-link" to={"/"}>
          <img src={logo} alt="logo" />
        </Link>
        {/* <Link className="header__logo-link" to={"/"}>
              <span className="header__logo-link">На главную</span>
            </Link> */}
      </div>
      <OutlineButton
        onClick={handleLogout}
        style={{ height: "100%", color: "rgb(206, 44, 49)" }}
      >
        <MdOutlineExitToApp size={24} />
      </OutlineButton>
    </header>
  );
};

export default HeaderPanel;
