import "./CardsItem.scss";

import women from "../../../assets/imgs/women.png";
import { useEffect, useState } from "react";
import ProfileServices from "../../../services/ProfileServices";

const CardsItem = ({ count, type }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedUserData = await ProfileServices.getUsers();
        setUserData(fetchedUserData);
        console.log(fetchedUserData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const renderCards = () => {
    const cards = [];
    for (let i = 0; i < count; i++) {
      if (type === "doctors") {
        cards.push(<DoctorCard key={i} user={userData} />);
      } else if (type === "clinics") {
        cards.push(<ClinicsCard key={i} user={userData} />);
      } else if (type === "all") {
        cards.push(
          <ClinicsCard key={i} user={userData} />,
          <DoctorCard key={i} user={userData} />
        );
      }
    }
    return cards; 
  };

  return <div className="cards">{renderCards()}</div>;
};

const DoctorCard = ({ isFavorite, user }) => {
  return (
    <div className={`card ${isFavorite ? "favorite" : ""}`}>
      <div className="card__body">
        <div className="card__photo">
          <img src={women} alt="some photo" />
        </div>
        <span className="card__name">{user?.name}</span>
        <span className="card__direction">Хирург</span>
        <div className="card__action">
          <button className="card__action-delete">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6.6361 8.00018V10.8335M9.36393 8.00018V10.8335M9.66667 4.00016C9.66667 3.63197 9.36819 3.3335 9 3.3335H7C6.63181 3.3335 6.33333 3.63197 6.33333 4.00016M3.90943 5.16685L4.46973 11.8343C4.55678 12.8703 5.42306 13.6669 6.4627 13.6669H9.53799C10.5776 13.6669 11.4439 12.8703 11.531 11.8343L12.0913 5.16685M3 5.06551H13"
                stroke="#3066BE"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const ClinicsCard = ({ isFavorite, user }) => {
  return (
    <div className={`card ${isFavorite ? "favorite" : ""}`}>
      <div className="card__body">
        <div className="card__photo">
          <img src="" alt="some photo" />
        </div>
        <span className="card__name">{user?.name}</span>
        <span className="card__direction">Все направления</span>
        <div className="card__action">
          <button className="card__action-delete">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6.6361 8.00018V10.8335M9.36393 8.00018V10.8335M9.66667 4.00016C9.66667 3.63197 9.36819 3.3335 9 3.3335H7C6.63181 3.3335 6.33333 3.63197 6.33333 4.00016M3.90943 5.16685L4.46973 11.8343C4.55678 12.8703 5.42306 13.6669 6.4627 13.6669H9.53799C10.5776 13.6669 11.4439 12.8703 11.531 11.8343L12.0913 5.16685M3 5.06551H13"
                stroke="#3066BE"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardsItem;