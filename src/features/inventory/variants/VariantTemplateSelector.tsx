import { Input } from "@/components/base/Input";
import Dialog from "@/components/compound/Dialog";
import {
  VARIANT_TEMPLATES,
  searchTemplates,
  type VariantTemplate,
  type VariantTemplateCategory,
} from "@/constants/variantTemplates";
import { cn } from "@/utils/helpers";
import { Copy, FileText, Search } from "lucide-react";
import { useState, type FC } from "react";

interface VariantTemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: VariantTemplate) => void;
}

const VariantTemplateSelector: FC<VariantTemplateSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<VariantTemplate | null>(null);

  const filteredCategories: VariantTemplateCategory[] = searchQuery
    ? searchTemplates(searchQuery)
    : VARIANT_TEMPLATES;

  const handleSelectTemplate = (template: VariantTemplate) => {
    setSelectedTemplate(template);
  };

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      close={handleClose}
      title="Variant Templates"
      subTitle="Select a template to quickly add a variant group"
      size="lg"
      actions={{
        primary: {
          label: "Use Template",
          onClick: handleConfirmSelection,
          disabled: !selectedTemplate,
          startIcon: <Copy size={16} />,
        },
        secondary: {
          label: "Cancel",
          onClick: handleClose,
        },
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftElement={<Search size={16} />}
          />
        </div>

        {/* Templates List */}
        <div className="max-h-[50vh] overflow-y-auto">
          {filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText
                size={48}
                className="text-nl-300 dark:text-nd-500 mb-4"
              />
              <p className="text-nl-500 dark:text-nd-400">
                No templates found for "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <div key={category.category}>
                  <h3 className="text-nl-600 dark:text-nd-300 mb-3 text-sm font-semibold uppercase tracking-wide">
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {category.templates.map((template) => (
                      <TemplateCard
                        key={`${category.category}-${template.label}`}
                        template={template}
                        isSelected={selectedTemplate?.label === template.label}
                        onSelect={() => handleSelectTemplate(template)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Template Preview */}
        {selectedTemplate && (
          <div className="bg-pl-50 dark:bg-pd-900/30 border-pl-200 dark:border-pd-700 rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-pl-700 dark:text-pd-200 font-medium">
                Selected: {selectedTemplate.label}
              </h4>
              <span className="text-pl-600 dark:text-pd-300 text-sm">
                {selectedTemplate.variants.length} variants
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTemplate.variants.map((variant, index) => (
                <span
                  key={index}
                  className="bg-pl-100 text-pl-700 dark:bg-pd-800 dark:text-pd-200 rounded-full px-3 py-1 text-sm"
                >
                  {variant.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

interface TemplateCardProps {
  template: VariantTemplate;
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard: FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all",
        isSelected
          ? "border-pl-500 bg-pl-50 dark:border-pd-400 dark:bg-pd-900/30"
          : "border-nl-200 dark:border-nd-500 hover:border-pl-300 dark:hover:border-pd-500 bg-white dark:bg-nd-700"
      )}
    >
      <div className="mb-2 flex w-full items-center justify-between">
        <h4
          className={cn(
            "font-medium",
            isSelected
              ? "text-pl-700 dark:text-pd-200"
              : "text-nl-800 dark:text-nd-100"
          )}
        >
          {template.label}
        </h4>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs",
            isSelected
              ? "bg-pl-100 text-pl-700 dark:bg-pd-800 dark:text-pd-200"
              : "bg-nl-100 text-nl-600 dark:bg-nd-600 dark:text-nd-300"
          )}
        >
          {template.variants.length}
        </span>
      </div>
      <p className="text-nl-500 dark:text-nd-400 mb-3 text-sm">
        {template.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {template.variants.slice(0, 4).map((variant, index) => (
          <span
            key={index}
            className="bg-nl-100 text-nl-600 dark:bg-nd-600 dark:text-nd-300 rounded px-2 py-0.5 text-xs"
          >
            {variant.label}
          </span>
        ))}
        {template.variants.length > 4 && (
          <span className="text-nl-500 dark:text-nd-400 px-2 py-0.5 text-xs">
            +{template.variants.length - 4} more
          </span>
        )}
      </div>
    </button>
  );
};

export default VariantTemplateSelector;
