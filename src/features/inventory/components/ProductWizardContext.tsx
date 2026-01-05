import type { AddonGroupResponse, AddonResponse } from "@/types/addon.types";
import type { CategoryResponse, SubCategoryResponse } from "@/types/category.types";
import type { ComboFormData } from "@/types/product.types";
import type { VariantPricingResponse } from "@/types/variantPricing.types";
import type { VariantGroupResponse, VariantResponse } from "@/types/variants.types";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormFields, ProductAction } from "./ProductForm";
import type { VariantFormData, VariantPricingData } from "../variants/VariantStepperForm";
import type { AddonFormData, AddonPricingData } from "../addons/AddonStepperForm";

export type ProductWizardStep = number;

export interface ProductWizardStepConfig {
  number: number;
  label: string;
  subtitle: string;
}

export const PRODUCT_WIZARD_STEPS: ProductWizardStepConfig[] = [
  { number: 1, label: "Basic Info", subtitle: "General product details" },
  { number: 2, label: "Serving Info", subtitle: "Serving size and portions" },
  { number: 3, label: "Pricing", subtitle: "Product pricing details" },
  { number: 4, label: "Variants", subtitle: "Size and flavor options" },
  { number: 5, label: "Addons", subtitle: "Optional customizations" },
  { number: 6, label: "Additional Details", subtitle: "Tags and ingredients" },
  { number: 7, label: "Nutritional Info", subtitle: "Nutrition and allergens" },
];

export const COMBO_WIZARD_STEPS: ProductWizardStepConfig[] = [
  { number: 1, label: "Basic Info", subtitle: "General product details" },
  { number: 2, label: "Serving Info", subtitle: "Serving size and portions" },
  { number: 3, label: "Pricing", subtitle: "Product pricing details" },
  { number: 4, label: "Combo Products", subtitle: "Configure combo selections" },
  { number: 5, label: "Additional Details", subtitle: "Tags and ingredients" },
  { number: 6, label: "Nutritional Info", subtitle: "Nutrition and allergens" },
];

interface ProductWizardContextValue {
  // Form state (react-hook-form)
  form: UseFormReturn<ProductFormFields>;

  // Current step
  currentStep: ProductWizardStep;
  setCurrentStep: (step: ProductWizardStep) => void;

  // Variant state
  variantFormData: VariantFormData;
  setVariantFormData: (data: VariantFormData) => void;
  pricingFormData: VariantPricingData[];
  setPricingFormData: (data: VariantPricingData[]) => void;
  deletedVariantIds: string[];
  setDeletedVariantIds: (ids: string[]) => void;
  deletedVariantGroupIds: string[];
  setDeletedVariantGroupIds: (ids: string[]) => void;

  // Addon state
  addonFormData: AddonFormData;
  setAddonFormData: (data: AddonFormData) => void;
  addonPricingFormData: AddonPricingData[];
  setAddonPricingFormData: (data: AddonPricingData[]) => void;

  // Combo state
  comboFormData: ComboFormData;
  setComboFormData: (data: ComboFormData) => void;
  deletedComboGroupIds: string[];
  setDeletedComboGroupIds: (ids: string[]) => void;

  // Combo picker
  isComboPickerOpen: boolean;
  openComboPicker: () => void;
  closeComboPicker: () => void;
  activeComboGroupId: string | null;
  setActiveComboGroupId: (id: string | null) => void;

  // Dynamic steps
  getStepConfig: () => ProductWizardStepConfig[];
  getTotalSteps: () => number;

  // Reference data (read-only)
  allAddonGroups: AddonGroupResponse[];
  allAddons: AddonResponse[];
  productAddonGroups: AddonGroupResponse[];
  productAddons: AddonResponse[];
  variantGroups: VariantGroupResponse[];
  variants: VariantResponse[];
  pricing: VariantPricingResponse[];
  selectedCategory?: CategoryResponse;
  selectedSubCategory?: SubCategoryResponse;

  // Dialogs
  isVariantDialogOpen: boolean;
  openVariantDialog: () => void;
  closeVariantDialog: () => void;
  isAddonDialogOpen: boolean;
  openAddonDialog: () => void;
  closeAddonDialog: () => void;

  // Media picker
  isMediaPickerOpen: boolean;
  openMediaPicker: () => void;
  closeMediaPicker: () => void;

  // Mode
  action: ProductAction;
  productId?: string;

  // Saving state
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
}

const ProductWizardContext = createContext<ProductWizardContextValue | null>(null);

export const useProductWizard = () => {
  const context = useContext(ProductWizardContext);
  if (!context) {
    throw new Error("useProductWizard must be used within a ProductWizardProvider");
  }
  return context;
};

interface ProductWizardProviderProps {
  children: ReactNode;
  form: UseFormReturn<ProductFormFields>;
  action: ProductAction;
  productId?: string;
  // Reference data
  allAddonGroups: AddonGroupResponse[];
  allAddons: AddonResponse[];
  productAddonGroups: AddonGroupResponse[];
  productAddons: AddonResponse[];
  variantGroups: VariantGroupResponse[];
  variants: VariantResponse[];
  pricing: VariantPricingResponse[];
  selectedCategory?: CategoryResponse;
  selectedSubCategory?: SubCategoryResponse;
  // Initial variant/addon data
  initialVariantFormData: VariantFormData;
  initialPricingFormData: VariantPricingData[];
  initialAddonFormData: AddonFormData;
  initialAddonPricingFormData: AddonPricingData[];
  // Initial combo data
  initialComboFormData: ComboFormData;
}

export const ProductWizardProvider: FC<ProductWizardProviderProps> = ({
  children,
  form,
  action,
  productId,
  allAddonGroups,
  allAddons,
  productAddonGroups,
  productAddons,
  variantGroups,
  variants,
  pricing,
  selectedCategory,
  selectedSubCategory,
  initialVariantFormData,
  initialPricingFormData,
  initialAddonFormData,
  initialAddonPricingFormData,
  initialComboFormData,
}) => {
  // Current step
  const [currentStep, setCurrentStep] = useState<ProductWizardStep>(1);

  // Variant state
  const [variantFormData, setVariantFormData] = useState<VariantFormData>(initialVariantFormData);
  const [pricingFormData, setPricingFormData] = useState<VariantPricingData[]>(initialPricingFormData);
  const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([]);
  const [deletedVariantGroupIds, setDeletedVariantGroupIds] = useState<string[]>([]);

  // Addon state
  const [addonFormData, setAddonFormData] = useState<AddonFormData>(initialAddonFormData);
  const [addonPricingFormData, setAddonPricingFormData] = useState<AddonPricingData[]>(initialAddonPricingFormData);

  // Combo state
  const [comboFormData, setComboFormData] = useState<ComboFormData>(initialComboFormData);
  const [deletedComboGroupIds, setDeletedComboGroupIds] = useState<string[]>([]);

  // Dialog states
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [isAddonDialogOpen, setIsAddonDialogOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isComboPickerOpen, setIsComboPickerOpen] = useState(false);
  const [activeComboGroupId, setActiveComboGroupId] = useState<string | null>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // Dialog handlers
  const openVariantDialog = useCallback(() => setIsVariantDialogOpen(true), []);
  const closeVariantDialog = useCallback(() => setIsVariantDialogOpen(false), []);
  const openAddonDialog = useCallback(() => setIsAddonDialogOpen(true), []);
  const closeAddonDialog = useCallback(() => setIsAddonDialogOpen(false), []);
  const openMediaPicker = useCallback(() => setIsMediaPickerOpen(true), []);
  const closeMediaPicker = useCallback(() => setIsMediaPickerOpen(false), []);
  const openComboPicker = useCallback(() => setIsComboPickerOpen(true), []);
  const closeComboPicker = useCallback(() => setIsComboPickerOpen(false), []);

  // Dynamic step configuration based on isCombo
  const getStepConfig = useCallback((): ProductWizardStepConfig[] => {
    const isCombo = form.watch("isCombo") ?? false;
    return isCombo ? COMBO_WIZARD_STEPS : PRODUCT_WIZARD_STEPS;
  }, [form]);

  const getTotalSteps = useCallback((): number => {
    const isCombo = form.watch("isCombo") ?? false;
    return isCombo ? COMBO_WIZARD_STEPS.length : PRODUCT_WIZARD_STEPS.length;
  }, [form]);

  const value = useMemo<ProductWizardContextValue>(
    () => ({
      form,
      currentStep,
      setCurrentStep,
      variantFormData,
      setVariantFormData,
      pricingFormData,
      setPricingFormData,
      deletedVariantIds,
      setDeletedVariantIds,
      deletedVariantGroupIds,
      setDeletedVariantGroupIds,
      addonFormData,
      setAddonFormData,
      addonPricingFormData,
      setAddonPricingFormData,
      comboFormData,
      setComboFormData,
      deletedComboGroupIds,
      setDeletedComboGroupIds,
      isComboPickerOpen,
      openComboPicker,
      closeComboPicker,
      activeComboGroupId,
      setActiveComboGroupId,
      getStepConfig,
      getTotalSteps,
      allAddonGroups,
      allAddons,
      productAddonGroups,
      productAddons,
      variantGroups,
      variants,
      pricing,
      selectedCategory,
      selectedSubCategory,
      isVariantDialogOpen,
      openVariantDialog,
      closeVariantDialog,
      isAddonDialogOpen,
      openAddonDialog,
      closeAddonDialog,
      isMediaPickerOpen,
      openMediaPicker,
      closeMediaPicker,
      action,
      productId,
      isSaving,
      setIsSaving,
    }),
    [
      form,
      currentStep,
      variantFormData,
      pricingFormData,
      deletedVariantIds,
      deletedVariantGroupIds,
      addonFormData,
      addonPricingFormData,
      comboFormData,
      deletedComboGroupIds,
      isComboPickerOpen,
      openComboPicker,
      closeComboPicker,
      activeComboGroupId,
      getStepConfig,
      getTotalSteps,
      allAddonGroups,
      allAddons,
      productAddonGroups,
      productAddons,
      variantGroups,
      variants,
      pricing,
      selectedCategory,
      selectedSubCategory,
      isVariantDialogOpen,
      openVariantDialog,
      closeVariantDialog,
      isAddonDialogOpen,
      openAddonDialog,
      closeAddonDialog,
      isMediaPickerOpen,
      openMediaPicker,
      closeMediaPicker,
      action,
      productId,
      isSaving,
    ]
  );

  return (
    <ProductWizardContext.Provider value={value}>
      {children}
    </ProductWizardContext.Provider>
  );
};
