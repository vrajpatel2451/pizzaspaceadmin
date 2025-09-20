import { IconButton } from "@/components/base/IconButton";
import type { SubCategoryResponse } from "@/types/category.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ellipsis, GripHorizontal } from "lucide-react";
import { useCallback, type FC } from "react";

type Props = {
  subCategory: SubCategoryResponse;
  selectedCategory: SubCategoryResponse;
  onSelect: (selectedSubCategory: SubCategoryResponse) => void;
};

const SubCategoryDragCard: FC<Props> = (props) => {
  const { subCategory, selectedCategory, onSelect } = props;
  const { _id } = subCategory;
  const { _id: selectedId } = selectedCategory || {};

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subCategory._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const onClick = useCallback(() => {
    onSelect(subCategory);
  }, [onSelect, subCategory]);

  const isSelected = _id === selectedId;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex w-full cursor-pointer items-center gap-4 ${isSelected ? "bg-pl-50/40" : "bg-white"} ${isSelected ? "hover:bg-pl-50" : "hover:bg-nl-50/50"} p-3 pl-8 transition-colors`}
      onClick={onClick}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab rounded p-1 transition-colors hover:bg-gray-100 active:cursor-grabbing"
      >
        <GripHorizontal
          className={`h-4 w-4 ${isSelected ? "text-pl-500" : "text-black"}`}
        />
      </div>
      <p
        className={`flex-1 overflow-hidden text-sm font-medium overflow-ellipsis whitespace-nowrap ${isSelected ? "text-pl-500" : "text-black"}`}
      >
        {subCategory.name}
      </p>
      <span
        className={`min-w-fit text-xs ${isSelected ? "text-pl-500" : "text-black"}`}
      >
        #{subCategory.sortOrder}
      </span>
      <IconButton icon={Ellipsis} size="sm" />
    </div>
  );
};

export default SubCategoryDragCard;
