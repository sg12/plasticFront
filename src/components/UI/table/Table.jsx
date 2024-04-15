import React, { useMemo, useState, useRef } from "react";
import styles from "./Table.module.scss";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
// import DATA from "./data.js";
import Checkbox from "../checkbox/Checkbox.jsx";
import ServicesColumns from "./columns/ServiceColumns.jsx";
import ClinicSpecialistsColumns from "./columns/ClinicSpecialistsColumns.jsx";

const Table = ({ userType, userData }) => {
  const [rowSelection, setRowSelection] = useState({});

  const isAnyRowSelected = () => {
    return Object.values(rowSelection).some((isSelected) => isSelected);
  };

  const getHeaderCheckboxProps = () => {
    const allRowsSelected = table.getIsAllRowsSelected();
    return {
      checked: isAnyRowSelected(),
      indeterminate: !allRowsSelected && isAnyRowSelected(),
      onChange: handleHeaderCheckboxChange,
    };
  };

  const handleHeaderCheckboxChange = () => {
    const allRowsSelected = table.getIsAllRowsSelected();
    const newSelection = {};

    table.getRowModel().rows.forEach((row) => {
      newSelection[row.id] = !allRowsSelected;
    });

    setRowSelection(newSelection);
  };

  const handleRowCheckboxChange = (row) => {
    const newSelection = { ...rowSelection, [row.id]: !rowSelection[row.id] };
    setRowSelection(newSelection);
  };

  let columns;
  if (userType === "clinic/specialists") {
    columns = ClinicSpecialistsColumns({
      rowSelection,
      handleRowCheckboxChange,
    });
  } else {
    columns = ServicesColumns({ rowSelection, handleRowCheckboxChange });
  }

  const table = useReactTable({
    data: userData,
    columns,
    enableRowSelection: true,
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
                  {header.column.id === "select" ? (
                    <Checkbox {...getHeaderCheckboxProps()} />
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
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
                  {cell.column.id === "select" ? (
                    <Checkbox
                      checked={rowSelection[row.id]}
                      disabled={!row.getCanSelect()}
                      indeterminate={row.getIsSomeSelected()}
                      onChange={() => handleRowCheckboxChange(row)}
                    />
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
