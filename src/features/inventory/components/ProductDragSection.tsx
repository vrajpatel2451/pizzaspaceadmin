import { Button } from "@/components/base/Button";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import NoDataFound from "@/components/compound/NoDataFound";
import { toast } from "@/components/compound/Sonner";
import Spinner from "@/components/compound/spinner/Spinner";
import { useToggle } from "@/hooks/useToggle";
import { productApiService } from "@/infrastructure/ProductApiService";
import { routeConstants } from "@/routes/routeConstants";
import type {
  CategoryResponse,
  SortOrderUpdateEntry,
  SubCategoryResponse,
} from "@/types/category.types";
import type {
  ProductQueryParams,
  ProductResponse,
} from "@/types/product.types";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAllProductList } from "../hooks";
import ProductCard from "./ProductCard";

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
  const { name: categoryName, _id: categoryId } = selectedCategory || {};
  const { name: subCategoryName, _id: subCategoryId } =
    selectedSubCategory || {};
  const navigate = useNavigate();

  const handleAddItem = useCallback(() => {
    const url = routeConstants.productDetails
      .replace(":action", "create")
      .replace(":productId", "new");
    const params = new URLSearchParams();
    if (categoryId) params.set("categoryId", categoryId);
    if (subCategoryId) params.set("subCategoryId", subCategoryId);
    navigate(`${url}?${params.toString()}`);
  }, [navigate, categoryId, subCategoryId]);

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

  const params = useMemo<ProductQueryParams>(
    () => ({
      all: true,
      categoryId,
      subCategoryId,
    }),
    [categoryId, subCategoryId],
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Disable auto-fetch when no category is selected
  const shouldFetch = Boolean(categoryId);
  const { data, isFetching, isError, errorMessage, refetch } =
    useFetchAllProductList(params, !shouldFetch);
  const { data: dProductList } = data || {};

  const [productList, setProductList] = useState<ProductResponse[]>([]);
  useEffect(() => {
    setProductList(dProductList);
  }, [dProductList]);

  const {
    isOpen: isSorting,
    open: startSorting,
    close: stopSorting,
  } = useToggle();
  const onSort = useCallback(
    async (entries: SortOrderUpdateEntry[]) => {
      startSorting();
      const { data, success, errorMessage } =
        await productApiService.sortBulk(entries);
      if (success) {
        setProductList(data);
      } else {
        toast.error(errorMessage);
      }
      stopSorting();
    },
    [startSorting, stopSorting],
  );
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      setProductList((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update sortOrder based on new positions
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          sortOrder: index + 1,
        }));
        const entries = updatedItems.map<SortOrderUpdateEntry>(
          (e) => ({ categoryId: e._id, sortOrder: e.sortOrder }),
          [],
        );
        onSort(entries);
        return updatedItems;
      });
    },
    [onSort],
  );

  // Show empty state when no category is selected
  if (!selectedCategory) {
    return (
      <div className="flex h-full w-full flex-col">
        <div className="bg-pl-500 flex w-full items-center gap-4 p-4">
          <Breadcrumbs
            breadcrumbs={[{ label: "Menu Items", to: "" }]}
            className="!text-nl-50"
          />
        </div>
        <div className="flex h-full w-full items-center justify-center">
          <NoDataFound
            title="Select a Category"
            description="Choose a category from the left panel to view its products"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="bg-pl-500 flex w-full items-center gap-4 p-4">
        <Breadcrumbs breadcrumbs={breadcrumbs} className="!text-nl-50" />
        <Button
          startIcon={<Plus />}
          size="sm"
          onClick={handleAddItem}
          color="neutral"
          className="ml-auto"
        >
          Add Item
        </Button>
      </div>
      <div className="relative flex w-full flex-1 flex-col overflow-auto">
        {isSorting && (
          <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/40 backdrop-blur-[1.5px]">
            <Spinner size={40} />
          </div>
        )}
        {isFetching && (
          <div className="flex h-full w-full items-center justify-center">
            {" "}
            <Spinner />{" "}
          </div>
        )}
        {!isFetching && (
          <>
            {isError && (
              <div className="flex h-full w-full items-center justify-center">
                <NoDataFound
                  title="Error Fetching Items"
                  description={`Error message: ${errorMessage}`}
                  actions={
                    <Button
                      onClick={refetch}
                      startIcon={<RefreshCcw className="text-nl-50" />}
                    >
                      Refresh
                    </Button>
                  }
                />
              </div>
            )}
            {!isError && (
              <>
                {!productList?.length && (
                  <div className="flex h-full w-full items-center justify-center">
                    <NoDataFound
                      title="Items not found"
                      description={
                        "Lets start creating products and build menu."
                      }
                      actions={
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={refetch}
                            startIcon={<RefreshCcw className="text-pl-500" />}
                            variant="outline"
                          >
                            Refresh
                          </Button>
                          <Button
                            onClick={handleAddItem}
                            startIcon={<Plus className="text-nl-50" />}
                          >
                            Add Item
                          </Button>
                        </div>
                      }
                    />
                  </div>
                )}
                {Boolean(productList?.length) && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={productList?.map((item) => item._id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex flex-col">
                        {productList?.map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            refetch={refetch}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDragSection;
