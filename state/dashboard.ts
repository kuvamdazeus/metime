import { atom } from "recoil";
import { IDashboardData } from "../types/dashboard";

export const dashboardAtom = atom<IDashboardData | null>({
  key: "dashboardAtom",
  default: null,
});
