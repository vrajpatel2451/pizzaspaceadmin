import Dialog from "@/components/compound/Dialog";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import AddressFormStep from "./AddressFormStep";
import MapWithSearchStep from "./MapWithSearchStep";
import type { AddressPickerDialogProps, ParsedAddress } from "./types";
import { DEFAULT_CENTER } from "./utils";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

type Step = "map" | "form";

// Check if address has valid data
const hasValidAddress = (address?: ParsedAddress | null): address is ParsedAddress => {
  return !!(address && address.lat !== 0 && address.long !== 0);
};

const AddressPickerDialog = ({
  isOpen,
  onClose,
  onConfirm,
  initialAddress,
}: AddressPickerDialogProps) => {
  const [step, setStep] = useState<Step>("map");
  const [currentAddress, setCurrentAddress] = useState<ParsedAddress | null>(null);

  // Determine initial center for map
  const initialCenter = hasValidAddress(initialAddress)
    ? { lat: initialAddress.lat, lng: initialAddress.long }
    : DEFAULT_CENTER;

  // When dialog opens: if address exists -> Step 2, else -> Step 1
  useEffect(() => {
    if (isOpen) {
      if (hasValidAddress(initialAddress)) {
        setCurrentAddress(initialAddress);
        setStep("form");
      } else {
        setCurrentAddress(null);
        setStep("map");
      }
    }
  }, [isOpen, initialAddress]);

  // Step 1: User confirms location on map -> go to Step 2
  const handleLocationConfirm = useCallback((address: ParsedAddress) => {
    setCurrentAddress(address);
    setStep("form");
  }, []);

  // Step 2: User wants to change location -> go back to Step 1
  const handleChangeLocation = useCallback(() => {
    setStep("map");
  }, []);

  // Step 2: User saves final address
  const handleFinalConfirm = useCallback(
    (address: ParsedAddress) => {
      onConfirm(address);
      onClose();
    },
    [onConfirm, onClose],
  );

  const title = step === "map" ? "Select Location" : "Confirm Address";
  const subTitle = step === "map"
    ? "Search or drag the map to set your store location"
    : "Review and edit your address details";

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title={title}
      subTitle={subTitle}
      size="md"
    >
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={["places", "geocoding"]}>
        {step === "map" && (
          <MapWithSearchStep
            initialCenter={currentAddress ? { lat: currentAddress.lat, lng: currentAddress.long } : initialCenter}
            onLocationConfirm={handleLocationConfirm}
          />
        )}
        {step === "form" && currentAddress && (
          <AddressFormStep
            address={currentAddress}
            onChangeLocation={handleChangeLocation}
            onConfirm={handleFinalConfirm}
          />
        )}
      </APIProvider>
    </Dialog>
  );
};

export default AddressPickerDialog;
