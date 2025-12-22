import type { ParsedAddress } from "./types";

// Parse Google Geocoding result to our address format
export const parseGeocodingResult = (
  result: google.maps.GeocoderResult,
): ParsedAddress => {
  const components = result.address_components;
  const location = result.geometry.location;

  const getComponent = (types: string[]): string => {
    const component = components.find((c) =>
      types.some((type) => c.types.includes(type)),
    );
    return component?.long_name || "";
  };

  const streetNumber = getComponent(["street_number"]);
  const route = getComponent(["route"]);

  return {
    line1: [streetNumber, route].filter(Boolean).join(" "),
    line2: "", // Manual entry (floor/unit)
    area: getComponent(["sublocality", "sublocality_level_1", "neighborhood"]),
    city: getComponent(["locality", "postal_town"]),
    county: getComponent(["administrative_area_level_2"]),
    country: getComponent(["country"]),
    zip: getComponent(["postal_code"]),
    lat: location.lat(),
    long: location.lng(),
    formattedAddress: result.formatted_address,
  };
};

// UK default center (London)
export const DEFAULT_CENTER = { lat: 51.5074, lng: -0.1278 };
export const DEFAULT_ZOOM = 15;
