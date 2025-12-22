import { Button } from "@/components/base/Button";
import ErrorText from "@/components/base/ErrorText";
import {
  AddressPickerDialog,
  type ParsedAddress,
} from "@/components/compound/address-picker";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/utils/helpers";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MapPin, Pencil } from "lucide-react";
import { useMemo, type FC } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface Props {
  lat: number;
  long: number;
  line1: string;
  line2: string;
  area: string;
  city: string;
  county: string;
  country: string;
  zip: string;
  onLocationChange: (address: ParsedAddress) => void;
  error?: string;
}

const StoreLocationPicker: FC<Props> = ({
  lat,
  long,
  line1,
  line2,
  area,
  city,
  county,
  country,
  zip,
  onLocationChange,
  error,
}) => {
  const { isOpen, open, close } = useToggle();

  const hasLocation = lat !== 0 && long !== 0;
  const addressSummary = [line1, area, city, zip].filter(Boolean).join(", ");

  // Build full address object to pass to dialog
  const currentAddress = useMemo<ParsedAddress | null>(() => {
    if (!hasLocation) return null;
    return {
      lat,
      long,
      line1,
      line2,
      area,
      city,
      county,
      country,
      zip,
      formattedAddress: addressSummary,
    };
  }, [
    lat,
    long,
    line1,
    line2,
    area,
    city,
    county,
    country,
    zip,
    hasLocation,
    addressSummary,
  ]);

  return (
    <div className="space-y-2">
      {/* <Label required>Store Location</Label> */}

      <div
        className={cn(
          "relative overflow-hidden rounded-lg border-2 transition-colors",
          error
            ? "border-dl-500"
            : "border-nl-200 hover:border-nl-300 dark:border-nd-600",
        )}
      >
        {/* Mini map preview */}
        <div className="bg-nl-100 dark:bg-nd-700 relative h-40 w-full">
          {hasLocation ? (
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <Map
                center={{ lat, lng: long }}
                zoom={15}
                gestureHandling="none"
                disableDefaultUI
                clickableIcons={false}
                className="h-full w-full"
              />
              {/* Center marker indicator */}
              <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <MapPin
                  className="text-pl-600 drop-shadow-lg"
                  size={32}
                  fill="currentColor"
                />
              </div>
            </APIProvider>
          ) : (
            <div className="text-nl-500 dark:text-nd-400 flex h-full flex-col items-center justify-center gap-2">
              <MapPin size={32} />
              <span className="text-sm">No location selected</span>
            </div>
          )}
        </div>

        {/* Address info and button */}
        <div className="flex items-center justify-between gap-4 p-3">
          <div className="min-w-0 flex-1">
            {hasLocation ? (
              <>
                <p className="text-nl-800 dark:text-nd-100 truncate font-medium">
                  {addressSummary || "Location selected"}
                </p>
                <p className="text-nl-500 dark:text-nd-400 text-sm">
                  {lat.toFixed(6)}, {long.toFixed(6)}
                </p>
              </>
            ) : (
              <p className="text-nl-500 dark:text-nd-400">
                Click to set store location
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={open}
            startIcon={
              hasLocation ? <Pencil size={14} /> : <MapPin size={14} />
            }
          >
            {hasLocation ? "Change" : "Set Location"}
          </Button>
        </div>
      </div>

      {error && <ErrorText>{error}</ErrorText>}

      {/* Address Picker Dialog */}
      <AddressPickerDialog
        isOpen={isOpen}
        onClose={close}
        onConfirm={onLocationChange}
        initialAddress={currentAddress}
      />
    </div>
  );
};

export default StoreLocationPicker;
