import { Button } from "@/components/base/Button";
import { LocateFixed } from "lucide-react";
import { useState } from "react";

interface Props {
  onLocationFound: (lat: number, lng: number) => void;
  onError: (message: string) => void;
}

const GpsButton = ({ onLocationFound, onError }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (!navigator.geolocation) {
      onError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationFound(position.coords.latitude, position.coords.longitude);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            onError("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            onError("Location unavailable");
            break;
          case error.TIMEOUT:
            onError("Location request timed out");
            break;
          default:
            onError("Unable to get location");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <Button
      type="button"
      variant="filled"
      color="neutral"
      size="sm"
      onClick={handleClick}
      isLoading={isLoading}
      startIcon={<LocateFixed size={16} />}
      className="shadow-md"
    >
      Use my location
    </Button>
  );
};

export default GpsButton;
