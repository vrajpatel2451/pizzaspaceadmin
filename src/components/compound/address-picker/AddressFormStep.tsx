import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { MapPin } from "lucide-react";
import { useState } from "react";
import type { ParsedAddress } from "./types";

interface Props {
  address: ParsedAddress;
  onChangeLocation: () => void;
  onConfirm: (address: ParsedAddress) => void;
}

interface FormErrors {
  line1?: string;
  line2?: string;
  area?: string;
  city?: string;
  county?: string;
  country?: string;
  zip?: string;
}

const AddressFormStep = ({ address, onChangeLocation, onConfirm }: Props) => {
  // All fields are editable if they came empty from geocoding
  const [line1, setLine1] = useState(address.line1);
  const [line2, setLine2] = useState(address.line2);
  const [area, setArea] = useState(address.area);
  const [city, setCity] = useState(address.city);
  const [county, setCounty] = useState(address.county);
  const [country, setCountry] = useState(address.country);
  const [zip, setZip] = useState(address.zip);
  const [errors, setErrors] = useState<FormErrors>({});

  // Check which fields were empty from geocoding (these should be editable)
  const isFieldEditable = (originalValue: string) => !originalValue || originalValue.trim() === "";

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!line1.trim()) newErrors.line1 = "Address line 1 is required";
    if (!line2.trim()) newErrors.line2 = "Address line 2 is required";
    if (!area.trim()) newErrors.area = "Area is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!county.trim()) newErrors.county = "County is required";
    if (!country.trim()) newErrors.country = "Country is required";
    if (!zip.trim()) newErrors.zip = "Postcode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;

    onConfirm({
      ...address,
      line1,
      line2,
      area,
      city,
      county,
      country,
      zip,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Location summary with change button */}
      <div className="flex items-start justify-between gap-4 rounded-lg bg-nl-50 p-4 dark:bg-nd-700">
        <div className="flex items-start gap-3">
          <MapPin size={20} className="mt-0.5 shrink-0 text-pl-600" />
          <div>
            <p className="font-medium text-nl-800 dark:text-nd-100">
              {address.formattedAddress}
            </p>
            <p className="mt-1 text-sm text-nl-500 dark:text-nd-400">
              {address.lat.toFixed(6)}, {address.long.toFixed(6)}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onChangeLocation}
        >
          Change
        </Button>
      </div>

      {/* Address fields */}
      <div className="space-y-4">
        <Input
          label="Address Line 1"
          placeholder="Street address"
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          error={errors.line1}
          required
          disabled={!isFieldEditable(address.line1)}
        />

        <Input
          label="Address Line 2 (Floor / Unit / Building)"
          placeholder="e.g., Floor 2, Unit 5B"
          value={line2}
          onChange={(e) => setLine2(e.target.value)}
          error={errors.line2}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Area"
            placeholder="Area / Neighborhood"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            error={errors.area}
            required
            disabled={!isFieldEditable(address.area)}
          />

          <Input
            label="City"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={errors.city}
            required
            disabled={!isFieldEditable(address.city)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="County"
            placeholder="County"
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            error={errors.county}
            required
            disabled={!isFieldEditable(address.county)}
          />

          <Input
            label="Country"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            error={errors.country}
            required
            disabled={!isFieldEditable(address.country)}
          />
        </div>

        <Input
          label="Postcode"
          placeholder="Postcode"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          error={errors.zip}
          required
          disabled={!isFieldEditable(address.zip)}
        />
      </div>

      {/* Confirm button */}
      <button
        type="button"
        onClick={handleConfirm}
        className="w-full rounded-lg bg-pl-600 px-4 py-3 font-medium text-white transition-colors hover:bg-pl-700"
      >
        Save Address
      </button>
    </div>
  );
};

export default AddressFormStep;
