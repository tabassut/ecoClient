type SearchLocationOption = {
  id: number;
  label: string;
  value: string;
  lat: number;
  lng: number;
};

export const mapSearchLocationOptions = (
  data: any[] | undefined,
): SearchLocationOption[] => {
  if (!data) return [];

  return data.map((item) => ({
    id: item.place_id,
    label: item.display_name,
    value: item.display_name,
    lat: Number(item.lat),
    lng: Number(item.lon),
  }));
};
