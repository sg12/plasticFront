// import ControlModal from "../../modals/controlModal/ControlModal.jsx";
// import EditableCell from "../EditableCell.jsx";
import Action from "../../actions/Action.jsx";
// import Checkbox from "../../checkbox/Checkbox.jsx";

const ServicesColumns = ({ table, rowSelection, handleRowCheckboxChange }) => {
  return [
    {
      header: "Услуги",
      accessorKey: "services",
    },
    {
      header: "Стоимость",
      accessorKey: "costs",
    },
    {
      header: "Статус",
      accessorKey: "status",
    },
    {
      header: "",
      accessorKey: "actions",
      cell: <Action actionType="more" />,
    },
  ];
};

export default ServicesColumns;
