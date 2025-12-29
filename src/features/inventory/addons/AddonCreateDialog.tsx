import Dialog from "@/components/compound/Dialog";
import type {
  AddonGroupResponse,
  AddonResponse,
  AddonWriteApiResponse,
} from "@/types/addon.types";
import { useCallback, useMemo, type FC } from "react";
import { v4 } from "uuid";
import type { AddonFormFields } from "./AddonForm";
import AddonForm from "./AddonForm";

type Props = {
  addonGroup?: AddonGroupResponse;
  addons?: AddonResponse[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiResponse: AddonWriteApiResponse) => void;
};

const AddonCreateDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, addonGroup, addons } = props;
  const { _id } = addonGroup || {};
  const initData = useMemo<AddonFormFields>(() => {
    if (addonGroup) {
      return {
        addons: addons?.map((addon) => ({
          label: addon.label,
          price: addon.price,
          _id: addon._id,
          groupId: addon.groupId,
          storeIds: addon.storeIds,
          uiKey: v4(),
        })),
        allowMulti: addonGroup.allowMulti,
        description: addonGroup.description,
        label: addonGroup.label,
        max: addonGroup.max,
        skipValidation: addonGroup.skipValidation,
        min: addonGroup.min,
        storeIds: addonGroup.storeIds,
      };
    }
    return {
      addons: [],
      allowMulti: false,
      description: "",
      skipValidation: false,
      label: "",
      max: 0,
      min: 0,
      storeIds: [],
    };
  }, [addonGroup, addons]);

  const onSubmit = useCallback(
    (apiResponse: AddonWriteApiResponse) => {
      onSave(apiResponse);
      onClose();
    },
    [onClose, onSave],
  );
  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Addon Details"
      size="lg"
      subTitle="Enter details of addon and save form to see results"
    >
      <AddonForm
        action={addonGroup ? "edit" : "create"}
        defaultValue={initData}
        id={_id}
        onSubmitSuccess={onSubmit}
      />
    </Dialog>
  );
};

export default AddonCreateDialog;
