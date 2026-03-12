
import type { StoreState } from "..";
import type { IMapLocationSlice } from "../slices/mapSlice";

export const selectSelectedLocation = (
  state: StoreState,
): IMapLocationSlice | null => state.selectedLocation;
