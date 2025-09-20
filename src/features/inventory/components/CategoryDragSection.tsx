import { Button } from "@/components/base/Button";
import { toast } from "@/components/compound/Sonner";
import Spinner from "@/components/compound/spinner/Spinner";
import { useToggle } from "@/hooks/useToggle";
import { categoryApiService } from "@/infrastructure/CategoryApiService";
import type {
  CategoryResponse,
  SortOrderUpdateEntry,
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
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState, type FC } from "react";
import CategoryDialog from "../CategoryDialog";
import { useFetchAllCategoryList } from "../hooks";
import CategoryDragCard from "./CategoryDragCard";
import type { MenuParameters } from "./ProductDragSection";

type Props = {
  selectedParams: MenuParameters;
  onSelect: (params: MenuParameters) => void;
};

const CategoryDragSection: FC<Props> = (props) => {
  const { onSelect, selectedParams } = props;
  const { data, isFetching, refetch } = useFetchAllCategoryList();
  const [categoryList, setCategoryList] = useState<CategoryResponse[]>([]);

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
    if (data) {
      // Sort categories by sortOrder when data is fetched
      const sortedCategories = [...data].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );
      setCategoryList(sortedCategories);
    }
  }, [data]);

  const {
    isOpen: isSorting,
    open: startSorting,
    close: stopSorting,
  } = useToggle();
  const onSort = useCallback(
    async (entries: SortOrderUpdateEntry[]) => {
      startSorting();
      const { data, success, errorMessage } =
        await categoryApiService.sortBulk(entries);
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

  const { isOpen, open, close } = useToggle();

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {isOpen && <CategoryDialog isOpen onClose={close} onSave={refetch} />}
      <div className="bg-pl-500 border-nl-50 flex w-full items-center gap-4 border-r p-4">
        <p className="text-nl-50 flex-1">Categories ({categoryList.length})</p>
        <Button
          startIcon={<Plus />}
          size="sm"
          color="neutral"
          onClick={open}
          disabled={isFetching}
          isLoading={isFetching}
        >
          Add Category
        </Button>
      </div>

      <div className="border-nl-500 relative flex w-full flex-1 flex-col overflow-auto border-r">
        {isSorting && (
          <div className="absolute top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1.5px]">
            <Spinner size={40} />
          </div>
        )}
        {isFetching && (
          <div className="flex items-center justify-center p-8">
            <Spinner />
          </div>
        )}

        {!isFetching && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categoryList.map((item) => item._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col">
                {categoryList.map((category) => (
                  <CategoryDragCard
                    key={category._id}
                    category={category}
                    selectedParams={selectedParams}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default CategoryDragSection;
