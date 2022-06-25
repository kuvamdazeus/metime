import { useRecoilState } from "recoil";
import playerAtom from "../state/player";
import { IRecommendedTrack } from "../types/track";

interface Props {
  song: IRecommendedTrack;
}

export default function QueueSong({ song }: Props) {
  const [playerData, setPlayerData] = useRecoilState(playerAtom);

  const isCurrentlyPlaying = playerData?.current_song.id === song.id;

  return (
    <section
      className={`
        px-3
        ${isCurrentlyPlaying ? "py-7" : "py-3"}
        ${isCurrentlyPlaying ? "bg-[#00781670]" : "hover:bg-[#363636]"}
      `}
    >
      <div className="flex items-center">
        <img src={song.image_url} className="h-12 mr-3 object-contain cursor-pointer" />

        <div className="">
          <p className="font-bold cursor-pointer hover:underline">{song.name}</p>
          <p className="text-xs text-gray-400">{song?.artists && song.artists.join(", ")}</p>
        </div>
      </div>
    </section>
  );
}
