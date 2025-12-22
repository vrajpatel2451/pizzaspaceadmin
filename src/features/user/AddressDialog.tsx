import { Button } from "@/components/base/Button";
import { Checkbox } from "@/components/base/Checkbox";
import { Input } from "@/components/base/Input";
import Select from "@/components/base/Select";
import type { ParsedAddress } from "@/components/compound/address-picker";
import MapWithSearchStep from "@/components/compound/address-picker/MapWithSearchStep";
import { DEFAULT_CENTER } from "@/components/compound/address-picker/utils";
import Dialog from "@/components/compound/Dialog";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { addressApiService } from "@/infrastructure/AddressApiService";
import type { AddressResponse, UserAddressType } from "@/types/user.types";
import { APIProvider } from "@vis.gl/react-google-maps";
import { MapPin, Save } from "lucide-react";
import { useCallback, useState, type FC } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

type Step = "map" | "form";

type Props = {
  userId: string;
  onSave: (address: AddressResponse) => void;
  isOpen: boolean;
  onClose: () => void;
};

interface FormErrors {
  name?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  area?: string;
  county?: string;
  country?: string;
  zip?: string;
  type?: string;
}

const addressTypeOptions = [
  { label: "Home", value: "home" },
  { label: "Work", value: "work" },
  { label: "Other", value: "other" },
];

const AddressDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, userId } = props;

  // Stepper state
  const [step, setStep] = useState<Step>("map");
  const [locationData, setLocationData] = useState<ParsedAddress | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [area, setArea] = useState("");
  const [county, setCounty] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [addressType, setAddressType] = useState<UserAddressType>("home");
  const [otherAddressLabel, setOtherAddressLabel] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  // Reset form when dialog closes
  const handleClose = useCallback(() => {
    setStep("map");
    setLocationData(null);
    setName("");
    setPhone("");
    setLine1("");
    setLine2("");
    setArea("");
    setCounty("");
    setCountry("");
    setZip("");
    setAddressType("home");
    setOtherAddressLabel("");
    setIsDefault(false);
    setErrors({});
    onClose();
  }, [onClose]);

  // Step 1 → Step 2: Location confirmed
  const handleLocationConfirm = useCallback((address: ParsedAddress) => {
    setLocationData(address);
    setLine1(address.line1);
    setLine2(address.line2);
    setArea(address.area || address.city);
    setCounty(address.county);
    setCountry(address.country);
    setZip(address.zip);
    setStep("form");
  }, []);

  // Step 2 → Step 1: Change location
  const handleChangeLocation = useCallback(() => {
    setStep("map");
  }, []);

  // Check if field was empty from geocoding (editable)
  const isFieldEditable = useCallback(
    (field: keyof ParsedAddress) => {
      if (!locationData) return true;
      const value = locationData[field];
      return !value || (typeof value === "string" && value.trim() === "");
    },
    [locationData],
  );

  // UK phone validation - only digits, exactly 11
  const validateUKPhone = (phoneNumber: string): boolean => {
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    return digitsOnly.length === 11;
  };

  // Validation
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = "Contact name is required";
    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!validateUKPhone(phone)) {
      newErrors.phone = "UK phone number must be 11 digits";
    }
    if (!line1.trim()) newErrors.line1 = "Address line 1 is required";
    if (!line2.trim()) newErrors.line2 = "Address line 2 is required";
    if (!area.trim()) newErrors.area = "Area is required";
    if (!county.trim()) newErrors.county = "County is required";
    if (!country.trim()) newErrors.country = "Country is required";
    if (!zip.trim()) newErrors.zip = "Postcode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, phone, line1, line2, area, county, country, zip]);

  // Submit form
  const handleSubmit = useCallback(async () => {
    if (!validate() || !locationData) return;

    startSaving();

    const payload = {
      name,
      phone,
      line1,
      line2,
      area,
      county,
      country,
      zip,
      lat: locationData.lat,
      long: locationData.long,
      type: addressType,
      otherAddressLabel:
        addressType === "other" ? otherAddressLabel : undefined,
      isDefault,
    };

    const { success, errorMessage, data } =
      await addressApiService.createAddress(payload, userId);

    if (success) {
      onSave(data);
      toast.success("Address created successfully");
      handleClose();
    } else {
      toast.error(errorMessage);
    }

    stopSaving();
  }, [
    validate,
    locationData,
    name,
    phone,
    line1,
    line2,
    area,
    county,
    country,
    zip,
    addressType,
    otherAddressLabel,
    isDefault,
    userId,
    onSave,
    handleClose,
    startSaving,
    stopSaving,
  ]);

  const title = step === "map" ? "Select Location" : "Address Details";
  const subTitle =
    step === "map"
      ? "Search or drag the map to set the delivery location"
      : "Review and complete address details";

  return (
    <Dialog
      isOpen={isOpen}
      close={handleClose}
      title={title}
      subTitle={subTitle}
      size="md"
    >
      <APIProvider
        apiKey={GOOGLE_MAPS_API_KEY}
        libraries={["places", "geocoding"]}
      >
        {step === "map" && (
          <MapWithSearchStep
            initialCenter={DEFAULT_CENTER}
            onLocationConfirm={handleLocationConfirm}
          />
        )}

        {step === "form" && locationData && (
          <div className="flex max-h-[70vh] flex-col">
            {/* Location summary with change button - Sticky top */}
            <div className="dark:bg-nd-800 sticky top-0 z-10 bg-white pb-4">
              <div className="bg-nl-50 dark:bg-nd-700 flex items-start justify-between gap-4 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-pl-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-nl-800 dark:text-nd-100 font-medium">
                      {locationData.formattedAddress}
                    </p>
                    <p className="text-nl-500 dark:text-nd-400 mt-1 text-sm">
                      {locationData.lat.toFixed(6)},{" "}
                      {locationData.long.toFixed(6)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleChangeLocation}
                >
                  Change
                </Button>
              </div>
            </div>

            {/* Scrollable form content */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-nl-700 dark:text-nd-200 text-sm font-medium">
                  Contact Information
                </h4>
                <Input
                  label="Contact Name"
                  placeholder="Enter contact name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  required
                />
                <Input
                  label="Phone"
                  placeholder="Enter UK phone number (11 digits)"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                  required
                  maxLength={11}
                />
              </div>

              {/* Address fields */}
              <div className="space-y-4">
                <h4 className="text-nl-700 dark:text-nd-200 text-sm font-medium">
                  Address Details
                </h4>
                <Input
                  label="Address Line 1"
                  placeholder="Street address"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  error={errors.line1}
                  required
                  disabled={!isFieldEditable("line1")}
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
                    disabled={
                      !isFieldEditable("area") && !isFieldEditable("city")
                    }
                  />

                  <Input
                    label="County"
                    placeholder="County"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    error={errors.county}
                    required
                    disabled={!isFieldEditable("county")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Country"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    error={errors.country}
                    required
                    disabled={!isFieldEditable("country")}
                  />

                  <Input
                    label="Postcode"
                    placeholder="Postcode"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    error={errors.zip}
                    required
                    disabled={!isFieldEditable("zip")}
                  />
                </div>
              </div>

              {/* Address Type */}
              <div className="space-y-4">
                <h4 className="text-nl-700 dark:text-nd-200 text-sm font-medium">
                  Address Type
                </h4>
                <Select
                  label="Type"
                  required
                  options={addressTypeOptions}
                  value={addressTypeOptions.find(
                    (opt) => opt.value === addressType,
                  )}
                  onChange={(option) => {
                    const val = option as { value: string } | null;
                    setAddressType((val?.value as UserAddressType) || "home");
                  }}
                  error={errors.type}
                />

                {addressType === "other" && (
                  <Input
                    label="Custom Label"
                    placeholder="Enter custom label (e.g., Office, Gym)"
                    value={otherAddressLabel}
                    onChange={(e) => setOtherAddressLabel(e.target.value)}
                  />
                )}

                <Checkbox
                  label="Set as default address"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                />
              </div>
            </div>

            {/* Save button - Sticky bottom */}
            <div className="dark:bg-nd-800 sticky bottom-0 z-10 bg-white pt-4">
              <Button
                type="button"
                onClick={handleSubmit}
                isLoading={isSaving}
                startIcon={<Save className="text-white" size={18} />}
                className="w-full"
              >
                Save Address
              </Button>
            </div>
          </div>
        )}
      </APIProvider>
    </Dialog>
  );
};

export default AddressDialog;
