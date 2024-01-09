import { useMemo } from "react";
import styles from "./Table.module.scss";
import EditableCell from "./EditableCell.jsx";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import DATA from "./data.js";

const Table = ({ userType }) => {
  const data = useMemo(() => DATA, []);
  const columns = [
    // Doctor Column
    {
      userType: "doctor",
      header: "Услуги",
      accessorKey: "services",
      footer: "Services",
    },
    {
      userType: "doctor",
      header: "Стоимость",
      accessorKey: "costs",
      footer: "Costs",
    },
    {
      userType: "doctor",
      header: "Статус",
      accessorKey: "status",
      footer: "Status",
    },
    {
      userType: "doctor",
      header: "",
      accessorKey: "actions",
      footer: "",
      cell: EditableCell,
    },
    // Clinic Column
    {
      userType: "clinic",
      header: "Услуги",
      accessorKey: "services",
      footer: "Услуги",
    },
    {
      userType: "clinic",
      header: "Стоимость",
      accessorKey: "costs",
      footer: "Стоимость",
    },
    {
      userType: "clinic",
      header: "Статус",
      accessorKey: "status",
      footer: "Статус",
    },
    {
      userType: "clinic",
      header: "",
      accessorKey: "actions",
      footer: "",
      cell: EditableCell,
    },
    {
      userType: "clinic/specialists", 
      header: "№",
      accessorKey: "actions",
      footer: "№",
      cell: EditableCell,
    },
    {
      userType: "clinic/specialists", 
      header: "№",
      accessorKey: "id",
      footer: "№",
    },
    {
      userType: "clinic/specialists", 
      header: "ФИО",
      accessorKey: "full_name",
      footer: "ФИО",
    },
    {
      userType: "clinic/specialists", 
      header: "Специалисты",
      accessorKey: "specialists",
      footer: "Специалисты",
    },
    {
      userType: "clinic/specialists", 
      header: "Статус",
      accessorKey: "status",
      footer: "Статус",
    },
    {
      userType: "clinic/specialists", 
      header: "",
      accessorKey: "actions",
      footer: "",
      cell: EditableCell,
    },
  ];

  const filteredColumns = useMemo(
    () => columns.filter((column) => column.userType === userType),
    [columns, userType]
  );

  const table = useReactTable({
    data,
    columns: filteredColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className={styles.tr} key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className={styles.th} key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className={styles.tbody}>
          {table.getRowModel().rows.map((row) => (
            <tr className={styles.trData} key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td className={styles.td} key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {/* <tfoot className={styles.tfoot}>
          {table.getFooterGroups().map((footerGroup) => (
            <tr className={styles.tr} key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th className={styles.th} key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot> */}
      </table>
    </div>
  );
};

export default Table;
