import { useRecoilState } from "recoil";
import { MdClose } from "react-icons/md";
import playerAtom from "../state/player";
import QueueSong from "./QueueSong";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setQueueIsOpened: Dispatch<SetStateAction<boolean>>;
}

export default function Queue({ setQueueIsOpened }: Props) {
  const [playerData, setPlayerData] = useRecoilState(playerAtom);

  return (
    <section className="fixed z-50 flex justify-end bottom-0 right-0 h-screen w-screen backdrop-blur-sm overflow-y-scroll overscroll-contain">
      <section className="w-1/2 text-white">
        <section className="flex justify-end items-center bg-[#272727d6]">
          <MdClose
            onClick={() => setQueueIsOpened(false)}
            className="text-3xl m-3 cursor-pointer transform hover:scale-110"
          />
        </section>

        {playerData?.previous_tracks.map((previouslyPlayedTrack) => (
          <QueueSong song={previouslyPlayedTrack} />
        ))}

        {playerData?.current_song && <QueueSong song={playerData?.current_song} />}

        {playerData?.queue.map((queueSong) => (
          <QueueSong song={queueSong} />
        ))}
      </section>
    </section>
  );
}
