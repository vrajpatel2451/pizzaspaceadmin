import { Button } from "@/components/base/Button";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import type {
  CategoryResponse,
  SubCategoryResponse,
} from "@/types/category.types";
import { Plus } from "lucide-react";
import { useMemo, type FC } from "react";

export type MenuParameters = {
  selectedCategory: CategoryResponse;
  selectedSubCategory?: SubCategoryResponse;
};

type Props = {
  selectedParameters: MenuParameters;
};

const ProductDragSection: FC<Props> = (props) => {
  const { selectedParameters } = props;
  const { selectedCategory, selectedSubCategory } = selectedParameters || {};
  const { name: categoryName } = selectedCategory || {};
  const { name: subCategoryName } = selectedSubCategory || {};

  const breadcrumbs = useMemo(() => {
    const breadcrumbs: BreadcrumbItem[] = [];
    if (selectedCategory) {
      breadcrumbs.push({
        label: `${categoryName}`,
        to: "",
      });
    } else {
      breadcrumbs.push({
        label: "Menu Items",
        to: "",
      });
    }
    if (selectedSubCategory) {
      breadcrumbs.push({
        label: `${subCategoryName} (10)`,
        to: "",
      });
    }
    return breadcrumbs;
  }, [categoryName, selectedCategory, selectedSubCategory, subCategoryName]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="bg-pl-500 flex w-full items-center gap-4 p-4">
        <Breadcrumbs breadcrumbs={breadcrumbs} className="!text-nl-50" />
        <Button
          startIcon={<Plus />}
          size="sm"
          color="neutral"
          className="ml-auto"
        >
          Add Item
        </Button>
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <p>
          Parameters: {JSON.stringify(selectedCategory)}{" "}
          {JSON.stringify(selectedSubCategory)}
        </p>
      </div>
    </div>
  );
};

export default ProductDragSection;
