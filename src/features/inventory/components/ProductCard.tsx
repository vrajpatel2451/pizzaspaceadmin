import { IconButton } from "@/components/base/IconButton";
import DeleteDialog from "@/components/compound/DeleteDialog";
import ImageComponent from "@/components/compound/ImageComponent";
import MenuItem from "@/components/compound/MenuItem";
import { Popover } from "@/components/compound/Popover";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { productApiService } from "@/infrastructure/ProductApiService";
import { routeConstants } from "@/routes/routeConstants";
import type { ProductResponse } from "@/types/product.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EllipsisVertical, GripHorizontal, Star, Users } from "lucide-react";
import { useCallback, type FC } from "react";
import { useNavigate } from "react-router-dom";
import AssignStoreToProductDialog from "./AssignStoreToProductDialog";

type Props = {
  product: ProductResponse;
  refetch: () => void;
};

const ProductCard: FC<Props> = (props) => {
  const { product, refetch } = props;
  const navigate = useNavigate();

  const {
    isOpen: isDeleteOpen,
    open: openDelete,
    close: closeDelete,
  } = useToggle();

  const handleEdit = useCallback(() => {
    navigate(
      routeConstants.productDetails
        .replace(":action", "edit")
        .replace(":productId", product._id),
    );
  }, [navigate, product._id]);

  const handleClone = useCallback(() => {
    navigate(
      routeConstants.productDetails
        .replace(":action", "clone")
        .replace(":productId", product._id),
    );
  }, [navigate, product._id]);

  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();
  const {
    isOpen: isAssignStoreOpen,
    open: openAssignStore,
    close: closeAssignStore,
  } = useToggle();
  const onDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await productApiService.deleteProduct(product._id);
    if (success) {
      closeDelete();
      refetch();
      toast.success("Item deleted successfully");
    } else {
      toast.error("Error deleting Item");
    }
    stopDeleteProgress();
  }, [
    product._id,
    closeDelete,
    refetch,
    startDeleteProgress,
    stopDeleteProgress,
  ]);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-nl-100 flex w-full items-center gap-4 border-b bg-white p-4"
    >
      {isDeleteOpen && (
        <DeleteDialog
          close={closeDelete}
          isOpen
          onDelete={onDelete}
          isDeleting={isDeleteInProgress}
          title="Delete Item?"
          name={product.name}
        />
      )}
      {isAssignStoreOpen && (
        <AssignStoreToProductDialog
          product={product}
          isOpen
          onClose={closeAssignStore}
          onSave={refetch}
        />
      )}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab rounded p-1 transition-colors hover:bg-gray-100 active:cursor-grabbing"
      >
        <GripHorizontal
        //   className={`${isSelected ? "text-pl-500" : "text-black"}`}
        />
      </div>
      <ImageComponent
        src={product.photoList[0] || ""}
        alt={product.name}
        className="h-12 w-12"
      />
      <div className="flex flex-col gap-2">
        <div className="text-lg font-medium">{product.name}</div>
        <div className="flex items-center gap-4">
          <div className="text-pl-500 text-lg">${product.basePrice}</div>
          <div className="text-sm">
            ${product.packagingCharges} packing charges
          </div>
        </div>
      </div>
      <div className="flex-1" />
      <div className="bg-pl-50 border-pl-500 flex items-center gap-4 rounded-lg border px-4 py-2">
        <Users className="text-pl-500 size-4" />
        <div className="text-pl-500 text-sm">{product.noOfPeople}</div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="text-sm">{product.addons.length} Addons</div>
        <div className="flex items-center gap-1">
          <Star className="text-amber-300" />
          <div>4.5</div>
        </div>
      </div>
      <Popover trigger={<IconButton icon={EllipsisVertical} />}>
        <div className="min-w-48">
          <div className="menu-items">
            <MenuItem startIcon="Pen" onClick={handleEdit}>
              Edit
            </MenuItem>
            <MenuItem startIcon="Copy" onClick={handleClone}>
              Clone
            </MenuItem>
            <MenuItem startIcon="Store" onClick={openAssignStore}>
              Assign Stores
            </MenuItem>
            <MenuItem startIcon="SquareX">Mark as Out Of Stock</MenuItem>
            <MenuItem onClick={openDelete} startIcon="Delete">
              Delete
            </MenuItem>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default ProductCard;
