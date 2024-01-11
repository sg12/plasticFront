import React from "react";
import Checkbox from "../../checkbox/Checkbox.jsx";
import styles from "../Table.module.scss";
import Action from "../../actions/Action.jsx";
import OutlineButton from "../../buttons/outlineButton/OutlineButton.jsx";
import { useNavigate } from "react-router-dom";
// import { useUser } from "../../../../context/UserContext.jsx";

const ClinicSpecialistsColumns = ({
  table,
  rowSelection,
  handleRowCheckboxChange,
}) => {
  const navigate = useNavigate();
//   const { userData } = useUser();

  const handleUserPageNavigation = (row) => {
    const userId = row.id;
    navigate(`/users/${userId}`);
  };

//   const handleRefresh = () => {
//     // userData;
//     console.log("Таблица обновлена!", userData);
//   };

//   const handleFilter = () => {
//     // Здесь можете добавить логику фильтрации, если это нужно
//     console.log("Применена фильтрация!");
//   };

//   const handleMoreOptions = () => {
//     // Здесь можете добавить логику для отображения дополнительных опций
//     console.log("Показаны дополнительные опции!");
//   };

  return [
    {
      id: "select",
      header: () => (
        <div className={styles.checkbox}>
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        </div>
      ),
      accessorKey: "select",
      cell: ({ row }) => (
        <Checkbox
          checked={rowSelection[row.id]}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={() => handleRowCheckboxChange(row)}
        />
      ),
    },
    {
      header: "№",
      accessorKey: "id",
    },
    {
      header: "ФИО",
      accessorKey: "fullName",
    },
    {
      header: "Специалисты",
      accessorKey: "specialists",
    },
    {
      header: "Статус",
      accessorKey: "status",
    },
    {
      header: (
        <Action />
      ),
      accessorKey: "actions",
      cell: ({ row }) => (
        <OutlineButton
          children="Перейти"
          onClick={() => handleUserPageNavigation(console.log(row))}
        />
      ),
    },
  ];
};

export default ClinicSpecialistsColumns;
