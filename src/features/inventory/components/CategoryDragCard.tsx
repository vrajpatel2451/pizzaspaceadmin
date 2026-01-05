import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import { useToggle } from "@/hooks/useToggle";
import type {
  CategoryQueryParams,
  CategoryResponse,
  SubCategoryResponse,
} from "@/types/category.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  Ellipsis,
  GripHorizontal,
  Plus,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useFetchSubCategoryList } from "../hooks";
import AddSelectionDialog from "./AddSelectionDialog";
import type { MenuParameters } from "./ProductDragSection";
import SubCategoryDragSection from "./SubCategoryDragSection";

type Props = {
  category: CategoryResponse;
  selectedParams: MenuParameters;
  onSelect: (params: MenuParameters) => void;
  pendingSubCategoryId?: string | null;
};

const CategoryDragCard: FC<Props> = (props) => {
  const { category, onSelect, selectedParams, pendingSubCategoryId } = props;
  const { selectedCategory, selectedSubCategory } = selectedParams || {};

  const { _id } = category;
  const { _id: selectedId } = selectedCategory || {};

  const query = useMemo<CategoryQueryParams>(
    () => ({
      all: true,
      categoryId: _id,
    }),
    [_id],
  );

  const { data, isFetching, refetch } = useFetchSubCategoryList(query);
  const allowDirectProducts = Boolean(!data?.data?.length);
  const isSelected = _id === selectedId;
  const onCategoryClick = useCallback(() => {
    if (allowDirectProducts) {
      onSelect({ selectedCategory: category });
    }
  }, [category, onSelect, allowDirectProducts]);
  const onSelectSubCategory = useCallback(
    (subCategory: SubCategoryResponse) => {
      onSelect({
        selectedCategory: category,
        selectedSubCategory: subCategory,
      });
    },
    [category, onSelect],
  );

  const [isExpanded, setIsExpanded] = useState(false);

  // Restore subcategory from URL when this is the selected category and subcategories have loaded
  const [hasRestoredSubCategory, setHasRestoredSubCategory] = useState(false);
  useEffect(() => {
    if (
      isSelected &&
      pendingSubCategoryId &&
      data?.data?.length &&
      !selectedSubCategory &&
      !hasRestoredSubCategory
    ) {
      const subCat = data.data.find((s) => s._id === pendingSubCategoryId);
      if (subCat) {
        onSelect({ selectedCategory: category, selectedSubCategory: subCat });
        setHasRestoredSubCategory(true);
        setIsExpanded(true);
      }
    }
  }, [
    isSelected,
    pendingSubCategoryId,
    data?.data,
    selectedSubCategory,
    hasRestoredSubCategory,
    category,
    onSelect,
  ]);
  const [, setSubCategoryHeight] = useState(0);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggleExpanded = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSubCategoryHeightChange = (_: any, height: number) => {
    setSubCategoryHeight(height);
  };

  const { isOpen, close, open } = useToggle();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-nl-100 w-full border-b`}
    >
      <AddSelectionDialog
        category={category}
        disableProd={!allowDirectProducts}
        disabledSubCat={false}
        isOpen={isOpen}
        onClose={close}
        onSave={refetch}
      />
      {/* Main Category Card */}
      <div
        className={`border-nl-200 flex w-full items-center gap-4 ${isSelected ? "bg-pl-50" : "bg-white"} cursor-pointer p-4 transition-colors ${isSelected ? "hover:bg-pl-100/50" : "hover:bg-nl-50"}`}
        onClick={onCategoryClick}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab rounded p-1 transition-colors hover:bg-gray-100 active:cursor-grabbing"
        >
          <GripHorizontal
            className={`${isSelected ? "text-pl-500" : "text-black"}`}
          />
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={handleToggleExpanded}
          className="rounded p-1 transition-colors hover:bg-gray-100"
        >
          {isExpanded ? (
            <ChevronDown
              className={`h-4 w-4 ${isSelected ? "text-pl-500" : "text-black"}`}
            />
          ) : (
            <ChevronRight
              className={`h-4 w-4 ${isSelected ? "text-pl-500" : "text-black"}`}
            />
          )}
        </button>

        <p
          className={`flex-1 overflow-hidden text-sm font-medium overflow-ellipsis whitespace-nowrap ${isSelected ? "text-pl-500" : "text-black"}`}
        >
          {category.name} ({data?.data?.length ?? "-"})
        </p>
        <span
          className={`min-w-fit text-xs ${isSelected ? "text-pl-500" : "text-black"}`}
        >
          #{category.sortOrder}
        </span>
        <IconButton icon={Ellipsis} />
      </div>

      {/* SubCategory Section */}
      <SubCategoryDragSection
        categoryId={category._id}
        isExpanded={isExpanded}
        data={data}
        isFetching={isFetching}
        onSelect={onSelectSubCategory}
        selectedCategory={selectedSubCategory}
        onHeightChange={handleSubCategoryHeightChange}
      />
      {isExpanded && (
        <div className="w-full p-4">
          <Button
            fullWidth
            startIcon={<Plus className="text-pl-500" />}
            variant="outline"
            size="sm"
            onClick={open}
            disabled={isFetching}
            isLoading={isFetching}
          >
            {allowDirectProducts
              ? "Add Product/Sub Category"
              : "Add Sub Category"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryDragCard;
