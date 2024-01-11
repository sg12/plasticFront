import EditableCell from "../EditableCell.jsx";
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
      cell: EditableCell,
    },
  ];
};

export default ServicesColumns;
