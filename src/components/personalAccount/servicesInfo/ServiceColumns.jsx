import Action from "../../UI/actions/Action";

const ServicesColumns = ({ onEdit, onDelete }) => {
  return [
    {
      header: "Наименование услуги",
      accessorKey: "services",
    },
    {
      header: "Стоимость",
      accessorKey: "costs",
    },
    // {
    //   header: "Тип услуги",
    //   accessorKey: "serviceType",
    // },
    {
      header: "Тип приёма",
      accessorKey: "reception",
    },
    {
      header: "Статус",
      accessorKey: "status",
    },
    {
      header: "Действия",
      accessorKey: "actions",
      cell: ({ row }) => (
        <>
          <Action actionType="edit" onClick={() => onEdit(row.index)} />
          <Action actionType="delete" onClick={() => onDelete(row.index)} />
        </>
      ),
    },
  ];
};

export default ServicesColumns;
