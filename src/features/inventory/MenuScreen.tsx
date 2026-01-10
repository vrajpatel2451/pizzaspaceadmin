import { Button } from "@/components/base/Button";
import Chip from "@/components/base/Chip";
import { Input } from "@/components/base/Input";
import { routeConstants } from "@/routes/routeConstants";
import { Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryDragSection from "./components/CategoryDragSection";
import ProductDragSection, {
  type MenuParameters,
} from "./components/ProductDragSection";
import { useFetchAllCategoryList, useMenuUrlParams } from "./hooks";

const MenuScreen = () => {
  const [selectedParameters, setSelectedParameters] =
    useState<MenuParameters>(null);

  const { data: categoryList, isFetching, refetch } = useFetchAllCategoryList();
  const {
    categoryIdFromUrl,
    subCategoryIdFromUrl,
    updateUrlParams,
    clearUrlParams,
  } = useMenuUrlParams();

  // Track if we've already restored from URL to avoid loops
  const [hasRestoredFromUrl, setHasRestoredFromUrl] = useState(false);

  // Restore selection from URL when categories load
  useEffect(() => {
    if (!categoryList?.length || !categoryIdFromUrl || hasRestoredFromUrl)
      return;

    const category = categoryList.find((c) => c._id === categoryIdFromUrl);
    if (category) {
      // Set category immediately, subcategory will be restored by CategoryDragCard
      setSelectedParameters({ selectedCategory: category });
      setHasRestoredFromUrl(true);
    } else {
      // Invalid categoryId in URL, clear it
      clearUrlParams();
    }
  }, [categoryList, categoryIdFromUrl, hasRestoredFromUrl, clearUrlParams]);

  // Wrapper to sync selection to URL
  const handleSelectParameters = useCallback(
    (params: MenuParameters) => {
      setSelectedParameters(params);
      if (params) {
        updateUrlParams(
          params.selectedCategory._id,
          params.selectedSubCategory?._id,
        );
      } else {
        clearUrlParams();
      }
    },
    [updateUrlParams, clearUrlParams],
  );

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden bg-slate-50 p-6">
      <div className="flex shrink-0 justify-end">
        <Link to={routeConstants.addons}>
          <Button
            variant="outline"
            color="neutral"
            startIcon={<Plus size={16} />}
          >
            Add-ons
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search products..."
              fullWidth
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip label="All (50)" />
            <Chip label="Out Of Stock (30)" />
            <Chip label="With Variants (20)" />
            <Chip label="With Addons (10)" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex min-h-0 flex-1 gap-4">
        {/* Categories Sidebar */}
        <div className="flex w-[30%] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          <CategoryDragSection
            selectedParams={selectedParameters}
            onSelect={handleSelectParameters}
            categoryList={categoryList || []}
            isFetching={isFetching}
            refetch={refetch}
            pendingSubCategoryId={subCategoryIdFromUrl}
          />
        </div>

        {/* Products Grid */}
        <div className="flex w-[70%] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          <ProductDragSection selectedParameters={selectedParameters} />
        </div>
      </div>
    </div>
  );
};

export default MenuScreen;
