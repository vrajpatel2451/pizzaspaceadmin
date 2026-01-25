import { Table, type TableColumn } from "@/components/compound/table/Table";
import { routeConstants } from "@/routes/routeConstants";
import type { StoreReportItem } from "@/types/analytics.types";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import ComparisonCell from "./ComparisonCell";

interface StoresTableProps {
  data: StoreReportItem[];
  isLoading?: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

const StoresTable: FC<StoresTableProps> = ({
  data,
  isLoading,
  onSort,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (row: StoreReportItem) => {
    navigate(
      routeConstants.storesDetails
        .replace(":action", "view")
        .replace(":storeId", row.storeId),
    );
  };

  const columns: TableColumn<StoreReportItem>[] = [
    {
      header: "Store Name",
      accessor: "name",
      cell: (name) => (
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {name}
        </span>
      ),
    },
    {
      header: "City",
      accessor: "city",
      cell: (city) => (
        <span className="text-slate-600 dark:text-slate-400">{city}</span>
      ),
    },
    {
      header: "Orders",
      accessor: "orders",
      sortable: true,
      cell: (_, row) => (
        <ComparisonCell
          current={row.orders}
          previous={row.compareOrders}
          format="number"
        />
      ),
    },
    {
      header: "Revenue",
      accessor: "revenue",
      sortable: true,
      cell: (_, row) => (
        <ComparisonCell
          current={row.revenue}
          previous={row.compareRevenue}
          format="currency"
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isLoading}
      size="md"
      sortable
      onSort={(column) => onSort(column as string)}
      onRowClick={handleRowClick}
      className="cursor-pointer"
    />
  );
};

export default StoresTable;
