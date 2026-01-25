import { Table, type TableColumn } from "@/components/compound/table/Table";
import { routeConstants } from "@/routes/routeConstants";
import type { DeliveryBoyReportItem } from "@/types/analytics.types";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import ComparisonCell from "./ComparisonCell";

interface DeliveryBoysTableProps {
  data: DeliveryBoyReportItem[];
  isLoading?: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

const DeliveryBoysTable: FC<DeliveryBoysTableProps> = ({
  data,
  isLoading,
  onSort,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (row: DeliveryBoyReportItem) => {
    navigate(
      routeConstants.staffDetails
        .replace(":action", "view")
        .replace(":staffId", row.staffId),
    );
  };

  const columns: TableColumn<DeliveryBoyReportItem>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (name) => (
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {name}
        </span>
      ),
    },
    {
      header: "Store",
      accessor: "storeName",
      cell: (storeName) => (
        <span className="text-slate-600 dark:text-slate-400">{storeName}</span>
      ),
    },
    {
      header: "Avg Rating",
      accessor: "averageRatings",
      sortable: true,
      cell: (_, row) => (
        <ComparisonCell
          current={row.averageRatings}
          previous={row.compareAverageRatings}
          format="rating"
          showPercentChange={false}
        />
      ),
    },
    {
      header: "Orders Completed",
      accessor: "ordersCompleted",
      sortable: true,
      cell: (_, row) => (
        <ComparisonCell
          current={row.ordersCompleted}
          previous={row.compareOrdersCompleted}
          format="number"
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

export default DeliveryBoysTable;
