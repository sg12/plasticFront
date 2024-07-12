import Action from "../../../UI/actions/Action";
import Checkbox from "../../../UI/inputs/checkbox/Checkbox";

const ServicesColumns = () => {
  const columns = [
    {
      header: "Действие",
      accessorKey: "selected",
      cell: ({ row }) => <Checkbox />,
    },
    {
      header: "Услуга",
      accessorKey: "specialty",
      cell: ({ row }) => row.original.specialty.name,
    },
    {
      header: "Стоимость",
      accessorKey: "costs",
      cell: ({ row }) => row.original.price + " ₽",
    },
  ];

  return columns;
};

export default ServicesColumns;
