import { MutableRefObject, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import ReactPlayer from "react-player";
import {
  MdOutlinePlayCircleFilled,
  MdOutlinePauseCircleFilled,
  MdSkipNext,
  MdSkipPrevious,
  MdForward10,
  MdForward30,
  MdReplay10,
  MdReplay30,
} from "react-icons/md";
import { BiExitFullscreen } from "react-icons/bi";
import playerAtom, { playerFullscreenAtom } from "../state/player";
import { playNextTrackInQueue, playPreviousTrackInQueue } from "../utils/player";

export default function FullscreenPlayer({ playerRef }: { playerRef: MutableRefObject<ReactPlayer | null> }) {
  const [durationBarInterval, setDurationBarInterval] = useState<NodeJS.Timer | null>(null);
  const [durationPercent, setDurationPercent] = useState("");

  const [playerData, setPlayerData] = useRecoilState(playerAtom);
  const setPlayerFullscreen = useSetRecoilState(playerFullscreenAtom);

  useEffect(() => {
    console.log("PLAYER STATE CHANGE (useEffect)", playerData);

    const updateDurationBar = () => {
      const fractionDone = playerRef.current ? playerRef.current.getCurrentTime() / playerRef.current.getDuration() : 0;
      setDurationPercent(`${Math.round(fractionDone * 100)}%`);
    };

    if (playerData?.playing && !durationBarInterval) setDurationBarInterval(setInterval(updateDurationBar, 1000));
    else if (!playerData?.playing) {
      clearInterval(durationBarInterval as NodeJS.Timeout);
      setDurationBarInterval(null);
    }
  }, [playerData]);

  return (
    <section className="bg-[#272727] w-screen h-screen relative flex justify-center items-center">
      <img
        className="w-screen h-screen absolute z-0 filter blur-[20px] opacity-[30%]"
        src={playerData?.current_song.image_url}
      />

      <div className="absolute z-22 w-full lg:w-1/3 bg-[rgba(255,255,255,0.1)] h-fit">
        <div className="relative p-5">
          <img className="object-contain w-max mb-7 shadow-lg rounded" src={playerData?.current_song.image_url} />

          <p className="text-2xl text-white font-bold">{playerData?.current_song.name}</p>
          <p className="text-sm font-thin text-gray-300 mb-10">{playerData?.current_song.artists.join(", ")}</p>

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

          <section className="absolute bottom-0 left-0 w-full">
            <div className="h-1 bg-blue-400 transition-all duration-300" style={{ width: durationPercent }} />
          </section>
        </div>
      </div>

      <div onClick={() => setPlayerFullscreen(false)} className="absolute bottom-8 right-0">
        <BiExitFullscreen
          className="
            text-white duration-300 ml-auto mr-3 text-[28px] cursor-pointer hover:scale-125
          "
        />
      </div>
    </section>
  );
}
