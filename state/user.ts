import { atom } from "recoil";
import { IUser } from "../types/user";

const userAtom = atom<IUser | null>({
  key: "userAtom",
  default: null,
});

export default userAtom;
