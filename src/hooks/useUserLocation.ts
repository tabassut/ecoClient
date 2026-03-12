import { useEffect, useState } from "react";
import type { LatLngTuple } from "leaflet";

export function useUserLocation(defaultLocation: LatLngTuple) {
  const [location, setLocation] = useState<LatLngTuple>(defaultLocation);
  const [loading, setLoading] = useState<boolean>(!!navigator.geolocation);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setLoading(false);
      },
      () => {
        // permission denied / error
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }, []);

  return { location, loading };
}
