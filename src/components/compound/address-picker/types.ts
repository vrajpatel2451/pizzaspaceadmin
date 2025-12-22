// Parsed address from Google Geocoding
export interface ParsedAddress {
  line1: string; // street_number + route
  line2: string; // subpremise (manual entry for floor/unit)
  area: string; // sublocality/neighborhood
  city: string; // locality
  county: string; // administrative_area_level_2
  country: string; // country
  zip: string; // postal_code
  lat: number; // geometry.location.lat
  long: number; // geometry.location.lng
  formattedAddress: string; // Full formatted address from Google
}

// Address picker dialog props
export interface AddressPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: ParsedAddress) => void;
  initialAddress?: ParsedAddress | null;
}

// Store location picker props (inline component)
export interface StoreLocationPickerProps {
  lat: number;
  long: number;
  line1: string;
  area: string;
  city: string;
  county: string;
  country: string;
  zip: string;
  onLocationChange: (address: ParsedAddress) => void;
  error?: string;
}

// Google place prediction type
export interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
}

// Dialog step type
export type AddressPickerStep = "search" | "map";
