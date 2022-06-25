import { useRef } from "react";
import ReactPlayer from "react-player";

export default function usePlayerRef() {
  const playerRef = useRef<ReactPlayer | null>(null);

  return playerRef;
}
