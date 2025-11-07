# Component Catalog

Comprehensive documentation of all UI components in the FoodBoss Admin application.

## Table of Contents

- [Base Components](#base-components)
- [Compound Components](#compound-components)
- [Common Form Fields](#common-form-fields)
- [Shared/Layout Components](#sharedlayout-components)
- [Icons & Utilities](#icons--utilities)

---

## Base Components

Primitive, reusable UI building blocks.

### Button
**File:** `src/components/base/Button.tsx:64`

Versatile button component with multiple variants, sizes, colors, and loading states.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Button content |
| `variant` | `"filled" \| "outline" \| "ghost" \| "link"` | `"filled"` | Visual style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `color` | `"primary" \| "neutral" \| "success" \| "danger"` | `"primary"` | Color theme |
| `startIcon` | `ReactNode` | - | Icon before text |
| `endIcon` | `ReactNode` | - | Icon after text |
| `isLoading` | `boolean` | `false` | Shows spinner, disables button |
| `disabled` | `boolean` | `false` | Disables interaction |
| `fullWidth` | `boolean` | `false` | Expands to full width |
| `onClick` | `() => void` | - | Click handler |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | HTML button type |

**Key Features:**
- Animated loading state with vertical slide transition
- CVA (class-variance-authority) for styling
- Dark mode support
- Focus ring on keyboard navigation

---

### Checkbox
**File:** `src/components/base/Checkbox.tsx:80`

Accessible checkbox with label, helper text, and indeterminate state support.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Checkbox size |
| `label` | `string` | - | Label text |
| `helperText` | `string` | - | Help text below checkbox |
| `error` | `string` | - | Error message (overrides helperText) |
| `indeterminate` | `boolean` | `false` | Shows minus icon (partial selection) |
| `labelPosition` | `"left" \| "right"` | `"right"` | Label placement |
| `description` | `string` | - | Additional description text |
| `wrapperClassName` | `string` | - | Wrapper div class |
| `labelClassName` | `string` | - | Label element class |
| `helperClassName` | `string` | - | Helper text class |

**Key Features:**
- Indeterminate state with minus icon
- Error state with red styling
- Accessible (keyboard navigation, screen readers)
- Dark mode support
- Auto-generated IDs

---

### Chip
**File:** `src/components/base/Chip.tsx:73`

Compact badge/tag component with multiple color variants.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | **Required.** Chip text |
| `color` | `ChipColor` | `"gray"` | Color theme (11 options) |
| `isCollapsible` | `boolean` | `false` | Shows X icon for removal |
| `onCollapse` | `(e: any) => void` | - | Called when X is clicked |
| `className` | `string` | - | Additional classes |

**Available Colors:** `gray`, `blue`, `red`, `yellow`, `purple`, `orange`, `green`, `teal`, `pink`, `indigo`, `sky`

**Key Features:**
- 11 color variants with dark mode support
- Optional removable state with X icon
- Rounded design with padding

---

### Divider
**File:** `src/components/base/Divider.tsx:8`

Simple horizontal or vertical divider line.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `vertical` | `boolean` | `false` | Vertical orientation |
| `className` | `string` | - | Additional classes |

**Key Features:**
- Horizontal (1px height) or vertical (1px width)
- Dark mode color support

---

### ErrorText
**File:** `src/components/base/ErrorText.tsx:9`

Styled text wrapper for error messages.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Error text content |
| `className` | `string` | - | Additional classes |

**Key Features:**
- Danger color (red) with dark mode support
- Simple wrapper for consistent error styling

---

### IconButton
**File:** `src/components/base/IconButton.tsx:50`

Button component optimized for displaying a single Lucide icon.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `LucideIcon` | - | **Required.** Lucide icon component |
| `onClick` | `(event: React.MouseEvent<HTMLButtonElement>) => void` | - | Click handler |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| number` | `"sm"` | Size preset or custom px |
| `color` | `"neutral" \| string` | `"neutral"` | Color preset or custom class |
| `strokeWidth` | `number` | - | Icon stroke width (auto if not set) |
| `disabled` | `boolean` | `false` | Disables interaction |
| `disableHoverBg` | `boolean` | `false` | Removes hover background |
| `noDefaultFill` | `boolean` | `false` | Removes default background |
| `iconClassName` | `string` | - | Icon element classes |
| `ariaLabel` | `string` | - | Accessibility label |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | HTML button type |
| `iconSize` | `number` | - | Override icon size independently |

**Key Features:**
- Size presets: xs(16px), sm(18px), md(24px), lg(28px), xl(32px)
- Auto-calculated stroke width per size
- Hover background effects
- Dark mode support

---

### Input
**File:** `src/components/base/Input.tsx:61`

Flexible text input with label, helper text, and element slots.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text above input |
| `helperText` | `string` | - | Help text below input |
| `error` | `string` | - | Error message (overrides helperText) |
| `rightElement` | `ReactNode` | - | Element inside input (right side) |
| `leftElement` | `ReactNode` | - | Element inside input (left side) |
| `required` | `boolean` | `false` | Shows asterisk in label |
| `variant` | `"outlined" \| "filled" \| "transparent"` | `"filled"` | Border and background style |
| `inputSize` | `"sm" \| "md" \| "lg"` | `"md"` | Input height/padding |
| `togglePassword` | `boolean` | `false` | Adds eye icon for password fields |
| `fullWidth` | `boolean` | `false` | Expands to container width |
| `containerClassName` | `string` | - | Wrapper div classes |
| `inputWrapperClassName` | `string` | - | Input border wrapper classes |
| `leftElementClassname` | `string` | - | Left element wrapper classes |
| `rightElementClassname` | `string` | - | Right element wrapper classes |

**Key Features:**
- Password toggle with eye icon
- Left/right element slots (icons, buttons, etc.)
- Three border variants
- Error state with red border
- Dark mode support
- Accessible (aria-invalid)

---

### Label
**File:** `src/components/base/Label.tsx:8`

Text label with optional required indicator.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Label text |
| `required` | `boolean` | `false` | Shows red asterisk |
| `className` | `string` | - | Additional classes |

**Key Features:**
- Required indicator (red asterisk)
- Dark mode text colors

---

### Select
**File:** `src/components/base/Select.tsx:17`

Feature-rich dropdown built on react-select with multi-select and creatable support.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | - | **Required.** Dropdown options |
| `value` | `SelectOption \| SelectOption[] \| null` | - | Selected value(s) |
| `defaultValue` | `SelectOption \| SelectOption[] \| null` | - | Initial value |
| `onChange` | `(value: SelectOnChangeVal) => void` | - | Change handler |
| `label` | `string` | - | Label above select |
| `required` | `boolean` | `false` | Shows asterisk in label |
| `variant` | `"default" \| "minimal"` | `"default"` | Border style (minimal has no border) |
| `width` | `number` | `180` | Minimum width in px |
| `isMulti` | `boolean` | - | Enable multi-select |
| `isSearchable` | `boolean` | `true` | Enable search/filter |
| `isClearable` | `boolean` | `false` | Show clear button |
| `isDisabled` | `boolean` | `false` | Disable interaction |
| `isLoading` | `boolean` | `false` | Show loading state |
| `isCreatable` | `boolean` | `false` | Allow creating new options |
| `hideInputValues` | `boolean` | `false` | Hide selected values in dropdown |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Help text below select |

**Key Features:**
- Multi-select with checkboxes
- Creatable options (tags)
- Custom checkbox option rendering
- Check icon for single-select
- Portal rendering (avoids overflow issues)
- Dark mode support
- Minimal variant for inline use

**Helper Functions:**
- `findOptionByValue(options, value)` - Find option by value
- `SingleSelect` - Type-safe single-select wrapper
- `MultiSelect` - Type-safe multi-select wrapper

---

### Switch
**File:** `src/components/base/Switch.tsx:10`

Toggle switch with loading state support.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | **Required.** Toggle state |
| `setChecked` | `(value: boolean) => void` | - | **Required.** Change handler |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Switch size |
| `loading` | `boolean` | `false` | Shows spinner, disables switch |

**Key Features:**
- Three size variants
- Loading state with spinner
- Smooth slide animation
- Green success color when checked
- Dark mode support

---

## Compound Components

Complex, reusable components built from base components.

### Dialog
**File:** `src/components/compound/Dialog.tsx:8`

Modal dialog with header, scrollable content, and action buttons.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | **Required.** Controls visibility |
| `close` | `() => void` | - | **Required.** Close handler |
| `title` | `ReactNode` | - | **Required.** Dialog title |
| `subTitle` | `string` | - | Optional subtitle |
| `children` | `ReactNode` | - | **Required.** Dialog content |
| `actions` | `DialogActions` | - | Footer action buttons |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `"md"` | Dialog width |

**DialogActions Interface:**

```typescript
{
  primary?: { label, onClick, disabled?, startIcon?, endIcon?, loading?, variant?, color?, size? }
  secondary?: { label, onClick, disabled?, startIcon?, endIcon?, loading?, variant?, color?, size? }
  tertiary?: { label, onClick, disabled?, startIcon?, endIcon?, loading?, variant?, color?, size? }
  prefix?: ReactNode
}
```

**Key Features:**
- Portal rendering to document.body
- Backdrop overlay with blur
- X button in header
- Scrollable content area
- Up to 3 action buttons (tertiary, secondary, primary)
- Smooth fade-in animation
- Body scroll lock when open
- Size variants: sm(448px), md(672px), lg(896px), xl(1280px), full(98%)

---

### DeleteDialog
**File:** `src/components/compound/DeleteDialog.tsx:14`

Specialized dialog for delete confirmation.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | **Required.** Controls visibility |
| `close` | `() => void` | - | **Required.** Close handler |
| `onDelete` | `() => void` | - | **Required.** Delete action |
| `title` | `string` | `"Delete"` | Dialog title |
| `name` | `string` | - | Name of item to delete |
| `content` | `ReactNode` | - | Additional warning content |
| `isDeleting` | `boolean` | `false` | Loading state for delete button |

**Key Features:**
- Pre-configured with Delete/Cancel actions
- Highlights item name in warning text
- Loading state support
- Built on Dialog component

---

### Card
**File:** `src/components/compound/Card.tsx:18`

Container card with title, divider, and optional collapse.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | **Required.** Card title |
| `children` | `ReactNode` | - | **Required.** Card content |
| `isCollapsible` | `boolean` | `false` | Enable collapse/expand |
| `defaultOpen` | `boolean` | `false` | Initial collapsed state |
| `className` | `string` | - | Card wrapper classes |
| `headClassName` | `string` | - | Header section classes |
| `bodyClassName` | `string` | - | Body section classes |

**Key Features:**
- Header with title
- Divider between header and body
- Optional collapse with chevron icon
- Smooth height animation
- Dark mode support

---

### Tabs
**File:** `src/components/compound/Tabs.tsx:21`

Tab navigation with animated sliding indicator.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttonList` | `TabButtonListItem[]` | - | **Required.** Tab options |
| `selected` | `string` | - | **Required.** Active tab value |
| `onChange` | `(value: string) => void` | - | **Required.** Tab change handler |
| `fullWidth` | `boolean` | `false` | Expands to container width |
| `containerClassname` | `string` | - | Tabs wrapper classes |
| `buttonClassname` | `string` | - | Individual tab classes |

**TabButtonListItem Interface:**

```typescript
{
  label: string
  value: string
  startIcon?: keyof typeof LucideIcons
  endIcon?: keyof typeof LucideIcons
}
```

**Key Features:**
- Animated highlight indicator
- Smooth sliding transition
- Optional start/end icons (Lucide)
- Calculated position using refs
- Hover effects on inactive tabs

---

### Table
**File:** `src/components/compound/table/Table.tsx:10`

Feature-rich data table with sorting, selection, and pagination.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `TableColumn[]` | - | Column definitions |
| `data` | `T[]` | - | **Required.** Table rows |
| `enableRowSelection` | `boolean` | `false` | Enables checkboxes |
| `selectedIds` | `string[]` | - | Selected row IDs (if selection enabled) |
| `onRowSelection` | `(id: string) => void` | - | Selection handler |
| `rowSelectionKey` | `keyof T` | `"id"` | Property to use as row ID |
| `sortable` | `boolean` | `false` | Enable sorting |
| `onSort` | `(column: keyof T, direction: "asc" \| "desc") => void` | - | Sort handler |
| `pagination` | `PaginationProps` | - | Pagination config |
| `filterComponent` | `ReactNode` | - | Filter UI above table |
| `customRender` | `ReactNode` | - | Custom tbody content |
| `isLoading` | `boolean` | `false` | Shows skeleton loaders |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Cell padding |
| `onRowClick` | `(row: T) => void` | - | Row click handler |
| `isMuted` | `boolean` | `false` | Softer text colors |

**TableColumn Interface:**

```typescript
{
  header: string
  accessor: keyof T | ((data: T) => ReactNode)
  cell?: (value: any, row: T) => ReactNode
  sortable?: boolean
  className?: string
  id?: string
}
```

**Key Features:**
- Select all checkbox
- Indeterminate state for partial selection
- Sort indicators (‘“•)
- Custom cell renderers
- Loading skeleton (10 rows)
- Hover row highlight
- No data state
- Integrated with Pagination component

---

### Pagination
**File:** `src/components/compound/Pagination.tsx:12`

Page navigation with smart ellipsis and selection count.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | - | **Required.** Active page (1-indexed) |
| `totalPages` | `number` | - | **Required.** Total page count |
| `totalItems` | `number` | - | **Required.** Total item count |
| `pageSize` | `number` | - | **Required.** Items per page |
| `hasNextPage` | `boolean` | - | **Required.** Enable next button |
| `hasPrevPage` | `boolean` | - | **Required.** Enable prev button |
| `onPageChange` | `(page: number) => void` | - | **Required.** Page change handler |
| `selectedIds` | `string[]` | - | Selected item IDs (for count) |
| `className` | `string` | - | Wrapper classes |

**Key Features:**
- Smart page number display with ellipsis
- Previous/Next navigation
- Shows results range (e.g., "1-10 of 100")
- Shows selection count when items selected
- Hides completely if totalPages < 2
- Disabled state for navigation buttons

---

### Sheet
**File:** `src/components/compound/Sheet.tsx:31`

Slide-in side panel from the right edge.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | **Required.** Controls visibility |
| `close` | `() => void` | - | **Required.** Close handler |
| `title` | `string` | - | **Required.** Sheet title |
| `subTitle` | `string` | - | Optional subtitle |
| `children` | `ReactNode` | - | **Required.** Sheet content |
| `footer` | `ReactNode` | - | Custom footer content |
| `actions` | `SheetAction[]` | - | Action button array |

**SheetAction Interface:**

```typescript
{
  label: string
  onClick: () => void
  disabled?: boolean
  startIcon?: JSX.Element
  endIcon?: JSX.Element
  fullWidth?: boolean
  loading?: boolean
  className?: string
  size?: ButtonProps["size"]
  variant?: ButtonProps["variant"]
  color?: ButtonProps["color"]
}
```

**Key Features:**
- Slides in from right
- Backdrop with blur
- Header with close button
- Scrollable content
- Optional footer or action buttons
- Body scroll lock when open
- Smooth slide animation

---

### RadioGroup
**File:** `src/components/compound/RadioGroup.tsx:47`

Radio button group with horizontal/vertical layout.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `RadioOption[]` | - | **Required.** Radio options |
| `value` | `string` | - | Selected value (controlled) |
| `defaultValue` | `string` | - | Initial value (uncontrolled) |
| `onChange` | `(value: string) => void` | - | Change handler |
| `name` | `string` | - | Form field name |
| `disabled` | `boolean` | `false` | Disable all options |
| `size` | `"sm" \| "md" \| "lg"` | - | **Required.** Radio size |
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` | Layout direction |

**RadioOption Interface:**

```typescript
{
  label: string
  value: string
  helperText?: string
  disabled?: boolean
}
```

**Key Features:**
- Controlled or uncontrolled
- Individual option disable
- Helper text per option
- Keyboard navigation (Space/Enter)
- Focus rings
- Dark mode support

---

### MenuItem
**File:** `src/components/compound/MenuItem.tsx:16`

Popover menu item with icons and navigation.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | **Required.** Menu item text |
| `onClick` | `(e?: any) => void` | - | Click handler |
| `to` | `string` | - | React Router navigation path |
| `startIcon` | `keyof typeof LucideIcons` | - | Icon before text |
| `endIcon` | `keyof typeof LucideIcons` | - | Icon after text |
| `disableClosePopoverOnClick` | `boolean` | `false` | Keep popover open after click |

**Key Features:**
- Auto-closes parent Popover on click
- React Router Link integration
- Lucide icon support
- Hover background effect
- Must be used inside Popover component

---

### Popover
**File:** `src/components/compound/Popover.tsx:22`

Dropdown overlay with flexible positioning (built on Radix UI).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `ReactNode` | - | **Required.** Element that opens popover |
| `children` | `ReactNode` | - | **Required.** Popover content |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Placement side |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment on side |
| `sideOffset` | `number` | `8` | Distance from trigger (px) |
| `alignOffset` | `number` | `0` | Offset along alignment axis |
| `heading` | `string` | - | Optional header text |
| `disablePortal` | `boolean` | `false` | Render in DOM tree (not portal) |
| `isOpen` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open state change handler |

**Key Features:**
- Radix UI Popover primitive
- Collision detection (stays on screen)
- Portal rendering by default
- Optional heading section
- Auto-focus prevention
- Controlled or uncontrolled

**Exports:** `PopoverClose` component

---

### Tooltip
**File:** `src/components/compound/Tooltip.tsx:19`

Hover tooltip with positioning and arrow indicator.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | **Required.** Element to wrap |
| `content` | `ReactNode` | - | **Required.** Tooltip content |
| `position` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Tooltip placement |
| `size` | `"sm" \| "md"` | `"md"` | Text size |
| `disabled` | `boolean` | `false` | Disable tooltip |
| `arrow` | `boolean` | `true` | Show arrow pointer |
| `maxWidth` | `number` | `250` | Max width in px |
| `offset` | `number` | `8` | Distance from element (px) |
| `contentClassName` | `string` | - | Tooltip content classes |

**Key Features:**
- CSS-based (no JS positioning libraries)
- Hover-triggered
- Arrow indicator
- Dark background with white text
- Opacity animation
- Four position options

---

### MediaPicker
**File:** `src/components/compound/media-picker/MediaPicker.tsx:16`

Full-featured image picker with gallery and upload.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | **Required.** Controls dialog |
| `close` | `() => void` | - | **Required.** Close handler |
| `acceptedFormats` | `string[]` | - | Allowed file types |
| `maxSizeMB` | `number` | - | Max file size |
| `multiple` | `boolean` | `false` | Allow multiple selection |
| `onError` | `(error: string) => void` | - | Error callback |
| `onMediaSelect` | `(media: FileResponse \| FileResponse[]) => void` | - | Selection callback |
| `onUploadComplete` | `(media: FileResponse[]) => void` | - | Upload callback |

**Key Features:**
- Gallery view of existing media
- File upload from device
- Folder organization
- Search functionality
- Multiple file selection
- File format/size validation
- Dialog wrapper (XL size)

---

### ImageComponent
**File:** `src/components/compound/ImageComponent.tsx:16`

Enhanced image with zoom, loading, error handling, and remove.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string \| File` | - | **Required.** Image source |
| `alt` | `string` | - | **Required.** Alt text |
| `disableZoom` | `boolean` | `false` | Disable click-to-zoom |
| `onRemove` | `() => void` | - | Remove button callback |
| `className` | `string` | - | Image element classes |
| `wrapperClassName` | `string` | - | Wrapper div classes |

**Key Features:**
- Loading shimmer effect
- Fallback image on error
- Click to zoom (full-screen)
- Hover overlay with maximize icon
- Optional remove button
- Handles File objects and URLs
- Lazy loading
- Backend URL prefix

---

### Spinner
**File:** `src/components/compound/spinner/Spinner.tsx:10`

Animated loading spinner.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `16` | Size in pixels |
| `className` | `string` | - | Additional classes |

**Key Features:**
- SVG-based circular spinner
- CSS animation
- Customizable size
- Dark mode support

---

### ActiveChip
**File:** `src/components/compound/ActiveChip.tsx`

Readonly status chip showing "True" (green) or "False" (red).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isActive` | `boolean` | - | **Required.** Active status |

**Key Features:**
- Green for true, red for false
- Rounded chip design
- Dark mode support

---

### ActiveIndicator
**File:** `src/components/compound/ActiveIndicator.tsx`

Toggle button group for True/False states.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isActive` | `boolean` | - | **Required.** Current state |
| `label` | `string` | - | Optional label text |
| `required` | `boolean` | `false` | Show required asterisk |
| `readonly` | `boolean` | - | **Required.** Read-only or editable |
| `onChange` | `(value: boolean) => void` | - | Change handler (required if not readonly) |

**Key Features:**
- Two-button toggle (True/False)
- Green for True, red for False
- Readonly mode (no onChange)
- Optional label with required indicator
- Dark mode support

---

### Avatar
**File:** `src/components/compound/Avatar.tsx`

Circular user avatar with fallback initials.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `string` | - | Avatar image URL |
| `fallback` | `string` | - | **Required.** Fallback text (usually initials) |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Avatar size |
| `classname` | `string` | - | Additional classes |

**Sizes:** sm(28px), md(32px), lg(40px), xl(48px)

**Key Features:**
- Circular design
- Image or text fallback
- Uppercase text transform
- Dark mode support

---

### Breadcrumbs
**File:** `src/components/compound/Breadcrumbs.tsx`

Navigation breadcrumb trail.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `breadcrumbs` | `BreadcrumbItem[]` | - | **Required.** Breadcrumb items |
| `className` | `string` | - | Wrapper classes |

**BreadcrumbItem:**

```typescript
{
  label: string
  to: string
}
```

**Key Features:**
- React Router Link integration
- ChevronRight separators
- Last item styled as active
- Hover effects on links
- Dark mode support

---

### Collapsible
**File:** `src/components/compound/Collapsible.tsx`

Generic collapsible wrapper with custom trigger.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `ReactNode` | - | **Required.** Click element to toggle |
| `children` | `ReactNode` | - | **Required.** Collapsible content |
| `defaultOpen` | `boolean` | `false` | Initial expanded state |
| `classname` | `string` | - | Wrapper classes |
| `bodyClassname` | `string` | - | Content wrapper classes |

**Key Features:**
- Custom trigger element
- Smooth height transition
- Uncontrolled state

---

### Container
**File:** `src/components/compound/Container.tsx`

Card-like container with extensive collapse options.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | **Required.** Container title |
| `subtitle` | `string` | - | Optional subtitle |
| `children` | `ReactNode` | - | **Required.** Container content |
| `isCollapsible` | `boolean` | `false` | Enable collapse |
| `defaultOpen` | `boolean` | `false` | Initial state (uncontrolled) |
| `isOpen` | `boolean` | - | Controlled open state |
| `toggle` | `() => void` | - | Controlled toggle handler |
| `dynamicHeight` | `boolean` | `false` | Animate to actual height |
| `className` | `string` | - | Wrapper classes |
| `headClassName` | `string` | - | Header classes |
| `bodyClassName` | `string` | - | Body classes |

**Key Features:**
- Controlled or uncontrolled collapse
- Title and subtitle
- Divider between sections
- Dynamic or fixed height animation
- Chevron icon indicator

---

### CustomToast
**File:** `src/components/compound/CustomToast.tsx`

Toast notification with type-based styling.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"success" \| "error" \| "warning" \| "info" \| "default"` | - | **Required.** Toast type |
| `message` | `string` | - | **Required.** Main message |
| `description` | `string` | - | Optional detail text |
| `onClose` | `() => void` | - | **Required.** Close handler |
| `allowDismiss` | `boolean` | `true` | Show X button |
| `showIcons` | `boolean` | `true` | Show type icon |

**Key Features:**
- Five type variants with distinct colors
- Type icons (check, X, alert triangle, info)
- Optional dismiss button
- Rounded border design
- Dark mode support

---

### ImageZoomDialog
**File:** `src/components/compound/ImageZoomDialog.tsx`

Full-screen image zoom overlay.

**Props:** None (controlled via Zustand store)

**Key Features:**
- Full-screen backdrop
- Centered image (max 90vw x 90vh)
- Click to close
- Portal rendering
- Zoom-out cursor
- Controlled by `useImageZoomStore()`

---

### ListItem
**File:** `src/components/compound/ListItem.tsx`

Key-value pair display with optional icon.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | **Required.** Left label text |
| `value` | `ReactNode` | - | **Required.** Right value content |
| `startIcon` | `keyof typeof LucideIcons` | - | Icon before label |
| `iconClassName` | `string` | - | Icon classes |
| `classname` | `string` | - | Wrapper classes |

**Key Features:**
- Horizontal layout (label | value)
- Optional Lucide icon
- Dark mode support

---

### MultiSelectWithChips
**File:** `src/components/compound/MultiSelectWithChips.tsx`

Multi-select with chip display below.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | - | **Required.** Available options |
| `value` | `SelectOption[]` | - | **Required.** Selected options |
| `onChange` | `(value: SelectOption[]) => void` | - | **Required.** Change handler |
| `placeholder` | `string` | `"Select..."` | Placeholder text |
| `isLoading` | `boolean` | `false` | Loading state |
| `error` | `string` | - | Error message |

**Key Features:**
- Multi-select dropdown
- Selected chips below with X to remove
- Hidden input values in dropdown
- Loading and error states
- Based on Select component

---

### NoDataFound
**File:** `src/components/compound/NoDataFound.tsx`

Empty state with illustration and actions.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `svgComp` | `ReactNode` | - | Custom SVG illustration |
| `title` | `string` | - | **Required.** Empty state title |
| `description` | `string` | - | Optional description |
| `actions` | `ReactNode` | - | Action buttons |

**Key Features:**
- Default illustration
- Centered layout
- Title and description
- Action button area
- Dark mode support

---

### NoSearchResult
**File:** `src/components/compound/NoSearchResult.tsx`

Empty search result state.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | `"No results found"` | Custom message |
| `classname` | `string` | - | Wrapper classes |

**Key Features:**
- Animated search illustration
- Light and dark mode SVGs
- Custom message support
- Responsive max-width

---

### ToggleButtonGroup
**File:** `src/components/compound/ToggleButtonGroup.tsx`

Button group with animated highlight.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttonList` | `ToggleButtonListItem[]` | - | **Required.** Button options |
| `selected` | `ToggleButtonListItem` | - | **Required.** Active button |
| `onChange` | `(value: ToggleButtonListItem) => void` | - | **Required.** Change handler |
| `fullWidth` | `boolean` | `false` | Expand to full width |
| `containerClassname` | `string` | - | Wrapper classes |
| `buttonClassname` | `string` | - | Button classes |

**ToggleButtonListItem:**

```typescript
{
  label: string
  value: string
}
```

**Key Features:**
- Animated sliding highlight
- Smooth transitions
- Multiple button options
- Calculated position using refs

---

### UploadImagePlaceholder
**File:** `src/components/compound/UploadImagePlaceHolder.tsx`

Dashed placeholder for image upload.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClick` | `() => void` | - | **Required.** Click handler |
| `customIcon` | `ReactNode` | - | Custom icon (default: Image) |
| `classname` | `string` | - | Wrapper classes |

**Key Features:**
- Dashed border
- Image icon with "Select Photo" text
- Hover effect
- Fixed height (h-32)

---

### VegIndicator
**File:** `src/components/compound/VegIndicator.tsx`

Food type indicator (vegetarian/non-vegetarian).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"veg" \| "non-veg"` | - | **Required.** Food type |

**Key Features:**
- Green dot for "veg"
- Red triangle for "non-veg"
- Type-specific colors
- Rounded badge design

---

### Sonner (Toast)
**File:** `src/components/compound/Sonner.tsx`

Toast notification utility.

**API:**

```typescript
toast.success(message, { description? })
toast.error(message, { description? })
toast.warning(message, { description? })
toast.info(message, { description? })
toast.default(message, { description? })
```

**Key Features:**
- Wraps Sonner library
- Uses CustomToast for rendering
- Five toast types
- Optional description

---

### AppLoader
**File:** `src/components/compound/empty-states/AppLoader.tsx`

Full-screen animated loading screen.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isLoading` | `boolean` | - | **Required.** Loading state |

**Key Features:**
- Bike icon with glow effects
- Animated speed streaks
- "Foodboss" branding
- Food emoji wave animation
- Fade-out exit animation
- Gradient overlay

---

### GlobalNotFound
**File:** `src/components/compound/empty-states/GlobalNotFound.tsx`

Full-screen 404 page.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | `"Page not found"` | Custom message |

**Key Features:**
- 404 illustration
- "Go to Dashboard" button
- Light/dark mode variants
- Centered layout

---

### NotFound
**File:** `src/components/compound/empty-states/NotFound.tsx`

Generic not found component.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Not Found"` | Title text |
| `subTitle` | `string` | - | Subtitle text |
| `footer` | `ReactNode` | - | Custom footer |
| `size` | `number` | `200` | SVG size (px) |

**Key Features:**
- Customizable title/subtitle
- Optional footer area
- "Go to Dashboard" button
- Light/dark mode SVG
- Responsive size

**Exports:** `Graphic`, `DarkGraphic` SVG components

---

## Common Form Fields

Specialized form inputs composed from base components.

### AmountTypeInput
**File:** `src/components/common-form-fields/AmountWithTypeInput.tsx:20`

Combined input for amount with type selector (¹ or %).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `control` | `any` | - | **Required.** react-hook-form control |
| `name` | `string` | - | **Required.** Field name for amount |
| `typeName` | `string` | - | **Required.** Field name for type |
| `label` | `string` | - | Input label |
| `required` | `boolean` | `false` | Required indicator |
| `error` | `string` | - | Error message |

**Key Features:**
- Number input with right-aligned type selector
- Two type options: Fixed (¹) or Percentage (%)
- react-hook-form Controller integration
- Displays symbol in select (¹ or %)
- Full label in dropdown (Fixed, Percentage)

---

## Shared/Layout Components

Application-level layout and navigation components.

### Header
**File:** `src/components/shared/Header.tsx`

Top navigation bar.

**Props:** None

**Key Features:**
- Dynamic page title from route config
- Conditional back button
- Bell icon notification popover
- Profile avatar popover
- Logout dialog integration
- Dark mode support

---

### Sidebar
**File:** `src/components/shared/sidebar/Sidebar.tsx`

Collapsible navigation sidebar.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `navItems` | `NavItemTypes[]` | - | **Required.** Navigation items |

**Key Features:**
- Collapsible (64px ” 256px)
- State persisted in localStorage
- Auto-expand active parent
- Collapse toggle button
- "FB" brand logo
- Recursive NavItem rendering

---

### NavItem
**File:** `src/components/shared/sidebar/NavItem.tsx`

Recursive navigation item.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `item` | `NavItemTypes` | - | **Required.** Nav item config |
| `isSidebarCollapsed` | `boolean` | - | **Required.** Sidebar state |
| `isExpanded` | `boolean` | - | **Required.** Item expanded state |
| `onClick` | `() => void` | - | **Required.** Click handler |

**NavItemTypes:**

```typescript
{
  label: string
  icon?: keyof typeof LucideIcons
} & (
  | { path: string; children?: NavItemTypes[] }
  | { children?: NavItemTypes[] }
)
```

**Key Features:**
- Support for links and parent items
- Active state detection
- Lucide icon support
- Chevron for parent items
- Smooth expand/collapse
- Active parent dot (when collapsed)
- Recursive for nested items

---

### LogoutDialog
**File:** `src/components/shared/LogoutDialog.tsx`

Logout confirmation dialog.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | **Required.** Dialog state |
| `close` | `() => void` | - | **Required.** Close handler |

**Key Features:**
- Two options: current device or all devices
- Loading states
- Navigation to login after logout
- Built on Dialog component

---

### NotificationPopover
**File:** `src/components/shared/NotificationPopover.tsx`

Notification list popover.

**Props:** None

**Key Features:**
- MenuItem list
- "View All" button
- Sample notifications (hardcoded)

---

### ProfilePopover
**File:** `src/components/shared/ProfilePopover.tsx`

User profile menu popover.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onLogoutClick` | `() => void` | - | **Required.** Logout handler |

**Key Features:**
- User avatar with fallback
- User name display
- Loading skeleton
- Menu items (Account, Sign Out)

---

## Icons & Utilities

### WindowsFileIcon
**File:** `src/components/icons/icons.tsx`

Windows-style folder icon SVG.

**Export:**

```typescript
export const WindowsFileIcon: React.FC
```

**Key Features:**
- Yellow/gold folder icon
- Gradient fills
- Responsive sizing

---

### getButtonColor
**File:** `src/components/utils/getButtonColor.ts`

Button styling utility function.

**Export:**

```typescript
export function getColorClasses(
  variant?: ButtonVariant,
  color?: ButtonColor
): string
```

**Parameters:**
- `variant`: `"filled" | "outline" | "ghost" | "link"`
- `color`: `"primary" | "neutral" | "success" | "danger"`

**Returns:** Tailwind CSS class string

**Key Features:**
- 4 color themes × 4 variants = 16 combinations
- Dark mode support
- Hover and active states
- Used by Button component

---

## Usage Patterns

### Form Handling

Most form inputs integrate with react-hook-form:

```typescript
import { useForm, Controller } from "react-hook-form";
import { Input, Select } from "@/components/base";

const { control, handleSubmit } = useForm();

<Controller
  name="fieldName"
  control={control}
  render={({ field, fieldState }) => (
    <Input
      {...field}
      error={fieldState.error?.message}
      label="Field Label"
    />
  )}
/>
```

### Dialog Pattern

```typescript
import Dialog from "@/components/compound/Dialog";
import { useToggle } from "@/hooks/useToggle";

const { isOpen, open, close } = useToggle();

<Dialog
  isOpen={isOpen}
  close={close}
  title="Dialog Title"
  actions={{
    primary: { label: "Save", onClick: handleSave },
    secondary: { label: "Cancel", onClick: close }
  }}
>
  {/* content */}
</Dialog>
```

### Toast Notifications

```typescript
import { toast } from "@/components/compound/Sonner";

toast.success("Saved successfully!");
toast.error("Failed to save", { description: "Please try again" });
```

### Image with Zoom

```typescript
import ImageComponent from "@/components/compound/ImageComponent";

<ImageComponent
  src="/path/to/image.jpg"
  alt="Description"
  disableZoom={false}
/>
```

---

## Related Resources

- **CLAUDE.md** - Project architecture and patterns
- **src/types/** - TypeScript type definitions
- **src/hooks/** - Custom React hooks (useToggle, useDataFetch, etc.)
- **Tailwind CSS v4** - Styling system
- **Lucide React** - Icon library
- **Radix UI** - Headless UI primitives (Popover)
- **React Select** - Advanced select component
- **Sonner** - Toast notifications
