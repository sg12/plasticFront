import { useUser } from "../../../context/UserContext";
import Table from "../../UI/table/Table"
import "./SpecialistInfo.scss";

const SpecialistInfo = () => {
  const { userType } = useUser();
  return (
    <div className="specialist">
      <span className="specialist__title">Ваши специалисты</span>
      {/* <Table userType="clinic/specialists"/> */}
    </div>
  )
}

export default SpecialistInfo