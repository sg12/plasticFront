import "./DoctorsCardsItem.scss";

import { useNavigate } from "react-router-dom";
import Review from "../review/Review";
import Admission from "../admission/Admission";
import Avatar from "../UI/avatar/Avatar";
import { FaUserDoctor } from "react-icons/fa6";
import OutlineButton from "../UI/buttons/outlineButton/OutlineButton";
import Divider from "../UI/dividers/Divider";
import { useWindowSize } from "@siberiacancode/reactuse";

const DoctorsCardsItem = ({ doctor }) => {
  const navigate = useNavigate();
  const { width } = useWindowSize();

  const toDetailedPage = () => {
    navigate(`/doctors/${doctor.id}`);
  };

  return (
    <li className="doctors-cards-item">
      <div className="doctors-cards-item__left">
        <div className="doctors-cards-item__avatar">
          <Avatar icon={<FaUserDoctor />} size={"large"} />
          <OutlineButton
            onClick={toDetailedPage}
            className="doctors-cards-item__button"
          >
            Перейти
          </OutlineButton>
          <Review reviewCount={doctor?.reviews_count} rating={doctor?.rating} />
        </div>
        <div className="doctors-cards-item__info">
          <span className="doctors-cards-item__name">{doctor.fio}</span>
          <span className="doctors-cards-item__experience">
            Стаж {doctor.experience} года/лет
          </span>
          <span className="doctors-cards-item__degree">{doctor.degree}</span>
          <span className="doctors-cards-item__category">
            {doctor.category}
          </span>
        </div>
      </div>

      {width <= 768 && <Divider />}

      <div className="doctors-cards-item__right">
        <span className="doctors-cards-item__clinic">
          {doctor.clinic?.name || "Нет названия клиники"}
        </span>
        <span className="doctors-cards-item__address">
          {doctor.clinic?.address || "Не задан адрес"}
        </span>
      </div>
    </li>
  );
};

export default DoctorsCardsItem;
