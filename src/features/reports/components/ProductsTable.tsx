import { Table, type TableColumn } from "@/components/compound/table/Table";
import { routeConstants } from "@/routes/routeConstants";
import type { ProductReportItem } from "@/types/analytics.types";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import ComparisonCell from "./ComparisonCell";

interface ProductsTableProps {
  data: ProductReportItem[];
  isLoading?: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

const ProductsTable: FC<ProductsTableProps> = ({
  data,
  isLoading,
  onSort,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (row: ProductReportItem) => {
    navigate(
      routeConstants.productDetails
        .replace(":action", "view")
        .replace(":productId", row.productId),
    );
  };

  const columns: TableColumn<ProductReportItem>[] = [
    {
      header: "Product Name",
      accessor: "name",
      cell: (name) => (
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {name}
        </span>
      ),
    },
    {
      header: "Order Count",
      accessor: "orderCount",
      sortable: true,
      cell: (_, row) => (
        <ComparisonCell
          current={row.orderCount}
          previous={row.compareOrderCount}
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

export default ProductsTable;
