import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { IoPlay } from "react-icons/io5";
import { dashboardAtom } from "../state/dashboard";
import userAtom from "../state/user";
import { IAlbumPoster, IPlaylistPoster } from "../types/songs";
import { IUser } from "../types/user";
import useRecomData from "../utils/hooks/useRecomData";
import Song from "./Song";
import playerAtom from "../state/player";
import AlbumPoster from "./AlbumPoster";
import { useRouter } from "next/router";
import Pagination from "./Pagination";
import useDashboardData from "../utils/hooks/useDashboardData";

export default function Dashboard() {
  const router = useRouter();

  const { saveRecommendations } = useRecomData();

  const { getDashboardItems } = useDashboardData();

  const [dashboardData, setDashboardData] = useRecoilState(dashboardAtom);

  const [userTopAlbums, setTopAlbums] = useState<IAlbumPoster[]>([]);
  const [userTopArtists, setTopArtists] = useState<{ id: string; name: string; image: string }[]>([]);
  const [userPlaylists, setPlaylists] = useState<IPlaylistPoster[]>([]);

  const user = useRecoilValue(userAtom) as IUser;
  const playerData = useRecoilValue(playerAtom);

  const greeting = () => {
    const hours = new Date().getHours();
    if (hours < 12 && hours > 6) return "Morning";
    if (hours > 12 && hours < 17) return "Afternoon";
    return "Evening";
  };

  const generateColor = () => {
    if (playerData?.playing) {
      const energy = Math.round(playerData.track_energy * 10);
      if (energy <= 5) return "#00ca22";
      if (energy <= 6) return "#0047ca";
      if (energy <= 7) return "#d35400";
      else return "#d400b1";
    }

    const timeOfDay = greeting().toLowerCase().trim();
    if (timeOfDay === "morning") return "#007c76";
    if (timeOfDay === "afternoon") return "#e9d200";
    return "#7c0000";
  };

  const [color, setColor] = useState(generateColor());
  useEffect(() => {
    saveRecommendations();
    getDashboardItems()
      .then(({ topAlbums, topArtists, playlists }) => {
        setTopAlbums(topAlbums);
        setTopArtists(topArtists);
        setPlaylists(playlists);
      })
      .catch((err) => console.error(err, "ERROR in fetching dashboard items"));

    // setInterval(() => {
    //   console.log("generateColor()", generateColor());
    //   setColor(generateColor());
    // }, 1000);
  }, []);

  useEffect(() => {
    setColor(generateColor());
  }, [playerData]);

  return (
    <section className="text-white pb-24 bg-[#242424] min-h-screen">
      <section
        className={`
          px-16 pt-16 pb-10 mb-5 transition-all duration-500 ease-in-out
        `}
        style={{
          background: `radial-gradient(circle, ${color} 0%, #242424 100%)`,
          // backgroundImage: `linear-gradient(${color}, #242424, #242424)`,
        }}
      >
        <p className="text-3xl font-bold mb-10">
          Good {greeting()}, {user.metadata.name.split(" ")[0]}
        </p>

        <section className="flex items-center flex-wrap">
          {userPlaylists.map((playlist) => (
            <section
              className="
                flex-shrink-0 mx-2 flex mb-5 items-center rounded-[5px] w-96
                cursor-pointer bg-[rgba(46,46,46,0.33)] hover:bg-[rgba(199,199,199,0.19)]
                transition-all ease-in-out duration-300
              "
              onClick={() => router.push("/playlist/" + playlist.id)}
            >
              <img src={playlist.images.low} className="rounded-l-[5px] object-contain h-[80px] mr-5" />
              <p className="text-white font-bold text-[15px]">
                {playlist.name}{" "}
                <span className="ml-1 font-light text-[10px] text-gray-300">({playlist.total_tracks})</span>
              </p>
            </section>
          ))}
        </section>
      </section>

      {/* Top artists */}
      <section className="py-10 px-5">
        <p className="text-2xl font-bold mb-3">Your Most Loved Artists</p>
        <section className="flex items-center overflow-x-scroll">
          {userTopArtists.map((artist) => (
            <div
              className="
                p-4 mr-5 w-48 h-72 bg-[#292929] hover:bg-[#303030] flex-shrink-0 rounded
                transition-all duration-500 cursor-pointer flex flex-col justify-between
              "
            >
              <img
                src={artist.image}
                className="object-contain bg-black w-full h-[160px] rounded-full shadow-[#0000003f] shadow-xl mb-5"
              />
              <section className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-bold mb-2">{artist.name}</p>
                  <p className="text-[10px] text-gray-400 mb-3 tracking-[0.04rem]">ARTIST</p>
                </div>

                <div
                  className="
                    rounded-full bg-green-500 p-2.5 cursor-pointer
                    transition-all duration-100 transform hover:scale-110
                  "
                  onClick={() => router.push("/artist/" + artist.id)}
                >
                  <IoPlay className="text-lg rounded-full text-black" />
                </div>
              </section>
            </div>
          ))}
        </section>
      </section>

      {/* Continue listening */}

      {/* Top albums */}
      <section className="py-10 px-5">
        <p className="text-2xl font-bold mb-3">Your Most Loved Albums</p>
        <section className="flex items-center overflow-x-scroll overflow-y-hidden">
          {userTopAlbums.map((album) => {
            return <AlbumPoster album={album as IAlbumPoster} />;
          })}
        </section>
      </section>

      {/* Suggested For You */}
      <section className="m-2 p-3 rounded">
        <section className="flex items-center justify-between">
          <p className="text-2xl font-bold mb-3">Made For {user.metadata.name}</p>
          <Pagination />
        </section>

        <section className="h-[450px] overflow-y-scroll">
          {dashboardData &&
            dashboardData.fetched_tracks &&
            dashboardData.fetched_tracks.map((recom) => (
              <Song song={recom} group={dashboardData.fetched_tracks} />
            ))}
        </section>
      </section>
    </section>
  );
}
