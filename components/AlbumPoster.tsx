import { useRouter } from "next/router";
import { IoPlay } from "react-icons/io5";
import { IAlbumPoster } from "../types/songs";

interface Props {
  album: IAlbumPoster;
}

export default function AlbumPoster({ album }: Props) {
  const router = useRouter();

  return (
    <div
      className="
        p-4 mr-5 w-56 h-80 bg-[#292929] hover:bg-[#303030] flex-shrink-0
        transition-all duration-500 cursor-pointer flex flex-col justify-between
        text-white
      "
    >
      <img src={album.image} className="object-contain bg-black w-full h-[192px] mb-5" />
      <section className="relative flex items-end justify-between">
        <div>
          <p className={`${album.name.length > 50 ? "text-xs" : "text-sm"} font-bold mb-2`}>{album.name}</p>
          <p className="text-[10px] text-gray-400 mb-3 tracking-[0.04rem]">
            {album.type.toUpperCase()} · <span className="">{album.release_date.split("-")[0]}</span>
          </p>
        </div>

        <div
          className="
            rounded-full bg-green-500 p-2.5 cursor-pointer absolute right-0
            transition-all duration-100 transform hover:scale-110
          "
          onClick={() => router.push("/album/" + album.id)}
        >
          <IoPlay className="text-lg rounded-full text-black" />
        </div>
      </section>
    </div>
  );
}
