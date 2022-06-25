import { useRecoilState, useRecoilValue } from "recoil";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiHeartAddLine } from "react-icons/ri";
import { BiAddToQueue } from "react-icons/bi";
import { IRecommendedTrack } from "../types/track";
import playerAtom from "../state/player";
import { playTrack } from "../utils/player";
import userAtom from "../state/user";
import { addToSavedSongs } from "../utils/dataFetching";
import { IUser } from "../types/user";
import useToast from "../utils/hooks/useToast";

interface Props {
  song: IRecommendedTrack;
  group: IRecommendedTrack[];
}

export default function Song({ song, group }: Props) {
  const toggleToast = useToast();

  const [playerData, setPlayerData] = useRecoilState(playerAtom);

  const user = useRecoilValue(userAtom);
  // const dashboardData = useRecoilValue(dashboardAtom);

  return (
    <section
      className={`
        flex items-center justify-between p-3 ${
          playerData && playerData.current_song.id === song.id && "bg-[#09ff000e]"
        }
        hover:bg-[#272727] transition-all duration-200
      `}
    >
      <div className="flex items-center">
        <img
          src={song.image_url}
          onClick={() => playTrack(song, group, { user, setPlayerData })}
          className="h-12 mr-3 object-contain cursor-pointer"
        />
        <div className="">
          <p
            className="font-bold cursor-pointer hover:underline"
            onClick={() => playTrack(song, group, { user, setPlayerData })}
          >
            {song.name}
          </p>
          <p className="text-xs text-gray-400">{song?.artists && song.artists.join(", ")}</p>
        </div>
      </div>

      <div className="flex items-center">
        <BiAddToQueue
          className="text-white text-xl mr-3 cursor-pointer"
          onClick={() => {
            if (!playerData) return null;

            if (playerData.queue.filter((queueSong) => queueSong.id === song.id).length !== 0)
              return toggleToast({ message: "Song already in queue", type: "error" });

            setPlayerData({
              ...playerData,
              queue: [song, ...playerData?.queue],
            });
            toggleToast({ message: "Song added to queue", type: "message" });
          }}
        />

        <RiHeartAddLine
          onClick={() =>
            addToSavedSongs(user as IUser, song.id)
              .then(() => toggleToast({ message: "Added to your Liked Tracks", type: "message" }))
              .catch(() => toggleToast({ message: "Error adding to saved tracks!", type: "error" }))
          }
          className="text-white text-xl cursor-pointer"
        />
      </div>
    </section>
  );
}
