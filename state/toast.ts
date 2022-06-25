import { atom } from "recoil";
import { IToast } from "../types/toast";

const toastAtom = atom<IToast | null>({
  key: "toatAtom",
  default: null,
});

export default toastAtom;
