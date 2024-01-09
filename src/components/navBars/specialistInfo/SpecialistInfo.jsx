import { useUser } from "../../../context/UserContext";
import Table from "../../UI/table/Table"

const SpecialistInfo = () => {
  const { userType } = useUser();
  return (
    <div>
      <span>Ваши специалисты</span>
      <Table userType="clinic/specialists"/>
    </div>
  )
}

export default SpecialistInfo