import { Button } from "@/components/base/Button";
import Chip from "@/components/base/Chip";
import { Input } from "@/components/base/Input";
import { routeConstants } from "@/routes/routeConstants";
import { Search } from "lucide-react";
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
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden pt-4">
      <div className="flex w-full items-center gap-4 px-4">
        <Input
          className="flex-1"
          placeholder="Search"
          leftElement={<Search />}
          fullWidth
        />
        <Link to={routeConstants.addons}>
          <Button>Add-ons</Button>
        </Link>
      </div>
      <div className="flex w-full items-center gap-4 px-4">
        <Chip label="All (50)" />
        <Chip label="Out Of Stock (30)" />
        <Chip label="With Variants (20)" />
        <Chip label="With Addons (10)" />
      </div>
      <div className="flex w-full flex-1 items-start overflow-hidden">
        <div className="h-full w-[30%]">
          <CategoryDragSection
            selectedParams={selectedParameters}
            onSelect={handleSelectParameters}
            categoryList={categoryList || []}
            isFetching={isFetching}
            refetch={refetch}
            pendingSubCategoryId={subCategoryIdFromUrl}
          />
        </div>
        <div className="h-full w-[70%]">
          <ProductDragSection selectedParameters={selectedParameters} />
        </div>
      </div>
    </div>
  );
};

export default MenuScreen;
