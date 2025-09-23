import Dialog from "@/components/compound/Dialog";
import type { AddonGroupResponse, AddonResponse } from "@/types/addon.types";
import { useCallback, type FC } from "react";
import VariantStepperForm, {
  type VariantFormData,
  type VariantPricingData,
} from "./VariantStepperForm";

type Props = {
  addonGroups: AddonGroupResponse[];
  addons: AddonResponse[];
  formData: VariantFormData;
  pricing: VariantPricingData[];
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    variantData: VariantFormData,
    pricingData: VariantPricingData[],
    deletedVariantIds: string[],
    deletedVariantGroupIds: string[],
  ) => void;
};
const VariantDialog: FC<Props> = (props) => {
  const {
    productId,
    isOpen,
    onClose,
    onSave,
    pricing,
    formData,
    addonGroups,
    addons,
  } = props;
  const onSubmit = useCallback(
    (
      variantData: VariantFormData,
      pricingData: VariantPricingData[],
      deletedVariantIds: string[],
      deletedVariantGroupIds: string[],
    ) => {
      onSave(
        variantData,
        pricingData,
        deletedVariantIds,
        deletedVariantGroupIds,
      );
      onClose();
    },
    [onClose, onSave],
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Variants"
      size="full"
      subTitle="Enter details of variants and save form to see results"
    >
      <VariantStepperForm
        pricing={pricing}
        defaultValue={formData}
        addonGroups={addonGroups}
        addons={addons}
        itemId={productId}
        onSave={onSubmit}
      />
    </Dialog>
  );
};

export default VariantDialog;
