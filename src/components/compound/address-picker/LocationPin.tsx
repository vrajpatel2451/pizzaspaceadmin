import { MapPin } from "lucide-react";

// This pin is CSS-positioned on top of the map, not a Google Maps marker
// The pin stays fixed while the map drags underneath
const LocationPin = () => {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
      <div className="relative">
        <MapPin
          className="text-pl-600 dark:text-pd-400 drop-shadow-lg"
          size={40}
          fill="currentColor"
          strokeWidth={1.5}
        />
        {/* Pin shadow dot */}
        <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-black/20" />
      </div>
    </div>
  );
};

export default LocationPin;
