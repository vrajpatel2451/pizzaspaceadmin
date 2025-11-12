import Dialog from "@/components/compound/Dialog";
import type { AddonGroupResponse, AddonResponse } from "@/types/addon.types";
import { useCallback, type FC } from "react";
import type { VariantFormData } from "../variants/VariantStepperForm";
import AddonStepperForm, {
  type AddonFormData,
  type AddonPricingData,
} from "./AddonStepperForm";

type Props = {
  addonGroups: AddonGroupResponse[];
  addons: AddonResponse[];
  formData: AddonFormData;
  pricing: AddonPricingData[];
  productId: string;
  variantFormData: VariantFormData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (addonData: AddonFormData, pricingData: AddonPricingData[]) => void;
};

const AddonDialog: FC<Props> = (props) => {
  const {
    productId,
    isOpen,
    onClose,
    onSave,
    pricing,
    formData,
    addonGroups,
    addons,
    variantFormData,
  } = props;

  const onSubmit = useCallback(
    (addonData: AddonFormData, pricingData: AddonPricingData[]) => {
      onSave(addonData, pricingData);
      onClose();
    },
    [onClose, onSave],
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Add-ons"
      size="full"
      subTitle="Select and configure add-ons for this product"
    >
      <AddonStepperForm
        pricing={pricing}
        defaultValue={formData}
        addonGroups={addonGroups}
        addons={addons}
        itemId={productId}
        variantFormData={variantFormData}
        onSave={onSubmit}
      />
    </Dialog>
  );
};

export default AddonDialog;
