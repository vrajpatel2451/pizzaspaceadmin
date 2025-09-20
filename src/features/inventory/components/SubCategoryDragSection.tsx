import { toast } from "@/components/compound/Sonner";
import Spinner from "@/components/compound/spinner/Spinner";
import { useToggle } from "@/hooks/useToggle";
import { subCategoryApiService } from "@/infrastructure/SubCategoryApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  SortOrderUpdateEntry,
  SubCategoryResponse,
} from "@/types/category.types";
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
import { useCallback, useEffect, useState } from "react";
import SubCategoryDragCard from "./SubCategoryDragCard";

type Props = {
  categoryId: string;
  isExpanded: boolean;
  onHeightChange?: (categoryId: string, height: number) => void;
  selectedCategory: SubCategoryResponse;
  onSelect: (selectedSubCategory: SubCategoryResponse) => void;
  data: PaginatedResponse<SubCategoryResponse>;
  isFetching: boolean;
};

const SubCategoryDragSection: React.FC<Props> = (props) => {
  const {
    categoryId,
    isExpanded,
    onHeightChange,
    onSelect,
    selectedCategory,
    data,
    isFetching,
  } = props;

  const { data: catData } = data || {};
  const [categoryList, setCategoryList] = useState<SubCategoryResponse[]>([]);

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

  useEffect(() => {
    if (catData) {
      // Sort categories by sortOrder when data is fetched
      const sortedCategories = [...catData].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );
      setCategoryList(sortedCategories);
    }
  }, [catData]);

  // Calculate and report height changes when list or expansion state changes
  useEffect(() => {
    if (onHeightChange && isExpanded) {
      const baseHeight = 48; // Height of each subcategory card
      const calculatedHeight = categoryList.length * baseHeight;
      onHeightChange(categoryId, calculatedHeight);
    } else if (onHeightChange && !isExpanded) {
      onHeightChange(categoryId, 0);
    }
  }, [categoryList.length, isExpanded, categoryId, onHeightChange]);

  const {
    isOpen: isSorting,
    open: startSorting,
    close: stopSorting,
  } = useToggle();
  const onSort = useCallback(
    async (entries: SortOrderUpdateEntry[]) => {
      startSorting();
      const { data, success, errorMessage } =
        await subCategoryApiService.sortBulk(entries);
      if (success) {
        setCategoryList(data);
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

      setCategoryList((items) => {
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

  if (!isExpanded) {
    return null;
  }

  return (
    <div
      className="relative w-full overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        maxHeight: isExpanded ? `${categoryList.length * 48}px` : "0px",
      }}
    >
      {isSorting && (
        <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/40 backdrop-blur-[1.5px]">
          <Spinner size={40} />
        </div>
      )}
      {!isFetching && categoryList.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categoryList.map((item) => item._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="border-l-2 border-gray-200 bg-gray-50">
              {categoryList.map((subCategory) => (
                <SubCategoryDragCard
                  selectedCategory={selectedCategory}
                  onSelect={onSelect}
                  key={subCategory._id}
                  subCategory={subCategory}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      {!isFetching && categoryList.length === 0 && (
        <div className="border-l-2 border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
          No subcategories found
        </div>
      )}
    </div>
  );
};

export default SubCategoryDragSection;
