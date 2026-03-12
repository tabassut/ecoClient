import { create } from "zustand";
import { createAppSlice, type IAppSlice } from "./slices/appSlice";

import {
  createMapLocationSlice,
  type IMapLocationStore,
} from "./slices/mapSlice";

export type StoreState = IAppSlice & IMapLocationStore;

export const useStore = create<StoreState>()((...args) => ({
  ...createAppSlice(...args),
  ...createMapLocationSlice(...args),
}));
