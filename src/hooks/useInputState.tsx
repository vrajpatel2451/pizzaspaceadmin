import { debounce } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";

export const useInputState = (initialVal?: string, debounceMillis = 0) => {
  const [value, setValue] = useState(initialVal || "");
  const [debounceVal, setDebounceVal] = useState(initialVal || "");
  const isDirtyRef = useRef(false);

  const onDebounceInputChange = useMemo(
    () => debounce((val: string) => setDebounceVal(val), debounceMillis),
    [debounceMillis],
  );

  const onInputChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      isDirtyRef.current = true;
      setValue(e.target.value);
      if (debounceMillis) {
        onDebounceInputChange(e.target.value);
      }
    },
    [debounceMillis, onDebounceInputChange],
  );

  return {
    inputValue: value,
    debounceVal,
    onInputChange,
    setInputValue: setValue,
    isDirty: isDirtyRef.current,
  };
};
