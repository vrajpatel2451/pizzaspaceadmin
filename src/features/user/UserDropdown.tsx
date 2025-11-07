import Select, {
  type CustomSelectProps,
  type SelectOption,
} from "@/components/base/Select";
import { useInputState } from "@/hooks/useInputState";
import { useToggle } from "@/hooks/useToggle";
import type { UserQueryParams, UserResponse } from "@/types/user.types";
import { uniqBy } from "lodash";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useFetchUserList } from "./hooks";
import UserDialog from "./UserDialog";

type Props = {
  initUser?: UserResponse;
  userId: string;
  onChange: (userId: string) => void;
  error?: string;
  variant?: CustomSelectProps["variant"];
  label?: string;
};

const UserDropdown: FC<Props> = (props) => {
  const { userId, onChange, initUser, error, label, variant } = props;
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);

  const [selectedUserOption, setSelectedUserOption] =
    useState<SelectOption>(null);

  const { isOpen: isDialogOpen, open: openDialog, close: closeDialog } = useToggle();

  useEffect(() => {
    if (initUser) {
      setSelectedUserOption((prev) =>
        prev
          ? prev
          : { label: `${initUser.name} (${initUser.phone})`, value: initUser._id },
      );
    }
  }, [initUser]);

  const userQuery = useMemo<UserQueryParams>(
    () => ({
      limit: 10,
      page: 1,
      search: debounceVal,
    }),
    [debounceVal],
  );

  const { data: userMetaData, isFetching: isUsersFetching } =
    useFetchUserList(userQuery);
  const { data: userList = [] } = userMetaData || {};

  const userOptions = useMemo(() => {
    const userOptions = userList.map((user) => ({
      label: `${user.name} (${user.phone})`,
      value: user._id,
    }));
    if (selectedUserOption) {
      userOptions.push(selectedUserOption);
    }
    return uniqBy(userOptions, (e) => e.value);
  }, [userList, selectedUserOption]);

  const selectedOption = useMemo(
    () => userOptions.find((e) => e.value === userId),
    [userId, userOptions],
  );

  const handleChange = useCallback(
    (val: SelectOption) => {
      // Check if this is a newly created option
      if (val?.__isNew__) {
        // Open dialog to create new user
        openDialog();
        return;
      }
      setSelectedUserOption(val);
      onChange(val?.value || "");
    },
    [onChange, openDialog],
  );

  const handleUserCreated = useCallback(
    (newUser: UserResponse) => {
      const newOption = {
        label: `${newUser.name} (${newUser.phone})`,
        value: newUser._id,
      };
      setSelectedUserOption(newOption);
      onChange(newUser._id);
      closeDialog();
    },
    [onChange, closeDialog],
  );

  return (
    <>
      <Select
        label={label}
        variant={variant}
        isLoading={isUsersFetching}
        options={userOptions}
        value={selectedOption}
        onChange={handleChange as any}
        placeholder={"Select user"}
        onInputChange={(nVal) =>
          onInputChange({
            target: {
              value: nVal,
            },
          } as any)
        }
        inputValue={inputValue}
        error={error}
        isCreatable={true}
      />
      {isDialogOpen && (
        <UserDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          onSave={handleUserCreated}
        />
      )}
    </>
  );
};

export default UserDropdown;
