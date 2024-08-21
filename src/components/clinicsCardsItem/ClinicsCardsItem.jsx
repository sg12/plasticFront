import "./ClinicsCardsItem.scss";

import { useNavigate } from "react-router-dom";

import Review from "../review/Review";

import OutlineButton from "../UI/buttons/outlineButton/OutlineButton";
import Avatar from "../UI/avatar/Avatar";
import { FaClinicMedical } from "react-icons/fa";
import Divider from "../UI/dividers/Divider";
import { useWindowSize } from "@siberiacancode/reactuse";

const ClinicsCardsItem = ({ clinics }) => {
  const navigate = useNavigate();
  const { width } = useWindowSize();

  const toDetailedPage = () => {
    navigate(`/clinics/${clinics.id}`);
  };

  return (
    <li className="clinics-cards-item">
      <div className="clinics-cards-item__left">
        <div className="clinics-cards-item__avatar">
          <Avatar icon={<FaClinicMedical />} size={"large"} />
          <OutlineButton
            onClick={toDetailedPage}
            className="clinicss-cards-item__button"
          >
            Перейти
          </OutlineButton>
          <Review
            reviewCount={clinics?.reviews_count || 0}
            rating={clinics?.rating || 0}
          />
        </div>
        <div className="doctors-cards-item__info">
          <span className="doctors-cards-item__name">{clinics?.name}</span>
        </div>
      </div>

      {/* {width <= 768 && <Divider />} */}
    </li>
  );
};

export default ClinicsCardsItem;
