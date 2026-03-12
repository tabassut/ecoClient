import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";

export const RecenterMap = ({
  position,
  zoom = 13,
}: {
  position: LatLngTuple;
  zoom?: number;
}) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, zoom, {
      animate: true,
      duration: 1,
    });
  }, [position, zoom, map]);

  return null;
};
