import { Input } from "@/components/base/Input";
import type { PaginationProps } from "@/components/compound/Pagination";
import Pagination from "@/components/compound/Pagination";
import Spinner from "@/components/compound/spinner/Spinner";
import { useFetchAllCategoryList } from "@/features/inventory/hooks/useFetchAllCategoryList";
import { useFetchAllProductList } from "@/features/inventory/hooks";
import { useInputState } from "@/hooks/useInputState";
import type { ProductQueryParams } from "@/types/product.types";
import { Search } from "lucide-react";
import { useMemo, useState, type FC } from "react";
import CartProductView from "./CartProductView";
import type { OnAddToCart } from "../types/cart.types";
import { Button } from "@/components/base/Button";

type Props = {
  selectedStoreId: string;
  onAddToCart: OnAddToCart;
};

const ItemListGridView: FC<Props> = (props) => {
  const { selectedStoreId, onAddToCart } = props;
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // Fetch categories for the selected store
  const { data: categories = [], isFetching: isCategoriesFetching } =
    useFetchAllCategoryList();

  // Filter categories by store
  const storeCategories = useMemo(() => {
    if (!selectedStoreId) return [];
    return categories.filter((cat) => cat.storeIds.includes(selectedStoreId));
  }, [categories, selectedStoreId]);

  const params = useMemo<ProductQueryParams>(
    () => ({
      page: currentPage,
      limit: 12,
      search: debounceVal,
      storeId: selectedStoreId,
      categoryId: selectedCategoryId || undefined,
    }),
    [currentPage, debounceVal, selectedStoreId, selectedCategoryId],
  );

  const { data, isFetching, isError, errorMessage } =
    useFetchAllProductList(params);
  const { data: productList, meta } = data || {};
  const paginatedParams = useMemo<PaginationProps>(
    () => ({
      ...meta,
      onPageChange: setCurrentPage,
    }),
    [meta],
  );

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      {/* Category Tabs */}
      {!isCategoriesFetching && storeCategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            type="button"
            onClick={() => handleCategoryChange("")}
            variant={!selectedCategoryId ? "filled" : "outline"}
            size="lg"
          >
            All
          </Button>
          {storeCategories.map((category) => (
            <Button
              size="lg"
              key={category._id}
              type="button"
              onClick={() => handleCategoryChange(category._id)}
              variant={
                selectedCategoryId === category._id ? "filled" : "outline"
              }
              className="capitalize"
            >
              {category.name.toLowerCase()}
            </Button>
          ))}
        </div>
      )}

      {/* Search Input */}
      <Input
        placeholder="Quick search products..."
        leftElement={<Search />}
        value={inputValue}
        onChange={onInputChange}
        fullWidth
      />
      <div className="w-full flex-1">
        {isFetching && <Spinner />}
        {!isFetching && (
          <>
            {isError && <div>Error: {errorMessage}</div>}
            {!isError && (
              <>
                {!productList?.length && <div>Items not found</div>}
                {Boolean(productList?.length) && (
                  <div className="grid grid-cols-2 gap-4">
                    {productList.map((product) => (
                      <CartProductView
                        item={product}
                        key={product._id}
                        onAddToCart={onAddToCart}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <Pagination {...paginatedParams} />
    </div>
  );
};

export default ItemListGridView;
