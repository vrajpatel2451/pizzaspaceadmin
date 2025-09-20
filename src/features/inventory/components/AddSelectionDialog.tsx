import Dialog from "@/components/compound/Dialog";
import type {
  CategoryResponse,
  SubCategoryResponse,
} from "@/types/category.types";
import { Blocks, Cookie } from "lucide-react";
import { useCallback, useMemo, useState, type FC } from "react";
import SubCategoryDialog from "../SubCategoryDialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryResponse;
  onSave: (subCategory?: SubCategoryResponse, productResponse?: any) => void;
  disableProd: boolean;
  disabledSubCat: boolean;
};

const AddSelectionDialog: FC<Props> = (props) => {
  const { disabledSubCat, disableProd, category, isOpen, onClose, onSave } =
    props;
  const { _id, name } = category;
  const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);
  const [isProdDialogOpen, setIsProdDialogOpen] = useState(false);

  const showSubDialog = disabledSubCat
    ? false
    : disableProd
      ? isOpen
      : isSubDialogOpen;
  const showProdDialog = disableProd
    ? false
    : disabledSubCat
      ? isOpen
      : isProdDialogOpen;

  const onCloseSub = useCallback(() => {
    onClose();
    setIsSubDialogOpen(false);
  }, [onClose]);
  const onCloseProd = useCallback(() => {
    onClose();
    setIsProdDialogOpen(false);
  }, [onClose]);

  const onSaveSub = useCallback(
    (category: SubCategoryResponse) => {
      onSave(category);
    },
    [onSave],
  );

  const subCat = useMemo<SubCategoryResponse>(
    () => ({
      _id: "",
      categoryId: _id,
      createdAt: "",
      imageUrl: "",
      name: "",
      sortOrder: 0,
      storeIds: [],
      updatedAt: "",
    }),
    [_id],
  );

  const onSelectSub = useCallback(() => {
    onClose();
    setIsSubDialogOpen(true);
  }, [onClose]);
  const onSelectProd = useCallback(() => {
    onClose();
    setIsProdDialogOpen(true);
  }, [onClose]);

  return (
    <>
      {!disableProd && !disabledSubCat && (
        <Dialog
          isOpen={isOpen}
          close={onClose}
          title="What To Add?"
          subTitle={`Add Items to ${name}`}
        >
          <div className="flex flex-col gap-3 p-2">
            {/* Sub Category Option */}
            <div
              className="group border-nl-200 hover:border-pl-300 hover:bg-pl-50 dark:border-nd-500 dark:bg-nd-700 dark:hover:border-pd-400 dark:hover:bg-pd-900/20 flex cursor-pointer items-start gap-4 rounded-xl border bg-white p-4 transition-all duration-200 hover:shadow-sm"
              onClick={onSelectSub}
            >
              <div className="bg-pl-100 text-pl-600 group-hover:bg-pl-200 group-hover:text-pl-700 dark:bg-pd-800 dark:text-pd-300 dark:group-hover:bg-pd-700 dark:group-hover:text-pd-200 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors">
                <Blocks className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1 cursor-pointer">
                <h4 className="text-nl-800 group-hover:text-pl-700 dark:text-nd-100 dark:group-hover:text-pd-300 cursor-pointer font-semibold">
                  Sub Category
                </h4>
                <p className="text-nl-600 dark:text-nd-300 mt-1 cursor-pointer text-sm">
                  Create a new subcategory to organize your items better.
                  Subcategories help group related products within a main
                  category.
                </p>
              </div>
            </div>

            {/* Item Option */}
            <div
              className="group border-nl-200 hover:border-pl-300 hover:bg-pl-50 dark:border-nd-500 dark:bg-nd-700 dark:hover:border-pd-400 dark:hover:bg-pd-900/20 flex cursor-pointer items-start gap-4 rounded-xl border bg-white p-4 transition-all duration-200 hover:shadow-sm"
              onClick={onSelectProd}
            >
              <div className="bg-t-amber/20 text-t-amber group-hover:bg-t-amber/30 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors">
                <Cookie className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1 cursor-pointer">
                <h4 className="text-nl-800 group-hover:text-pl-700 dark:text-nd-100 cursor-pointer font-semibold">
                  Menu Item
                </h4>
                <p className="text-nl-600 dark:text-nd-300 mt-1 cursor-pointer text-sm">
                  Add a new product or menu item to your catalog. Include
                  details like price, description, and images to showcase your
                  offerings.
                </p>
              </div>
            </div>
          </div>
        </Dialog>
      )}
      {showSubDialog && (
        <SubCategoryDialog
          isOpen
          onClose={onCloseSub}
          onSave={onSaveSub}
          subCategory={subCat}
        />
      )}
      {showProdDialog && (
        <Dialog isOpen close={onCloseProd} title="Item Dialog">
          <div className="flex flex-col items-center">Item Temp</div>
        </Dialog>
      )}
    </>
  );
};

export default AddSelectionDialog;
