import Select, {
  type CustomSelectProps,
  type SelectOption,
} from "@/components/base/Select";
import { useInputState } from "@/hooks/useInputState";
import type {
  CategoryQueryParams,
  SubCategoryResponse,
} from "@/types/category.types";
import { uniqBy } from "lodash";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useFetchSubCategoryList } from "./hooks";

type Props = {
  intCategory?: SubCategoryResponse;
  categoryId: string;
  parentCategoryId?: string;
  onChange: (categoryId: string) => void;
  error?: string;
  variant?: CustomSelectProps["variant"];
  label?: string;
};

const SubCategoryDropdown: FC<Props> = (props) => {
  const {
    categoryId,
    onChange,
    intCategory,
    error,
    label,
    variant,
    parentCategoryId,
  } = props;
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);

  const [selectedCategoryOption, setSelectedCategoryOption] =
    useState<SelectOption>(null);

  useEffect(() => {
    if (intCategory) {
      setSelectedCategoryOption((prev) =>
        prev ? prev : { label: intCategory.name, value: intCategory._id },
      );
    }
  }, [intCategory]);

  const ctQuery = useMemo<CategoryQueryParams>(
    () => ({
      limit: 10,
      page: 1,
      search: debounceVal,
      categoryId: parentCategoryId || undefined,
    }),
    [debounceVal, parentCategoryId],
  );
  const { data: categoryMetaData, isFetching: isCategoriesFetching } =
    useFetchSubCategoryList(ctQuery);
  const { data: storeList = [] } = categoryMetaData || {};
  const categoryOptions = useMemo(() => {
    const categoryOptions = storeList.map((e) => ({
      label: e.name,
      value: e._id,
    }));
    if (selectedCategoryOption) {
      categoryOptions.push(selectedCategoryOption);
    }
    return uniqBy(categoryOptions, (e) => e.value);
  }, [storeList, selectedCategoryOption]);

  const selectedOption = useMemo(
    () => categoryOptions.find((e) => e.value === categoryId),
    [categoryId, categoryOptions],
  );

  const handleChange = useCallback(
    (val: SelectOption) => {
      setSelectedCategoryOption(val);
      onChange(val?.value || "");
    },
    [onChange],
  );

  return (
    <Select
      label={label}
      variant={variant}
      isLoading={isCategoriesFetching}
      options={categoryOptions}
      value={selectedOption}
      onChange={handleChange as any}
      placeholder={"Select subcategory"}
      onInputChange={(nVal) =>
        onInputChange({
          target: {
            value: nVal,
          },
        } as any)
      }
      inputValue={inputValue}
      error={error}
    />
  );
};

export default SubCategoryDropdown;
