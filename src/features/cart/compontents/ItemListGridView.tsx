import { Input } from "@/components/base/Input";
import type { PaginationProps } from "@/components/compound/Pagination";
import Pagination from "@/components/compound/Pagination";
import Spinner from "@/components/compound/spinner/Spinner";
import { useFetchAllProductList } from "@/features/inventory/hooks";
import { useInputState } from "@/hooks/useInputState";
import type { ProductQueryParams } from "@/types/product.types";
import { Search } from "lucide-react";
import { useMemo, useState, type FC } from "react";
import CartProductView from "./CartProductView";
import type { OnAddToCart } from "../types/cart.types";

type Props = {
  selectedStoreId: string;
  onAddToCart: OnAddToCart;
};

const ItemListGridView: FC<Props> = (props) => {
  const { selectedStoreId, onAddToCart } = props;
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);
  const [currentPage, setCurrentPage] = useState(1);
  const params = useMemo<ProductQueryParams>(
    () => ({
      page: currentPage,
      limit: 12,
      search: debounceVal,
      storeId: selectedStoreId,
    }),
    [currentPage, debounceVal, selectedStoreId],
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
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <Input
        placeholder="Search here"
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
