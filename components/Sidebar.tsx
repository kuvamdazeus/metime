import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../state/user";
import { IPlaylistPoster } from "../types/songs";
import { IUser } from "../types/user";
import { getSidebarData } from "../utils/dataFetching";

export default function Sidebar() {
  const user = useRecoilValue(userAtom) as IUser;

  const [playlists, setPlaylists] = useState<IPlaylistPoster[]>([]);

  useEffect(() => {
    getSidebarData(user)
      .then((playlistsData) => setPlaylists(playlistsData))
      .catch((err) => console.error("SHUCK!", err));
  }, []);

  return (
    <section className="">
      <div className="relative">
        <img className="filter blur-[30px] object-cover h-56" src={user.metadata.image_url as string} />

        <div className="absolute flex justify-center items-center top-0 h-full w-full">
          <p className="text-center font-bold text-4xl text-white">Hi, {user.metadata.name.split(" ")[0]} 👋🏻</p>
        </div>
      </div>

      <div className="mt-12">
        {playlists.map((playlist) => (
          <section className="mx-2 p-2 flex mb-1 items-center rounded-lg cursor-pointer hover:bg-[#505050]">
            <img src={playlist.images.low} className="rounded object-contain h-9 mr-2" />
            <div>
              <p className="text-white text-sm">{playlist.name}</p>
              <p className="text-[10px] text-gray-300 font-light">{playlist.total_tracks} songs</p>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
