import { useUser } from "../../../context/UserContext";
import Dropdown from "../../UI/dropdown/Dropdown";
import Table from "../../UI/table/Table";
import "./ServicesInfo.scss";

const ServicesInfo = () => {
  const { userType } = useUser();
  return (
    <div className="services">
      <span className="services__title">Ваши услуги</span>
      <Table userType={userType} /> 
      {/* <Dropdown/> */}
      {/* <div className="services__footer">
         <div className="services__footer-gap">
          <span className="services__title">Категория и ученая степень</span>
          <div className="services__footer">
            <div className="services__footer-item-select">
              <select>
                <option>Пункт 1</option>
                <option>Пункт 2</option>
              </select>
            </div>
            <div className="services__footer-item-select">
              <select>
                <option>Пункт 1</option>
                <option>Пункт 2</option>
              </select>
            </div>
          </div>
        </div>
        <div className="services__footer-gap">
          <span className="services__title">Тип приема</span>
          <div className="services__footer">
            <div className="services__footer-item-input">
              <input type="button" value="Частная практика" />
            </div>
            <div className="services__footer-item-input">
              <input type="button" value="В клинике" />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ServicesInfo;
