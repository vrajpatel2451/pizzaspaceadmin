import { Input } from "@/components/base/Input";
import { toast } from "@/components/compound/Sonner";
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Loader2, MapPin, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import GpsButton from "./GpsButton";
import LocationPin from "./LocationPin";
import type { ParsedAddress, PlacePrediction } from "./types";
import { DEFAULT_CENTER, DEFAULT_ZOOM, parseGeocodingResult } from "./utils";

interface Props {
  initialCenter: { lat: number; lng: number };
  onLocationConfirm: (address: ParsedAddress) => void;
}

const MapWithSearchStep = ({ initialCenter, onLocationConfirm }: Props) => {
  const map = useMap("address-picker-map");
  const placesLib = useMapsLibrary("places");
  const geocodingLib = useMapsLibrary("geocoding");

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<ParsedAddress | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLibraryReady, setIsLibraryReady] = useState(false);

  // Initialize services when libraries load
  useEffect(() => {
    if (placesLib && !autocompleteService.current) {
      autocompleteService.current = new placesLib.AutocompleteService();
      setIsLibraryReady(true);
      console.log("Places library loaded");
    }
  }, [placesLib]);

  useEffect(() => {
    if (geocodingLib && !geocoder.current) {
      geocoder.current = new geocodingLib.Geocoder();
      console.log("Geocoding library loaded");
    }
  }, [geocodingLib]);

  // Pan to initial center on mount
  useEffect(() => {
    if (map && initialCenter.lat !== 0 && initialCenter.lng !== 0) {
      map.panTo(initialCenter);
      reverseGeocode(initialCenter.lat, initialCenter.lng);
    }
  }, [map, initialCenter]);

  // Reverse geocode
  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!geocoder.current) {
      console.log("Geocoder not ready");
      return;
    }

    setIsGeocoding(true);
    geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
      setIsGeocoding(false);
      if (status === "OK" && results?.[0]) {
        const parsed = parseGeocodingResult(results[0]);
        setCurrentAddress(parsed);
      } else {
        console.log("Geocode failed:", status);
      }
    });
  }, []);

  // Handle map center change (debounced)
  const handleCenterChanged = useCallback(() => {
    if (!map) return;

    const center = map.getCenter();
    if (!center) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      reverseGeocode(center.lat(), center.lng());
    }, 500);
  }, [map, reverseGeocode]);

  // Search places
  const searchPlaces = useCallback(
    (input: string) => {
      console.log("Searching for:", input, "Service ready:", !!autocompleteService.current);

      if (!autocompleteService.current) {
        console.log("AutocompleteService not initialized");
        return;
      }

      if (input.length < 3) {
        setPredictions([]);
        return;
      }

      setIsSearching(true);

      autocompleteService.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "gb" },
        },
        (results, status) => {
          setIsSearching(false);
          console.log("Places API response:", status, results?.length);

          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const mapped = results.map((r) => ({
              placeId: r.place_id,
              mainText: r.structured_formatting.main_text,
              secondaryText: r.structured_formatting.secondary_text,
              description: r.description,
            }));
            setPredictions(mapped);
            setShowDropdown(true);
          } else {
            console.log("Places API error status:", status);
            setPredictions([]);
          }
        },
      );
    },
    [],
  );

  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length >= 3) {
      debounceRef.current = setTimeout(() => searchPlaces(value), 300);
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  // Handle place selection
  const handlePlaceSelect = useCallback(
    (placeId: string) => {
      if (!geocoder.current || !map) return;

      setShowDropdown(false);
      setQuery("");
      setPredictions([]);

      geocoder.current.geocode({ placeId }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const location = results[0].geometry.location;
          const parsed = parseGeocodingResult(results[0]);

          map.panTo({ lat: location.lat(), lng: location.lng() });
          setCurrentAddress(parsed);
        }
      });
    },
    [map],
  );

  // Handle GPS location
  const handleGpsLocation = useCallback(
    (lat: number, lng: number) => {
      if (map) {
        map.panTo({ lat, lng });
        reverseGeocode(lat, lng);
      }
    },
    [map, reverseGeocode],
  );

  // Handle confirm
  const handleConfirm = () => {
    if (currentAddress) {
      onLocationConfirm(currentAddress);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search input */}
      <div className="relative">
        <Input
          placeholder={isLibraryReady ? "Search address or postcode..." : "Loading Google Maps..."}
          value={query}
          onChange={handleSearchInput}
          onFocus={() => predictions.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          leftElement={
            isSearching ? (
              <Loader2 size={18} className="animate-spin text-nl-400" />
            ) : (
              <Search size={18} className="text-nl-400" />
            )
          }
          disabled={!isLibraryReady}
        />

        {/* Search dropdown */}
        {showDropdown && predictions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-nl-200 bg-white shadow-lg dark:border-nd-600 dark:bg-nd-800">
            {predictions.map((prediction) => (
              <button
                key={prediction.placeId}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePlaceSelect(prediction.placeId)}
                className="flex w-full items-start gap-3 border-b border-nl-100 px-4 py-2 text-left transition-colors last:border-b-0 hover:bg-nl-50 dark:border-nd-700 dark:hover:bg-nd-700"
              >
                <MapPin size={16} className="mt-0.5 shrink-0 text-nl-400" />
                <div>
                  <p className="text-sm font-medium text-nl-800 dark:text-nd-100">
                    {prediction.mainText}
                  </p>
                  <p className="text-xs text-nl-500 dark:text-nd-400">
                    {prediction.secondaryText}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map container */}
      <div className="relative h-64 w-full overflow-hidden rounded-lg border border-nl-200 dark:border-nd-600">
        <Map
          id="address-picker-map"
          defaultCenter={initialCenter.lat !== 0 ? initialCenter : DEFAULT_CENTER}
          defaultZoom={DEFAULT_ZOOM}
          gestureHandling="greedy"
          disableDefaultUI
          onCenterChanged={handleCenterChanged}
          className="h-full w-full"
        />

        {/* Fixed center pin */}
        <LocationPin />

        {/* GPS button */}
        <div className="absolute bottom-4 right-4 z-10">
          <GpsButton
            onLocationFound={handleGpsLocation}
            onError={(msg) => toast.error(msg)}
          />
        </div>
      </div>

      {/* Current address display */}
      <div className="rounded-lg bg-nl-50 p-4 dark:bg-nd-700">
        {isGeocoding ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-3/4 rounded bg-nl-200 dark:bg-nd-600" />
            <div className="h-3 w-1/2 rounded bg-nl-200 dark:bg-nd-600" />
          </div>
        ) : currentAddress ? (
          <>
            <p className="font-medium text-nl-800 dark:text-nd-100">
              {currentAddress.formattedAddress}
            </p>
            <p className="mt-1 text-sm text-nl-500 dark:text-nd-400">
              {currentAddress.lat.toFixed(6)}, {currentAddress.long.toFixed(6)}
            </p>
          </>
        ) : (
          <p className="text-sm text-nl-500 dark:text-nd-400">
            Drag the map or search to select a location
          </p>
        )}
      </div>

      {/* Confirm button */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!currentAddress}
        className="w-full rounded-lg bg-pl-600 px-4 py-3 font-medium text-white transition-colors hover:bg-pl-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Confirm Location
      </button>
    </div>
  );
};

export default MapWithSearchStep;
