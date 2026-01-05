/**
 * Demo variant templates for quick variant group creation
 * Users can select a template and it will be cloned to create a new variant group
 */

export interface VariantTemplateItem {
  label: string;
}

export interface VariantTemplate {
  label: string;
  description: string;
  variants: VariantTemplateItem[];
}

export interface VariantTemplateCategory {
  category: string;
  templates: VariantTemplate[];
}

export const VARIANT_TEMPLATES: VariantTemplateCategory[] = [
  {
    category: "Size Variants",
    templates: [
      {
        label: "Size (Inch)",
        description: "Pizza sizes in inches",
        variants: [
          { label: '6" Mini' },
          { label: '7" Small' },
          { label: '9" Medium' },
          { label: '12" Large' },
          { label: '15" XLarge' },
          { label: '20" XXLarge' },
        ],
      },
      {
        label: "Size (Simple)",
        description: "Standard clothing sizes",
        variants: [
          { label: "XS" },
          { label: "SM" },
          { label: "MD" },
          { label: "LG" },
          { label: "XL" },
          { label: "XXL" },
        ],
      },
      {
        label: "Size (Cup / Bowl)",
        description: "Beverage or soup sizes",
        variants: [
          { label: "Small" },
          { label: "Medium" },
          { label: "Large" },
        ],
      },
      {
        label: "Size (Burger / Sandwich)",
        description: "Burger and sandwich sizes",
        variants: [
          { label: "Small" },
          { label: "Regular" },
          { label: "Double" },
          { label: "Jumbo" },
        ],
      },
      {
        label: "Size (Plate / Meal)",
        description: "Plate or meal portion sizes",
        variants: [{ label: "Half Plate" }, { label: "Full Plate" }],
      },
    ],
  },
  {
    category: "Crust / Base Variants",
    templates: [
      {
        label: "Crust Type",
        description: "Pizza crust options",
        variants: [
          { label: "Thin Crust" },
          { label: "Hand Tossed" },
          { label: "Deep Pan" },
          { label: "Cheese Burst" },
          { label: "Stuffed Crust" },
          { label: "Italian Crust" },
          { label: "Gluten Free" },
        ],
      },
      {
        label: "Bread Type",
        description: "Burger and sandwich bread options",
        variants: [
          { label: "White Bun" },
          { label: "Brown Bun" },
          { label: "Multigrain Bun" },
          { label: "Brioche Bun" },
          { label: "Lettuce Wrap" },
        ],
      },
    ],
  },
  {
    category: "Dough / Batter Variants",
    templates: [
      {
        label: "Dough Type",
        description: "Dough or batter options",
        variants: [
          { label: "Regular Dough" },
          { label: "Whole Wheat Dough" },
          { label: "Multigrain Dough" },
          { label: "Gluten Free Dough" },
        ],
      },
    ],
  },
  {
    category: "Spice / Heat Level",
    templates: [
      {
        label: "Spice Level",
        description: "Spice intensity options",
        variants: [
          { label: "No Spice" },
          { label: "Mild" },
          { label: "Medium" },
          { label: "Spicy" },
          { label: "Extra Spicy" },
        ],
      },
      {
        label: "Heat Preference",
        description: "Simple heat level options",
        variants: [{ label: "Low" }, { label: "Normal" }, { label: "High" }],
      },
    ],
  },
  {
    category: "Cheese Variants",
    templates: [
      {
        label: "Cheese Type",
        description: "Type of cheese options",
        variants: [
          { label: "Mozzarella" },
          { label: "Cheddar" },
          { label: "Parmesan" },
          { label: "Gouda" },
          { label: "Vegan Cheese" },
        ],
      },
      {
        label: "Cheese Quantity",
        description: "Amount of cheese options",
        variants: [
          { label: "No Cheese" },
          { label: "Regular Cheese" },
          { label: "Extra Cheese" },
        ],
      },
    ],
  },
  {
    category: "Sauce Variants",
    templates: [
      {
        label: "Sauce Type",
        description: "Sauce options",
        variants: [
          { label: "Tomato" },
          { label: "BBQ" },
          { label: "Peri-Peri" },
          { label: "Garlic" },
          { label: "Mayo" },
          { label: "Mustard" },
        ],
      },
    ],
  },
  {
    category: "Sweetness Level",
    templates: [
      {
        label: "Sweetness Level",
        description: "Sugar level options",
        variants: [
          { label: "No Sugar" },
          { label: "Less Sugar" },
          { label: "Regular Sugar" },
          { label: "Extra Sugar" },
        ],
      },
    ],
  },
  {
    category: "Ice & Temperature",
    templates: [
      {
        label: "Ice Level",
        description: "Ice quantity options",
        variants: [
          { label: "No Ice" },
          { label: "Less Ice" },
          { label: "Regular Ice" },
        ],
      },
      {
        label: "Temperature",
        description: "Serving temperature options",
        variants: [{ label: "Hot" }, { label: "Warm" }, { label: "Cold" }],
      },
    ],
  },
  {
    category: "Milk Variants",
    templates: [
      {
        label: "Milk Type",
        description: "Milk options for beverages",
        variants: [
          { label: "Full Cream" },
          { label: "Toned" },
          { label: "Skimmed" },
          { label: "Almond" },
          { label: "Soy" },
          { label: "Oat" },
        ],
      },
    ],
  },
  {
    category: "Cooking Preference",
    templates: [
      {
        label: "Cooking Preference",
        description: "How well cooked the food should be",
        variants: [
          { label: "Normal Cook" },
          { label: "Well Cooked" },
          { label: "Extra Crispy" },
          { label: "Lightly Cooked" },
        ],
      },
    ],
  },
  {
    category: "Portion / Quantity",
    templates: [
      {
        label: "Portion Size",
        description: "Quantity options",
        variants: [
          { label: "Single" },
          { label: "Double" },
          { label: "Family" },
        ],
      },
    ],
  },
  {
    category: "Packaging / Order Type",
    templates: [
      {
        label: "Order Type",
        description: "How the order will be served",
        variants: [
          { label: "Dine-In" },
          { label: "Takeaway" },
          { label: "Delivery" },
        ],
      },
    ],
  },
  {
    category: "Cut / Serving Style",
    templates: [
      {
        label: "Pizza Cut",
        description: "Number of pizza slices",
        variants: [
          { label: "4 Slices" },
          { label: "6 Slices" },
          { label: "8 Slices" },
        ],
      },
      {
        label: "Sandwich Cut",
        description: "Sandwich cutting options",
        variants: [{ label: "Half Cut" }, { label: "Full Cut" }],
      },
    ],
  },
  {
    category: "Dietary Variant",
    templates: [
      {
        label: "Dietary Preference",
        description: "Dietary restriction options",
        variants: [
          { label: "Vegetarian" },
          { label: "Vegan" },
          { label: "Jain" },
          { label: "Eggless" },
        ],
      },
    ],
  },
];

/**
 * Get all templates flattened into a single array
 */
export const getAllTemplates = (): VariantTemplate[] => {
  return VARIANT_TEMPLATES.flatMap((category) => category.templates);
};

/**
 * Search templates by label or category
 */
export const searchTemplates = (query: string): VariantTemplateCategory[] => {
  const lowerQuery = query.toLowerCase();

  return VARIANT_TEMPLATES.map((category) => ({
    ...category,
    templates: category.templates.filter(
      (template) =>
        template.label.toLowerCase().includes(lowerQuery) ||
        template.description.toLowerCase().includes(lowerQuery) ||
        category.category.toLowerCase().includes(lowerQuery)
    ),
  })).filter((category) => category.templates.length > 0);
};
