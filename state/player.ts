import { atom } from "recoil";
import { IPlayer } from "../types/player";

const playerAtom = atom<IPlayer | null>({
  key: "playerAtom",
  default: null,
});

export const playerFullscreenAtom = atom({
  key: "playerFullscreen",
  default: false,
});

export const playlistsPromptAtom = atom({
  key: "playlistsPromptAtom",
  default: false,
});

export default playerAtom;
