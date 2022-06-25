import { MutableRefObject } from "react";
import {
  MdForward10,
  MdForward30,
  MdOutlinePauseCircleFilled,
  MdOutlinePlayCircleFilled,
  MdReplay10,
  MdReplay30,
  MdSkipNext,
  MdSkipPrevious,
} from "react-icons/md";
import ReactPlayer from "react-player";
import { useRecoilState } from "recoil";
import playerAtom from "../state/player";
import { playNextTrackInQueue, playPreviousTrackInQueue } from "../utils/player";

export default function MiniPlayerButton({ playerRef }: { playerRef: MutableRefObject<ReactPlayer | null> }) {
  const [playerData, setPlayerData] = useRecoilState(playerAtom);

  return (
    <div className="flex justify-center items-center text-white">
      <MdSkipPrevious
        onClick={() => playPreviousTrackInQueue({ playerData, setPlayerData })}
        className="mx-1 text-[30px] cursor-pointer opacity-75 hover:opacity-100"
      />
      <MdReplay30
        onClick={() => playerRef.current?.seekTo((playerRef.current as ReactPlayer).getCurrentTime() - 30)}
        className="mx-1 text-[30px] cursor-pointer opacity-75 hover:opacity-100"
      />
      <MdReplay10
        onClick={() => playerRef.current?.seekTo((playerRef.current as ReactPlayer).getCurrentTime() - 10)}
        className="mx-1 text-[30px] cursor-pointer opacity-75 hover:opacity-100"
      />

      {!playerData?.playing ? (
        <MdOutlinePlayCircleFilled
          onClick={() => playerData && setPlayerData({ ...playerData, playing: !playerData.playing })}
          className="mx-2 text-[52px] cursor-pointer"
        />
      ) : (
        <MdOutlinePauseCircleFilled
          onClick={() => playerData && setPlayerData({ ...playerData, playing: !playerData.playing })}
          className="mx-2 text-[52px] cursor-pointer opacity-75 hover:opacity-100"
        />
      )}

      <MdForward10
        onClick={() => playerRef.current?.seekTo((playerRef.current as ReactPlayer).getCurrentTime() + 10)}
        className="mx-1 text-[30px] cursor-pointer opacity-75 hover:opacity-100"
      />
      <MdForward30
        onClick={() => playerRef.current?.seekTo((playerRef.current as ReactPlayer).getCurrentTime() + 30)}
        className="mx-1 text-[30px] cursor-pointer opacity-75 hover:opacity-100"
      />
      <MdSkipNext
        onClick={() => playNextTrackInQueue({ playerData, setPlayerData })}
        className="mx-1 text-[30px] cursor-pointer opacity-75 hover:opacity-100"
      />
    </div>
  );
}
