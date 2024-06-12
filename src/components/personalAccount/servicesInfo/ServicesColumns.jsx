import React, { useState, useEffect } from "react";
import Action from "../../UI/actions/Action";

const ServicesColumns = ({ onEdit, onDelete }) => {
  const [isMobile, setIsMobile] = useState(true);
  console.log(isMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function getStatus(status) {
    console.log(status);
    return status === "Активный" || status === "active" ? (
      <>🟢</>
    ) : status === "Неактивный" || status === "inactive" ? (
      <>🔴</>
    ) : null;
  }

  const columns = [
    {
      header: "Услуга",
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
      cell: ({ row }) => getStatus(row.original.status),
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

  return isMobile
    ? columns.filter(
        (column) => !["costs", "type", "reception"].includes(column.accessorKey)
      )
    : columns;
};

export default ServicesColumns;
