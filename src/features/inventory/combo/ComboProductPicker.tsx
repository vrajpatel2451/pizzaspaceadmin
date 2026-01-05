import {
  useState,
  useMemo,
  useEffect,
  useRef,
  type FC,
  useCallback,
} from "react";
import Sheet from "@/components/compound/Sheet";
import { Input } from "@/components/base/Input";
import { Button } from "@/components/base/Button";
import { Select, type SelectOption } from "@/components/base/Select";
import ImageComponent from "@/components/compound/ImageComponent";
import Spinner from "@/components/compound/spinner/Spinner";
import useDebounce from "@/hooks/useDebounce";
import { useFetchComboProducts } from "../hooks/useFetchComboProducts";
import { useFetchCategoryList } from "../hooks";
import { Search, Check, X } from "lucide-react";
import type {
  ComboGroupProductFormData,
  ComboProductSearchItem,
  ComboProductSearchParams,
} from "@/types/product.types";
import type { CategoryQueryParams } from "@/types/category.types";
import { cn } from "@/utils/helpers";
import Pagination from "@/components/compound/Pagination";

interface ComboProductPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (products: ComboGroupProductFormData[]) => void;
  existingProducts: ComboGroupProductFormData[];
}

const ComboProductPicker: FC<ComboProductPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  existingProducts,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<
    Map<string, ComboGroupProductFormData>
  >(new Map());

  // Track if we've initialized for this open session
  const hasInitializedRef = useRef(false);
  const prevIsOpenRef = useRef(false);

  const debouncedSearch = useDebounce(searchValue, 400);

  // Get existing product IDs
  const existingProductIds = useMemo(
    () => existingProducts.map((p) => p.productId),
    [existingProducts],
  );

  // Category fetch - only fetch once
  const categoryQuery = useMemo<CategoryQueryParams>(
    () => ({ limit: 50, page: 1 }),
    [],
  );
  const { data: categoryMetaData, isFetching: isCategoriesFetching } =
    useFetchCategoryList(categoryQuery);
  const { data: categories = [] } = categoryMetaData || {};

  const categoryOptions = useMemo<SelectOption[]>(
    () => [
      { value: "", label: "All Categories" },
      ...categories.map((c) => ({ value: c._id, label: c.name })),
    ],
    [categories],
  );

  // API call for selected products - only when sheet opens with existing products
  const selectedProductsParams =
    useMemo<ComboProductSearchParams | null>(() => {
      if (
        !isOpen ||
        existingProductIds.length === 0 ||
        hasInitializedRef.current
      ) {
        return null;
      }
      return {
        productIds: existingProductIds,
        all: true,
      };
    }, [isOpen, existingProductIds]);

  const { data: selectedProductsResponse, isFetching: isSelectedFetching } =
    useFetchComboProducts(
      selectedProductsParams || { limit: 0 },
      selectedProductsParams === null,
    );
  const selectedProductsData = selectedProductsResponse?.data;

  // API call for search results
  const searchParams = useMemo<ComboProductSearchParams>(
    () => ({
      limit: 30,
      page,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(categoryId && { categoryId }),
    }),
    [debouncedSearch, categoryId, page],
  );

  const { data: searchResponse, isFetching: isSearchFetching } =
    useFetchComboProducts(searchParams, !isOpen);
  const searchResults = searchResponse?.data;

  // Handle sheet open/close - single effect
  useEffect(() => {
    // Sheet just opened
    if (isOpen && !prevIsOpenRef.current) {
      hasInitializedRef.current = false;
      setSearchValue("");
      setCategoryId("");
      setPage(1);

      // If no existing products, initialize empty map immediately
      if (existingProductIds.length === 0) {
        setSelectedProducts(new Map());
        hasInitializedRef.current = true;
      }
    }

    prevIsOpenRef.current = isOpen;
  }, [isOpen, existingProductIds.length]);

  // Initialize selected products from API response - only once
  useEffect(() => {
    if (
      isOpen &&
      !hasInitializedRef.current &&
      existingProductIds.length > 0 &&
      selectedProductsData &&
      selectedProductsData.length > 0
    ) {
      const initialMap = new Map<string, ComboGroupProductFormData>();

      selectedProductsData.forEach((product) => {
        const existingProduct = existingProducts.find(
          (p) => p.productId === product._id,
        );

        const defaultVariant = existingProduct?.defaultVariantId
          ? product.primaryVariants?.find(
              (v) => v._id === existingProduct.defaultVariantId,
            )
          : product.primaryVariants?.[0];

        initialMap.set(product._id, {
          productId: product._id,
          productName: product.name,
          productPhoto: product.photoList?.[0],
          category: product.category,
          availableVariants: product.primaryVariants?.map((v) => ({
            _id: v._id,
            label: v.label,
          })),
          defaultVariantId:
            existingProduct?.defaultVariantId || defaultVariant?._id,
          defaultVariantLabel:
            existingProduct?.defaultVariantLabel || defaultVariant?.label,
          _id: existingProduct?._id,
        });
      });

      setSelectedProducts(initialMap);
      hasInitializedRef.current = true;
    }
  }, [
    isOpen,
    existingProductIds.length,
    selectedProductsData,
    existingProducts,
  ]);

  // Filter out selected products from search results
  const availableProducts = useMemo(() => {
    if (!searchResults) return [];
    return searchResults.filter((p) => !selectedProducts.has(p._id));
  }, [searchResults, selectedProducts]);

  // Handlers
  const handleToggleProduct = useCallback((product: ComboProductSearchItem) => {
    setSelectedProducts((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(product._id)) {
        newMap.delete(product._id);
      } else {
        const defaultVariant = product.primaryVariants?.[0];
        newMap.set(product._id, {
          productId: product._id,
          productName: product.name,
          productPhoto: product.photoList?.[0],
          category: product.category,
          availableVariants: product.primaryVariants?.map((v) => ({
            _id: v._id,
            label: v.label,
          })),
          defaultVariantId: defaultVariant?._id,
          defaultVariantLabel: defaultVariant?.label,
        });
      }
      return newMap;
    });
  }, []);

  const handleVariantChange = useCallback(
    (productId: string, variantId: string, variantLabel: string) => {
      setSelectedProducts((prev) => {
        const newMap = new Map(prev);
        const product = newMap.get(productId);
        if (product) {
          newMap.set(productId, {
            ...product,
            defaultVariantId: variantId,
            defaultVariantLabel: variantLabel,
          });
        }
        return newMap;
      });
    },
    [],
  );

  const handleRemoveSelected = useCallback((productId: string) => {
    setSelectedProducts((prev) => {
      const newMap = new Map(prev);
      newMap.delete(productId);
      return newMap;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedProducts((prev) => {
      const newMap = new Map(prev);
      availableProducts.forEach((product) => {
        if (!newMap.has(product._id)) {
          const defaultVariant = product.primaryVariants?.[0];
          newMap.set(product._id, {
            productId: product._id,
            productName: product.name,
            productPhoto: product.photoList?.[0],
            category: product.category,
            availableVariants: product.primaryVariants?.map((v) => ({
              _id: v._id,
              label: v.label,
            })),
            defaultVariantId: defaultVariant?._id,
            defaultVariantLabel: defaultVariant?.label,
          });
        }
      });
      return newMap;
    });
  }, [availableProducts]);

  const handleDeselectAll = useCallback(() => {
    setSelectedProducts(new Map());
  }, []);

  const handleConfirm = useCallback(() => {
    onSelect(Array.from(selectedProducts.values()));
    onClose();
  }, [onSelect, onClose, selectedProducts]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    setPage(1); // Reset page when search changes
  }, []);

  const handleCategoryChange = useCallback((option: SelectOption | null) => {
    setCategoryId(option?.value || "");
    setPage(1); // Reset page when category changes
  }, []);

  const isLoading =
    isSelectedFetching &&
    existingProductIds.length > 0 &&
    !hasInitializedRef.current;

  return (
    <Sheet
      isOpen={isOpen}
      close={onClose}
      title="Add Products to Group"
      subTitle="Search and select products to include in this combo group"
      size="wide"
      actions={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "outline",
          color: "neutral",
        },
        {
          label: `Save Selection (${selectedProducts.size})`,
          onClick: handleConfirm,
          disabled: selectedProducts.size === 0,
        },
      ]}
    >
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex h-full flex-col gap-4">
          {/* Filters Row */}
          <div className="flex shrink-0 gap-3">
            <div className="flex-1">
              <Input
                leftElement={<Search size={18} strokeWidth={1} />}
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Select
                options={categoryOptions}
                value={
                  categoryOptions.find((o) => o.value === categoryId) ||
                  categoryOptions[0]
                }
                onChange={(val) =>
                  handleCategoryChange(val as SelectOption | null)
                }
                placeholder="All Categories"
                isLoading={isCategoriesFetching}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                disabled={availableProducts.length === 0}
              >
                Select All
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDeselectAll}
                disabled={selectedProducts.size === 0}
              >
                Deselect All
              </Button>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedProducts.size} selected
            </span>
          </div>

          {/* Selected Products Section - Compact Chips */}
          {selectedProducts.size > 0 && (
            <div className="bg-pl-50 dark:bg-pd-900/20 shrink-0 rounded-lg p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-pl-700 dark:text-pl-300 text-sm font-medium">
                  Selected ({selectedProducts.size})
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  color="danger"
                  onClick={handleDeselectAll}
                  startIcon={<X size={14} />}
                >
                  Clear All
                </Button>
              </div>
              <div className="grid auto-cols-max grid-flow-col grid-rows-3 gap-1.5 overflow-x-auto pb-1">
                {Array.from(selectedProducts.values()).map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800"
                  >
                    <span className="max-w-24 truncate font-medium text-gray-700 dark:text-gray-200">
                      {product.productName}
                    </span>
                    {product.availableVariants &&
                      product.availableVariants.length > 0 && (
                        <Select
                          options={product.availableVariants.map((v) => ({
                            value: v._id,
                            label: v.label,
                          }))}
                          value={
                            product.defaultVariantId
                              ? {
                                  value: product.defaultVariantId,
                                  label: product.defaultVariantLabel || "",
                                }
                              : null
                          }
                          onChange={(opt) => {
                            const option = opt as SelectOption;
                            if (option) {
                              handleVariantChange(
                                product.productId,
                                option.value,
                                option.label,
                              );
                            }
                          }}
                          width={80}
                          isSearchable={false}
                          placeholder="Variant"
                          variant="minimal"
                        />
                      )}
                    <button
                      type="button"
                      onClick={() => handleRemoveSelected(product.productId)}
                      className="flex size-4 items-center justify-center rounded text-gray-400 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product List */}
          <div className="flex min-h-0 flex-1 flex-col">
            <p className="mb-2 shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">
              Available Products ({availableProducts.length})
            </p>
            {isSearchFetching ? (
              <div className="flex flex-1 items-center justify-center py-8">
                <Spinner />
              </div>
            ) : availableProducts.length > 0 ? (
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {availableProducts.map((product) => {
                    const isSelected = selectedProducts.has(product._id);
                    return (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() => handleToggleProduct(product)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                          isSelected
                            ? "border-pl-500 bg-pl-50 dark:border-pl-400 dark:bg-pd-900/20"
                            : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600",
                        )}
                      >
                        {product.photoList?.[0] ? (
                          <ImageComponent
                            src={product.photoList[0]}
                            alt={product.name}
                            wrapperClassName="size-12"
                            className="size-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex size-12 items-center justify-center rounded-md bg-gray-100 text-gray-400 dark:bg-gray-700">
                            <Search size={18} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                            {product.name}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {product.category}
                            {product.subCategory && ` / ${product.subCategory}`}
                          </p>
                          {product.primaryVariants &&
                            product.primaryVariants.length > 0 && (
                              <p className="mt-0.5 truncate text-xs text-gray-400">
                                {product.primaryVariants
                                  .map((v) => v.label)
                                  .join(", ")}
                              </p>
                            )}
                        </div>
                        <div
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                            isSelected
                              ? "border-pl-500 bg-pl-500 text-white"
                              : "border-gray-300 dark:border-gray-600",
                          )}
                        >
                          {isSelected && <Check size={12} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                {debouncedSearch || categoryId
                  ? "No products found"
                  : "Start typing to search products or select a category"}
              </div>
            )}
          </div>

          {/* Pagination */}
          {searchResponse?.meta && (
            <Pagination
              {...searchResponse.meta}
              onPageChange={setPage}
              className="shrink-0 border-t border-gray-200 pt-3 dark:border-gray-700"
            />
          )}
        </div>
      )}
    </Sheet>
  );
};

export default ComboProductPicker;
