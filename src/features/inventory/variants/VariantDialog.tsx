import Dialog from "@/components/compound/Dialog";
import type { AddonGroupResponse, AddonResponse } from "@/types/addon.types";
import type { VariantPricingResponse } from "@/types/variantPricing.types";
import type {
  VariantGroupResponse,
  VariantResponse,
} from "@/types/variants.types";
import { type FC } from "react";
import VariantStepperForm from "./VariantStepperForm";

type Props = {
  addonGroups: AddonGroupResponse[];
  addons: AddonResponse[];
  variantGroups: VariantGroupResponse[];
  variants: VariantResponse[];
  deletedVariantIds: string[];
  deletedVariantGroupIds: string[];
  pricing: VariantPricingResponse[];

  isOpen: boolean;
  onClose: () => void;
  onSave: (
    variantGroups: VariantGroupResponse[],
    variants: VariantResponse[],
    deletedVariantIds: string[],
    deletedVariantGroupIds: string[],
    pricing: VariantPricingResponse[],
  ) => void;
};

const VariantDialog: FC<Props> = (props) => {
  const {
    addonGroups,
    addons,
    deletedVariantGroupIds,
    deletedVariantIds,
    isOpen,
    onClose,
    onSave,
    pricing,
    variantGroups,
    variants,
  } = props;
  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Variants"
      size="full"
      subTitle="Enter details of variants and save form to see results"
    >
      <VariantStepperForm
        onNext={(data) => {
          console.log("Next data:", data);
        }}
        defaultValue={{
          variantGroups: [],
        }}
        itemId="wefwffdfsdf"
        onSaveDraft={(data) => {
          console.log("Save data:", data);
        }}
      />
    </Dialog>
  );
};

export default VariantDialog;
