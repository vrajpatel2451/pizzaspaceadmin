import Select, {
  type CustomSelectProps,
  type SelectOption,
} from "@/components/base/Select";
import { useToggle } from "@/hooks/useToggle";
import type { AddressResponse } from "@/types/user.types";
import { uniqBy } from "lodash";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import AddressDialog from "./AddressDialog";
import { useFetchUserAddresses } from "./hooks";

type Props = {
  initAddress?: AddressResponse;
  addressId: string;
  userId: string;
  onChange: (addressId: string) => void;
  error?: string;
  variant?: CustomSelectProps["variant"];
  label?: string;
};

const AddressDropdown: FC<Props> = (props) => {
  const { addressId, userId, onChange, initAddress, error, label, variant } =
    props;

  const [selectedAddressOption, setSelectedAddressOption] =
    useState<SelectOption>(null);

  const {
    isOpen: isDialogOpen,
    open: openDialog,
    close: closeDialog,
  } = useToggle();

  useEffect(() => {
    if (initAddress) {
      setSelectedAddressOption((prev) =>
        prev
          ? prev
          : {
              label: `${initAddress.line1}, ${initAddress.area}`,
              value: initAddress._id,
            },
      );
    }
  }, [initAddress]);

  const {
    data: addressList = [],
    isFetching: isAddressesFetching,
    refetch,
  } = useFetchUserAddresses(userId, !userId);

  const addressOptions = useMemo(() => {
    const addressOptions = addressList?.map((address) => ({
      label: `${address.line1}, ${address.area}${address.isDefault ? " (Default)" : ""}`,
      value: address._id,
    }));
    if (selectedAddressOption) {
      addressOptions.push(selectedAddressOption);
    }
    return uniqBy(addressOptions, (e) => e.value);
  }, [addressList, selectedAddressOption]);

  const selectedOption = useMemo(
    () => addressOptions.find((e) => e.value === addressId),
    [addressId, addressOptions],
  );

  const handleChange = useCallback(
    (val: SelectOption) => {
      // Check if this is a newly created option
      if (val?.__isNew__) {
        // Open dialog to create new address
        if (!userId) {
          return; // Should not happen since dropdown is disabled
        }
        openDialog();
        return;
      }
      setSelectedAddressOption(val);
      onChange(val?.value || "");
    },
    [onChange, openDialog, userId],
  );

  const handleAddressCreated = useCallback(
    (newAddress: AddressResponse) => {
      const newOption = {
        label: `${newAddress.line1}, ${newAddress.area}${newAddress.isDefault ? " (Default)" : ""}`,
        value: newAddress._id,
      };
      setSelectedAddressOption(newOption);
      onChange(newAddress._id);
      closeDialog();
      // Refetch to update the list
      refetch();
    },
    [onChange, closeDialog, refetch],
  );

  return (
    <>
      <Select
        label={label}
        variant={variant}
        isLoading={isAddressesFetching}
        options={addressOptions}
        value={selectedOption}
        onChange={handleChange as any}
        placeholder={userId ? "Select address" : "Please select a user first"}
        error={error}
        isCreatable={true}
        isDisabled={!userId}
      />
      {isDialogOpen && userId && (
        <AddressDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          onSave={handleAddressCreated}
          userId={userId}
        />
      )}
    </>
  );
};

export default AddressDropdown;
