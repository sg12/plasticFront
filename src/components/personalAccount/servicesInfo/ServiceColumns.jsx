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
    {
      header: "Тип услуги",
      accessorKey: "type",
    },
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
        <div style={{ display: "flex", gap: "8px" }}>
          <Action actionType="edit" onClick={() => onEdit(row.index)} />
          <Action actionType="delete" onClick={() => onDelete(row.index)} />
        </div>
      ),
    },
  ];
};

export default ServicesColumns;
