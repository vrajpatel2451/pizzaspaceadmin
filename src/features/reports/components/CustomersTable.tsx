import { Table, type TableColumn } from "@/components/compound/table/Table";
import { routeConstants } from "@/routes/routeConstants";
import type { CustomerReportItem } from "@/types/analytics.types";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import ComparisonCell from "./ComparisonCell";

interface CustomersTableProps {
  data: CustomerReportItem[];
  isLoading?: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

const CustomersTable: FC<CustomersTableProps> = ({
  data,
  isLoading,
  onSort,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (row: CustomerReportItem) => {
    navigate(
      routeConstants.customerDetails
        .replace(":action", "view")
        .replace(":customerId", row.customerId),
    );
  };

  const columns: TableColumn<CustomerReportItem>[] = [
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
      header: "Phone",
      accessor: "phone",
      cell: (phone) => (
        <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
          {phone}
        </span>
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
      header: "Total Spent",
      accessor: "purchase",
      sortable: true,
      cell: (_, row) => (
        <ComparisonCell
          current={row.purchase}
          previous={row.comparePurchase}
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

export default CustomersTable;
