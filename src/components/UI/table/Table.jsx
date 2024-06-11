import React from "react";
import styles from "./Table.module.scss";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const Table = ({ columns, data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
    </table>
  );
};

export default Table;
